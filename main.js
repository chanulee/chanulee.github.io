(() => {
    const page = document.getElementById('page');
    const sections = [...page.querySelectorAll('.sec')];
    const byName = Object.fromEntries(sections.map(s => [s.dataset.sec, s]));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

    // The travelling section eases in and out, so what is in its way has time to clear.
    const MOVE = 760;
    const MOVE_CURVE = [0.6, 0, 0.1, 1];
    const MOVE_EASE = `cubic-bezier(${MOVE_CURVE})`;

    /* Time fraction at which a cubic-bezier easing reaches a given progress. */
    const timeAt = (() => {
        const [x1, y1, x2, y2] = MOVE_CURVE;
        const axis = (p1, p2) => u => 3 * (1 - u) * (1 - u) * u * p1 + 3 * (1 - u) * u * u * p2 + u * u * u;
        const X = axis(x1, x2);
        const Y = axis(y1, y2);
        return progress => {
            if (progress <= 0) return 0;
            if (progress >= 1) return 1;
            let lo = 0, hi = 1;
            for (let i = 0; i < 24; i++) {
                const mid = (lo + hi) / 2;
                if (Y(mid) < progress) lo = mid; else hi = mid;
            }
            return X((lo + hi) / 2);
        };
    })();

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
        const LINES = '.toggle, .label, .rows > li, .body li, .body p';
        const shown = el => el.getClientRects().length > 0;
        const linesOf = sec => [...sec.querySelectorAll(LINES)].filter(shown);
        const rectOf = el => el.getBoundingClientRect();

        const wasVisible = new Map(sections.map(s => [s, visible(s)]));
        const firstSec = new Map(sections.map(s => [s, rectOf(s)]));
        const targets = flipTargets();
        const first = new Map(targets.map(el => [el, rectOf(el)]));
        const firstLines = new Map(sections.map(s => [s, linesOf(s).map(el => [el, rectOf(el)])]));

        // 3. Last: switch state, then measure again.
        stopAll();
        apply(name);
        window.scrollTo(0, 0);
        const pageTop = rectOf(page).top;
        const last = new Map(targets.map(el => [el, rectOf(el)]));

        const leaving = sections.filter(s => wasVisible.get(s) && !visible(s));
        const returning = sections.filter(s => !wasVisible.get(s) && visible(s));

        // 4. Movers: everything that stays on screen and changes position. They
        //    set off one line after another, leading edge first, so the block
        //    stretches out as it accelerates and gathers again as it lands.
        const baseDelay = leaving.length ? 60 : 0;
        const CASCADE = 30;
        const movers = [];
        let travel = 0;
        targets.forEach(el => {
            const sec = el.closest('.sec');
            if (sec && !(wasVisible.get(sec) && visible(sec))) return;
            const a = first.get(el);
            const b = last.get(el);
            const dx = a.left - b.left;
            const dy = a.top - b.top;
            if (!dx && !dy) return;
            travel = Math.max(travel, Math.abs(dy));
            movers.push({ el, a, b, dx, dy, delay: baseDelay });
        });
        const goingUp = movers.reduce((sum, m) => sum + m.dy, 0) > 0;
        movers.sort((p, q) => goingUp ? p.a.top - q.a.top : q.a.top - p.a.top);
        let step = -1, lead = null;
        movers.forEach(m => {
            if (lead === null || Math.abs(m.a.top - lead) > 10) { step++; lead = m.a.top; }
            m.delay = baseDelay + step * CASCADE;
            m.el.animate(
                [{ transform: `translate(${m.dx}px, ${m.dy}px)` }, { transform: 'none' }],
                { duration: MOVE, delay: m.delay, easing: MOVE_EASE, fill: 'backwards' }
            );
        });
        const landed = baseDelay + step * CASCADE;

        // When (in ms) do the movers sweep across a given rect? → [enter, exit] or null.
        const GAP = 6;
        function sweep(r) {
            let enter = Infinity, exit = -Infinity;
            movers.forEach(({ a, b, delay }) => {
                if (Math.max(a.right, b.right) < r.left || Math.min(a.left, b.left) > r.right) return;
                // Mover top(p) = a.top + (b.top - a.top) p. Overlap while
                // top(p) < r.bottom + GAP  and  top(p) + height > r.top - GAP.
                const d = b.top - a.top;
                const lo = r.top - GAP - a.height;
                const hi = r.bottom + GAP;
                let p0, p1;
                if (d === 0) {
                    if (a.top <= lo || a.top >= hi) return;
                    p0 = 0; p1 = 1;
                } else {
                    const u = (lo - a.top) / d, v = (hi - a.top) / d;
                    p0 = Math.max(0, Math.min(u, v));
                    p1 = Math.min(1, Math.max(u, v));
                    if (p0 >= p1) return;
                }
                enter = Math.min(enter, delay + MOVE * timeAt(p0));
                exit = Math.max(exit, p1 >= 1 ? Infinity : delay + MOVE * timeAt(p1));
            });
            return enter === Infinity ? null : [enter, exit];
        }
        const overlaps = (a, b) =>
            a.left < b.right && b.left < a.right && a.top < b.bottom + GAP && b.top < a.bottom + GAP;

        // 5. Leaving sections hold their place and clear out line by line, from the
        //    bottom up — and always before a mover reaches them.
        const cleared = []; // [rect, time it is fully gone]
        const out = [];
        leaving.forEach(sec => {
            sec.style.top = (firstSec.get(sec).top - pageTop) + 'px';
            firstLines.get(sec).forEach(([el, r]) => out.push({ el, r, sec }));
        });
        out.sort((p, q) => q.r.top - p.r.top);
        let rank = -1, prevTop = null, outEnd = 0;
        out.forEach(item => {
            if (item.r.top !== prevTop) { rank++; prevTop = item.r.top; }
            let start = rank * 22;
            let dur = 170;
            const hit = sweep(item.r);
            if (hit && start + dur > hit[0]) {
                start = Math.max(0, hit[0] - dur);
                dur = Math.max(40, hit[0] - start);
            }
            item.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: dur, delay: start, easing: 'ease-out', fill: 'both' });
            cleared.push([item.r, start + dur]);
            outEnd = Math.max(outEnd, start + dur);
        });
        leaving.forEach(sec => {
            const hold = sec.animate([{ visibility: 'visible' }, { visibility: 'visible' }], { duration: outEnd + 20 });
            hold.finished.then(() => {
                firstLines.get(sec).forEach(([el]) => el.getAnimations().forEach(a => a.cancel()));
            }).catch(() => {});
        });

        // Anything appearing waits for the spot to be free: movers gone past,
        // leaving lines fully faded.
        function freeAt(r) {
            let t = 0;
            const hit = sweep(r);
            if (hit && hit[1] !== Infinity) t = hit[1];
            cleared.forEach(([c, end]) => { if (overlaps(r, c)) t = Math.max(t, end); });
            return t;
        }

        // 6. Returning sections come back line by line, from the top down.
        const back = [];
        returning.forEach(sec => linesOf(sec).forEach(el => back.push({ el, r: rectOf(el) })));
        back.sort((p, q) => p.r.top - q.r.top);
        rank = -1; prevTop = null;
        back.forEach(item => {
            if (item.r.top !== prevTop) { rank++; prevTop = item.r.top; }
            const start = Math.max(140 + rank * 26, freeAt(item.r));
            item.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: start, easing: 'ease-out', fill: 'backwards' });
        });

        // 7. The opened section's extra content rises in line by line, once the
        //    section has landed and the space is clear.
        if (name) {
            const base = travel > 40 ? landed + MOVE * 0.55 : 160;
            const lines = [];
            byName[name].querySelectorAll('.extra').forEach(el => {
                if (el.matches('li')) lines.push(el);
                else lines.push(...el.querySelectorAll('p, li'));
            });
            let prev = -Infinity;
            lines.forEach((el, i) => {
                // Never out of order: a line waits for the one above it.
                const start = Math.max(base + Math.min(i, 24) * 28, freeAt(rectOf(el)), prev + 28);
                prev = start;
                el.animate(
                    [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
                    { duration: 520, delay: start, easing: EASE, fill: 'backwards' }
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

    // Sticky header: its backdrop and fade only switch on once content scrolls under it.
    const onScroll = () => page.classList.toggle('is-scrolled', window.scrollY > 1);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

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
            page.style.setProperty('--lede-h', lede.offsetHeight + 'px');
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
            page.style.setProperty('--lede-h', Math.ceil(max) + 'px');
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
