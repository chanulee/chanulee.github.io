(() => {
    const page = document.getElementById('page');
    const sections = [...page.querySelectorAll('.sec')];
    const byName = Object.fromEntries(sections.map(s => [s.dataset.sec, s]));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const MOVE = 700;

    let open = null;   // what the DOM currently shows
    let want = null;   // what the latest click asked for
    let run = 0;

    /* Write the state to the DOM. All layout comes from CSS (.has-open / .is-open). */
    function apply(name) {
        open = name;
        page.classList.toggle('has-open', !!name);
        sections.forEach(sec => {
            const on = sec.dataset.sec === name;
            sec.classList.toggle('is-open', on);
            sec.style.top = '';
            sec.querySelector('.toggle').setAttribute('aria-expanded', String(on));
        });
    }

    const flipTargets = () => [page.querySelector('.lede'), ...page.querySelectorAll('[data-flip]')];
    const visible = sec => getComputedStyle(sec).visibility !== 'hidden';
    const stopAll = () => page.getAnimations({ subtree: true })
        .filter(a => !(a instanceof CSSTransition))
        .forEach(a => a.cancel());

    function fade(el, from, to, opts) {
        return el.animate(
            [{ opacity: from, visibility: 'visible' }, { opacity: to, visibility: 'visible' }],
            { easing: 'ease-out', fill: 'backwards', ...opts }
        );
    }

    async function setOpen(name) {
        want = name;
        const id = ++run;
        if (name === open) {
            // Re-opened mid-close: bring the fading content back.
            stopAll();
            return;
        }
        const animate = !reduced.matches && 'animate' in Element.prototype;

        if (!animate) {
            apply(name);
            window.scrollTo(0, 0);
            return;
        }

        stopAll();

        // 1. Closing: let the expanded content fade away before anything moves.
        if (open) {
            const extras = [...byName[open].querySelectorAll('.extra')];
            if (extras.length) {
                await Promise.all(extras.map(el =>
                    fade(el, 1, 0, { duration: 160, fill: 'forwards' }).finished.catch(() => {})
                ));
                if (id !== run) return;
            }
        }

        // 2. First: where everything is right now.
        const wasVisible = new Map(sections.map(s => [s, visible(s)]));
        const pageTop = page.getBoundingClientRect().top;
        const firstTop = new Map(sections.map(s => [s, s.getBoundingClientRect().top - pageTop]));
        const targets = flipTargets();
        const first = new Map(targets.map(el => [el, el.getBoundingClientRect()]));

        // 3. Last: switch state, then measure again.
        stopAll();
        apply(name);
        window.scrollTo(0, 0);
        const last = new Map(targets.map(el => [el, el.getBoundingClientRect()]));

        // 4. Play.
        sections.forEach(sec => {
            const was = wasVisible.get(sec);
            const is = visible(sec);

            if (was && !is) {
                // Leaving: hold its old place and fade out.
                sec.style.top = firstTop.get(sec) + 'px';
                sec.animate(
                    [{ opacity: 1, visibility: 'visible' }, { opacity: 0, visibility: 'visible' }],
                    { duration: 220, easing: 'ease-out' }
                );
            } else if (!was && is) {
                // Returning: fade in once the moving section is nearly home.
                fade(sec, 0, 1, { duration: 420, delay: 240 });
            }
        });

        let travel = 0;
        targets.forEach(el => {
            const sec = el.closest('.sec');
            if (sec && !(wasVisible.get(sec) && visible(sec))) return;
            const a = first.get(el);
            const b = last.get(el);
            const dx = a.left - b.left;
            const dy = a.top - b.top;
            if (!dx && !dy) return;
            if (sec && sec.dataset.sec === name) travel = Math.max(travel, Math.abs(dy));
            el.animate(
                [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
                { duration: MOVE, easing: EASE }
            );
        });

        if (name) {
            // The new content rises in line by line — after the section has
            // landed, if it had to travel up the page to get here.
            const base = travel > 40 ? 400 : 160;
            const lines = [];
            byName[name].querySelectorAll('.extra').forEach(el => {
                if (el.matches('li')) lines.push(el);
                else lines.push(...el.querySelectorAll('p, li'));
            });
            lines.forEach((el, i) => {
                el.animate(
                    [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
                    { duration: 520, delay: base + Math.min(i, 24) * 28, easing: EASE, fill: 'backwards' }
                );
            });
        }
    }

    function toggle(name) {
        const next = want === name ? null : name;
        setOpen(next);
        history.replaceState(null, '', next ? '#' + next : location.pathname + location.search);
    }

    sections.forEach(sec => {
        sec.querySelector('.toggle').addEventListener('click', () => toggle(sec.dataset.sec));
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && want) toggle(want);
    });

    window.addEventListener('hashchange', () => {
        const name = location.hash.slice(1);
        setOpen(byName[name] ? name : null);
    });

    // Deep link: /#events opens straight into that section, no animation.
    const initial = location.hash.slice(1);
    if (byName[initial]) apply(want = initial);

    /* Headline: "Chanwoo" is there from the start and the rest animates in.
       After that the closing phrase animates out and the next one animates in.
       Three variants (data-variant on the <h1>, or ?h=a|b|c):
         a  typewriter — letter by letter, deleting faster than it types
         b  soft       — each letter eases in and out of a blur
         c  soft words — the same, a whole word at a time */
    (function headline() {
        const lede = page.querySelector('.lede');
        const typed = lede.querySelector('.typed');
        if (!typed) return;

        const phrases = (lede.dataset.phrases || '').split('|').map(s => s.trim()).filter(Boolean);
        const asked = new URLSearchParams(location.search).get('h');
        const variant = ['a', 'b', 'c'].includes(asked) ? asked : (lede.dataset.variant || 'b');
        lede.dataset.variant = variant;

        if (!phrases.length || reduced.matches) {
            typed.classList.add('is-on');
            return;
        }

        const STEM = 'is a design engineer';
        const HOLD = 2600;
        const wait = ms => new Promise(r => setTimeout(r, ms));
        const span = (cls, text) => {
            const el = document.createElement('span');
            el.className = cls;
            if (text) el.textContent = text;
            return el;
        };

        // "two words" → [space] <w><c>t</c><c>w</c><c>o</c></w> [space] <w>…</w>
        function build(parent, text) {
            const units = [];
            text.split(' ').forEach(word => {
                parent.append(' ');
                const w = span('w');
                [...word].forEach(ch => w.append(span('c', ch)));
                parent.append(w);
                units.push(...(variant === 'c' ? [w] : w.children));
            });
            return units;
        }

        typed.textContent = '';
        const stemUnits = build(typed, STEM);
        const swap = span('swap');
        typed.append(swap);
        let units = build(swap, phrases[0]);
        typed.classList.add('is-on');

        // Lock the headline to its tallest phrase at this width, so the page
        // below never moves while phrases of different lengths rotate.
        const ruler = lede.cloneNode(false);
        ruler.removeAttribute('data-phrases');
        ruler.removeAttribute('aria-label');
        ruler.setAttribute('aria-hidden', 'true');
        ruler.classList.add('measure');
        ruler.append(lede.querySelector('strong').cloneNode(true));
        const rulerTyped = span('typed is-on');
        build(rulerTyped, STEM);
        const rulerSwap = span('swap');
        rulerTyped.append(rulerSwap);
        ruler.append(rulerTyped);

        function lockHeight() {
            page.append(ruler);
            let max = 0;
            phrases.forEach(phrase => {
                rulerSwap.textContent = '';
                build(rulerSwap, phrase);
                max = Math.max(max, ruler.getBoundingClientRect().height);
            });
            ruler.remove();
            lede.style.minHeight = Math.ceil(max) + 'px';
        }

        lockHeight();
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(lockHeight);
        let lastWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            if (window.innerWidth === lastWidth) return;
            lastWidth = window.innerWidth;
            lockHeight();
        });

        // Per-variant pacing: [ms between units going in, going out, settle time after the last one]
        const PACE = {
            a: { in: () => 28 + Math.random() * 30, out: () => 14, settleIn: 0, settleOut: 180 },
            b: { in: () => 30, out: () => 12, settleIn: 600, settleOut: 380 },
            c: { in: () => 110, out: () => 60, settleIn: 800, settleOut: 420 }
        }[variant];

        async function show(list) {
            for (const el of list) {
                el.classList.add('on');
                await wait(PACE.in());
            }
            await wait(PACE.settleIn);
        }

        async function hide(list) {
            for (const el of [...list].reverse()) {
                el.classList.remove('on');
                await wait(PACE.out());
            }
            await wait(PACE.settleOut);
        }

        (async () => {
            await wait(350);
            await show([...stemUnits, ...units]);

            for (let n = 1; phrases.length > 1; n = (n + 1) % phrases.length) {
                await wait(HOLD);
                await hide(units);
                swap.textContent = '';
                units = build(swap, phrases[n]);
                lede.setAttribute('aria-label', `Chanwoo ${STEM} ${phrases[n]}`);
                swap.offsetWidth; // commit the hidden state before revealing
                await show(units);
            }
        })();
    })();

    /* Email: tap to copy, the text confirms with "copied". */
    document.querySelectorAll('.copy').forEach(btn => {
        const label = btn.textContent;
        let timer;
        btn.addEventListener('click', async () => {
            const text = btn.dataset.copy;
            try {
                await navigator.clipboard.writeText(text);
            } catch (err) {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', '');
                ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
                document.body.append(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
            }
            btn.textContent = 'copied';
            btn.classList.add('is-copied');
            clearTimeout(timer);
            timer = setTimeout(() => {
                btn.textContent = label;
                btn.classList.remove('is-copied');
            }, 1600);
        });
    });

    /* Live clocks — "Seoul 21:04 KST". */
    const clocks = [...document.querySelectorAll('[data-clock]')].map(el => ({
        el,
        zone: el.dataset.zone,
        fmt: new Intl.DateTimeFormat('en-GB', {
            timeZone: el.dataset.clock,
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
            timeZoneName: 'short'
        })
    }));

    function tick() {
        const now = new Date();
        clocks.forEach(({ el, zone, fmt }) => {
            const parts = Object.fromEntries(fmt.formatToParts(now).map(p => [p.type, p.value]));
            el.textContent = `${parts.hour}:${parts.minute} ${zone || parts.timeZoneName}`;
            el.dateTime = now.toISOString();
        });
    }

    tick();
    setInterval(tick, 10000);
})();
