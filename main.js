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

    /* Headline: "Chanwoo" is there from the start, the rest types in. After that
       the closing phrase is deleted word by word and rewritten word by word. */
    (function headline() {
        const lede = page.querySelector('.lede');
        const typed = lede.querySelector('.typed');
        const phrases = (lede.dataset.phrases || '').split('|').map(s => s.trim()).filter(Boolean);
        if (!typed) return;
        if (!phrases.length || reduced.matches) {
            typed.classList.add('is-on');
            return;
        }

        const stem = ' is a design engineer ';
        const wait = ms => new Promise(r => setTimeout(r, ms));
        const say = words => {
            typed.textContent = stem + words.join(' ');
            lede.setAttribute('aria-label', 'Chanwoo' + typed.textContent);
        };

        (async () => {
            // First load: type the whole sentence, character by character.
            const full = stem + phrases[0];
            typed.textContent = '';
            typed.classList.add('is-on');
            await wait(350);
            for (let i = 1; i <= full.length; i++) {
                typed.textContent = full.slice(0, i);
                const ch = full[i - 1];
                await wait(ch === ' ' ? 55 : 26 + Math.random() * 30);
            }

            // Then rotate the phrase, a word at a time.
            let words = phrases[0].split(' ');
            for (let n = 1; phrases.length > 1; n = (n + 1) % phrases.length) {
                await wait(2600);
                while (words.length) {
                    words.pop();
                    say(words);
                    await wait(110);
                }
                await wait(260);
                for (const word of phrases[n].split(' ')) {
                    words.push(word);
                    say(words);
                    await wait(150);
                }
            }
        })();
    })();

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
