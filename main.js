(() => {
    const page = document.getElementById('page');
    const sections = [...page.querySelectorAll('.sec')];
    const byName = Object.fromEntries(sections.map(s => [s.dataset.sec, s]));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

    // The travelling section eases in and out, so what is in its way has time to clear.
    const MOVE_MAX = 760;       // the long trip from the bottom of the page; shorter moves take less
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
    let settleTimer;

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
    // Every animation a transition starts is kept here, so cleaning up never
    // depends on what the browser reports back from getAnimations().
    const live = new Set();
    const play = (el, frames, opts) => {
        const a = el.animate(frames, opts);
        live.add(a);
        return a;
    };
    const stopAll = () => {
        live.forEach(a => { try { a.cancel(); } catch (e) {} });
        live.clear();
        try {
            page.getAnimations({ subtree: true })
                .filter(a => !(a instanceof CSSTransition) && !(a instanceof CSSAnimation))
                .forEach(a => a.cancel());
        } catch (e) {}
        unsplit();
    };

    /* Paragraphs reveal one rendered line at a time. The line breaks are read
       from the paragraph as the browser has already laid it out — nothing is
       re-wrapped — and for the length of the animation each of those lines
       becomes its own unbreakable block. Afterwards the paragraph gets its
       plain text back, wrapping exactly as before. */
    const splitText = new Map();   // paragraph → original HTML

    function splitLines(p) {
        if (splitText.has(p)) return [...p.querySelectorAll('.ln')].map(line => [line]);
        // Only plain text and <br>; anything richer is revealed as one piece.
        if ([...p.childNodes].some(node => node.nodeType === 1 && node.tagName !== 'BR')) return [[p]];

        const lines = [];
        const range = document.createRange();
        let top = null;
        p.childNodes.forEach(node => {
            if (node.nodeType !== 3) { top = null; return; }       // <br>: next word starts a line
            const words = /\S+/g;
            let m;
            while ((m = words.exec(node.data))) {
                range.setStart(node, m.index);
                range.setEnd(node, m.index + m[0].length);
                const rect = range.getClientRects()[0];
                if (!rect) continue;
                if (top === null || Math.abs(rect.top - top) > rect.height / 2) { lines.push([]); top = rect.top; }
                lines[lines.length - 1].push(m[0]);
            }
        });
        if (lines.length < 2) return [[p]];

        splitText.set(p, p.innerHTML);
        p.textContent = '';
        return lines.map(words => {
            const line = document.createElement('span');
            line.className = 'ln';
            line.textContent = words.join(' ');
            p.append(line);
            return [line];
        });
    }

    function unsplit() {
        splitText.forEach((html, p) => { p.innerHTML = html; });
        splitText.clear();
    }

    function fade(el, from, to, opts) {
        return play(el, 
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
        const MOVE = Math.round(Math.min(MOVE_MAX, Math.max(440, 300 + travel * 0.8)));
        const goingUp = movers.reduce((sum, m) => sum + m.dy, 0) > 0;
        movers.sort((p, q) => goingUp ? p.a.top - q.a.top : q.a.top - p.a.top);
        let step = -1, lead = null;
        movers.forEach(m => {
            if (lead === null || Math.abs(m.a.top - lead) > 10) { step++; lead = m.a.top; }
            m.delay = baseDelay + step * CASCADE;
            play(m.el, 
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
            (item.sec.fades = item.sec.fades || []).push(
                play(item.el, [{ opacity: 1 }, { opacity: 0 }], { duration: dur, delay: start, easing: 'ease-out', fill: 'both' }));
            cleared.push([item.r, start + dur]);
            outEnd = Math.max(outEnd, start + dur);
        });
        let settleAt = outEnd + 20;
        leaving.forEach(sec => {
            const fades = sec.fades || [];
            sec.fades = null;
            const hold = play(sec, [{ visibility: 'visible' }, { visibility: 'visible' }], { duration: outEnd + 20 });
            // Once the section is out of sight its lines go back to plain, fully
            // visible text, ready for when it returns.
            hold.finished.then(() => fades.forEach(a => { a.cancel(); live.delete(a); })).catch(() => {});
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
            const start = Math.min(1600, Math.max(140 + rank * 26, freeAt(item.r)));
            settleAt = Math.max(settleAt, start + 420);
            play(item.el, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: start, easing: 'ease-out', fill: 'backwards' });
        });

        // 7. The opened section's extra content rises in line by line, once the
        //    section has landed and the space is clear.
        if (name) {
            const base = travel > 40 ? landed + MOVE * 0.55 : 160;
            // A "line" is a list item, or one rendered line of a paragraph.
            const lines = [];
            const pushItem = el => {
                if (el.matches('p')) splitLines(el).forEach(words => lines.push(words));
                else lines.push([el]);
            };
            byName[name].querySelectorAll('.extra').forEach(el => {
                if (el.matches('li')) pushItem(el);
                else el.querySelectorAll('p, li').forEach(pushItem);
            });
            let prev = -Infinity;
            const playing = [];
            lines.forEach((els, i) => {
                const rects = els.map(rectOf);
                // Lines rise 10px into place, so they need that much more room below.
                const room = {
                    left: Math.min(...rects.map(r => r.left)), right: Math.max(...rects.map(r => r.right)),
                    top: Math.min(...rects.map(r => r.top)), bottom: Math.max(...rects.map(r => r.bottom)) + 10
                };
                // Never out of order: a line waits for the one above it.
                const start = Math.min(2400, Math.max(base + Math.min(i, 40) * 28, freeAt(room), prev + 28));
                settleAt = Math.max(settleAt, start + 520);
                prev = start;
                els.forEach(el => playing.push(play(el, 
                    [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
                    { duration: 520, delay: start, easing: EASE, fill: 'backwards' }
                )));
            });
        }

        // When the last animation is over, drop every one of them. From here on
        // what is on screen depends on the classes alone, whatever happened on the way.
        settleAt = Math.max(settleAt, landed + MOVE);
        clearTimeout(settleTimer);
        settleTimer = setTimeout(() => { if (id === run) stopAll(); }, settleAt + 80);
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
        if (name === 'curation' || (pager && pager.view === 'curation')) return;
        setOpen(byName[name] ? name : null);
    });

    /* ---------- Two pages: home ⇄ curation ----------
       Pull up past the bottom of the home page and the two pages slide up as one
       continuous sheet. The arrow at the top slides back. */
    const pager = (() => {
        const root = document.documentElement;
        const views = { home: document.getElementById('home'), curation: document.getElementById('curation') };
        if (!views.curation) return null;

        let view = 'home';
        let busy = false;
        let drag = null;

        const atBottom = () => window.scrollY + window.innerHeight >= root.scrollHeight - 2;
        const canPull = () => view === 'home' && !busy && !want && atBottom();

        // Pin both pages to the screen so they can be moved as cards.
        function stage(to) {
            const from = views[view];
            const next = views[to];
            const y = window.scrollY;
            next.hidden = false;
            root.classList.add('is-paging');
            from.scrollTop = y;
            next.scrollTop = to === 'home' ? next.scrollHeight : 0;
            const dir = to === 'curation' ? 1 : -1;   // 1: cards travel upwards
            const dist = window.innerHeight;
            return { from, next, to, dir, dist };
        }

        function unstage(st, landed) {
            [st.from, st.next].forEach(el => { el.style.transform = ''; });
            const shown = landed ? st.next : st.from;
            const gone = landed ? st.from : st.next;
            const y = shown.scrollTop;
            gone.hidden = true;
            root.classList.remove('is-paging');
            window.scrollTo(0, y);
            if (landed) {
                view = st.to;
                if (view === 'curation') arena.load();
            }
            busy = false;
        }

        // Animate from a pull of `px` to fully across (or back to rest).
        function run(st, px, landed, lift0 = false) {
            busy = true;
            if (reduced.matches || !('animate' in Element.prototype)) return unstage(st, landed);
            const end = landed ? st.dist : 0;
            const span = Math.abs(end - px);
            const duration = landed ? 520 : 300;
            const easing = 'cubic-bezier(0.55, 0, 0.1, 1)';
            const frames = (el, sign, offset) => el.animate([
                { transform: `translateY(${sign * (offset ? st.dist - px : px)}px)` },
                { transform: `translateY(${sign * (offset ? st.dist - end : end)}px)` }
            ], { duration, easing, fill: 'forwards' });
            const a = frames(st.from, -st.dir, false);
            const b = frames(st.next, st.dir, true);

            // One arrow makes the trip too: from the bottom edge to the top (or back),
            // turning half a circle on the way so it always points where it leads.
            let ghost;
            if (landed) {
                const bottom = window.innerHeight - 34, top = 16;
                const up = st.dir === 1;
                ghost = document.createElement('img');
                ghost.src = arrow.querySelector('img').src;
                ghost.className = 'pager-ghost';
                ghost.alt = '';
                document.body.append(ghost);
                ghost.animate(up ? [
                    { transform: `translateY(${bottom}px) rotate(0deg) scale(${px || lift0 ? 1 : 0.1})`, opacity: px || lift0 ? 1 : 0 },
                    { opacity: 1, offset: 0.25 },
                    { transform: `translateY(${top}px) rotate(180deg) scale(1)`, opacity: 1 }
                ] : [
                    { transform: `translateY(${top}px) rotate(180deg) scale(1)`, opacity: 1 },
                    { transform: `translateY(${bottom - 60}px) rotate(340deg) scale(0.9)`, opacity: 1, offset: 0.8 },
                    { transform: `translateY(${bottom}px) rotate(360deg) scale(0.1)`, opacity: 0 }
                ], { duration, easing: up ? easing : 'cubic-bezier(0.55, 0, 0.3, 1)', fill: 'forwards' });
            }

            Promise.all([a.finished, b.finished]).catch(() => {}).then(() => {
                a.cancel(); b.cancel();
                if (ghost) ghost.remove();
                unstage(st, landed);
            });
        }

        function go(to, { push = true, instant = false } = {}) {
            if (to === view || busy) return;
            if (to === 'curation' && want) return;
            if (push) history.pushState(null, '', to === 'curation' ? '#curation' : location.pathname + location.search);
            if (instant) {
                views[view].hidden = true;
                views[to].hidden = false;
                view = to;
                window.scrollTo(0, to === 'home' ? root.scrollHeight : 0);
                if (to === 'curation') arena.load();
                return;
            }
            run(stage(to), 0, true);
        }

        const arrow = document.getElementById('to-curation');
        arrow.addEventListener('click', () => go('curation'));
        document.getElementById('to-home').addEventListener('click', () => go('home'));

        /* Pulling past the bottom grows the arrow from a speck to full size; let go
           once it is full size and the page turns. The page itself is never moved
           here: where the browser rubber-bands (iOS, macOS) that motion is the
           lift, and everything else about scrolling stays native — bounce,
           pull-to-refresh at the top, momentum. */
        const ARM = 92;          // pull at which the arrow is full size
        let pull = 0;

        const resist = d => 150 * (1 - Math.exp(-Math.max(0, d) / 190));
        const overscroll = () => Math.max(0, window.scrollY + window.innerHeight - root.scrollHeight);

        function setPull(px, settle) {
            pull = px;
            arrow.classList.toggle('is-settling', !!settle);
            root.style.setProperty('--gap', overscroll() + 'px');
            root.style.setProperty('--pull', Math.min(1, px / ARM).toFixed(3));
            arrow.classList.toggle('is-armed', px >= ARM);
        }

        function turn() {
            const px = overscroll();
            const showing = pull > ARM * 0.5;
            setPull(0);
            history.pushState(null, '', '#curation');
            run(stage('curation'), px, true, showing);
        }

        window.addEventListener('touchstart', e => {
            drag = canPull() && e.touches.length === 1 ? { y: e.touches[0].clientY, on: false } : null;
        }, { passive: true });

        window.addEventListener('touchmove', e => {
            if (!drag) return;
            const pulled = drag.y - e.touches[0].clientY;
            if (!drag.on) {
                if (pulled < -8) { drag = null; return; }
                if (pulled < 6) return;
                drag.on = true;
            }
            setPull(resist(pulled - 6));
        }, { passive: true });

        const release = () => {
            if (!drag || !drag.on) { drag = null; return; }
            drag = null;
            if (pull >= ARM) turn(); else setPull(0, true);
        };
        window.addEventListener('touchend', release, { passive: true });
        window.addEventListener('touchcancel', release, { passive: true });

        // Wheel / trackpad: scrolling on past the bottom builds the same pull;
        // it turns the page as soon as the arrow is full size.
        let pushed = 0, idle;
        window.addEventListener('wheel', e => {
            if (!canPull() || drag) return;
            if (e.deltaY <= 0 && !pushed) return;
            pushed = Math.max(0, pushed + e.deltaY);
            clearTimeout(idle);
            const px = resist(pushed * 0.75);
            if (px >= ARM) {
                pushed = 0;
                turn();
                return;
            }
            setPull(px, true);
            idle = setTimeout(() => { pushed = 0; setPull(0, true); }, 180);
        }, { passive: true });

        window.addEventListener('popstate', () => {
            go(location.hash === '#curation' ? 'curation' : 'home', { push: false });
        });

        return { go, get view() { return view; } };
    })();

    /* Are.na feed for the curation page (API v3, public channels, no key).
       Loads on first visit, then page by page as you scroll. Images come as
       Are.na's small thumbnails, sized to the column they sit in. */
    const arena = (() => {
        const API = 'https://api.are.na/v3';
        const PER = 24;
        const box = document.getElementById('arena');
        const toggle = document.getElementById('arena-cols');
        const group = box ? box.dataset.group.trim() : '';
        const channels = box && box.dataset.channel.trim() ? [box.dataset.channel.trim()] : [];
        const items = [];        // { node, weight } in feed order
        let cols = 2;
        try { cols = localStorage.getItem('arena-cols') === '1' ? 1 : 2; } catch (e) {}
        let columns = [], heights = [];
        let page = 0, done = false, loading = false, started = false, sentinel;

        const el = (tag, cls, text) => {
            const node = document.createElement(tag);
            if (cls) node.className = cls;
            if (text) node.textContent = text;
            return node;
        };
        const host = url => { try { return new URL(url).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
        const get = async path => {
            const res = await fetch(API + path);
            if (!res.ok) throw new Error(res.status);
            return res.json();
        };
        // How wide an image is on screen, so the browser picks the smallest file that is sharp.
        const sizes = () => cols === 2 ? '(min-width: 768px) 197px, 46vw' : '(min-width: 768px) 402px, 92vw';

        function render(block) {
            if (block.type === 'Channel' || block.type === 'Group') return null;
            // Uploads get their file name or a UUID as a title; those are not captions.
            const named = block.title || (block.source && block.source.title) || '';
            const title = /^[0-9a-f]{8}-[0-9a-f-]{20,}$|\.(jpe?g|png|gif|webp|heic|pdf|mp4|mov)$|^(img|dsc|screenshot)[ _-]?\d/i.test(named.trim()) ? '' : named;
            const text = block.content && block.content.plain;
            if (block.type === 'Text' && text) {
                const div = el('div', 'blk blk-note');
                div.append(el('p', 'blk-text', text));
                return { node: div, weight: 1 };
            }
            const img = block.image;
            const small = img && (img.small || img.medium);
            if (!small && !title) return null;

            // Only blocks that point somewhere of their own are links; nothing opens Are.na.
            const href = (block.source && block.source.url) || (block.attachment && block.attachment.url);
            const a = el(href ? 'a' : 'div', 'blk');
            if (href) {
                a.href = href;
                a.target = '_blank';
                a.rel = 'noopener';
            }
            let weight = title ? 0.15 : 0;
            if (small) {
                const image = el('img');
                const w = +small.width, h = +small.height;
                image.loading = 'lazy';
                image.decoding = 'async';
                image.alt = img.alt_text || title;
                if (w && h) { image.width = w; image.height = h; weight += h / w; } else weight += 1;
                const set = [];
                if (w) {
                    set.push(`${small.src} ${w}w`);
                    if (small.src_2x) set.push(`${small.src_2x} ${w * 2}w`);
                    if (img.medium && +img.medium.width > w * 2) set.push(`${img.medium.src} ${+img.medium.width}w`);
                }
                if (set.length) { image.srcset = set.join(', '); image.sizes = sizes(); }
                image.src = small.src;
                a.append(image);
            }
            if (title) a.append(el('span', 'blk-title', title));
            const from = block.source && block.source.url ? host(block.source.url) : '';
            if (from) a.append(el('span', 'blk-src', from));
            // An image that leads nowhere opens large instead.
            if (small && !href) {
                const big = img.large || img.medium || small;
                a.classList.add('blk-zoom');
                a.tabIndex = 0;
                a.setAttribute('role', 'button');
                a.setAttribute('aria-label', title || 'Open image');
                const open = () => zoom(a.querySelector('img'), big.src, title);
                a.addEventListener('click', open);
                a.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
            }
            return { node: a, weight };
        }

        /* Lightbox: the tapped image grows from where it sits to the middle of the
           screen while the page behind dims and blurs. Tap anywhere, or Esc, to close. */
        let lightbox = null;

        function zoom(thumb, src, title) {
            if (lightbox || !thumb) return;
            const from = thumb.getBoundingClientRect();
            const layer = el('div', 'lightbox');
            const image = el('img');
            image.alt = title || '';
            image.src = thumb.currentSrc || thumb.src;       // instant: the file already on screen
            image.style.width = image.style.height = '100%';  // fill the layer; object-fit keeps the shape
            layer.append(image);
            document.body.append(layer);
            document.documentElement.classList.add('has-lightbox');

            // Then the sharp one, swapped in once it has arrived.
            const sharp = new Image();
            sharp.onload = () => { if (lightbox && lightbox.image === image) image.src = src; };
            sharp.src = src;

            const fit = () => {
                // Where the image actually ends up inside its box.
                const box = image.getBoundingClientRect();
                const ratio = from.width / from.height;
                const w = Math.min(box.width, box.height * ratio), h = w / ratio;
                return { left: box.left + (box.width - w) / 2, top: box.top + (box.height - h) / 2, width: w, height: h };
            };
            const flight = to => [
                { transform: `translate(${from.left + from.width / 2 - (to.left + to.width / 2)}px, ${from.top + from.height / 2 - (to.top + to.height / 2)}px) scale(${from.width / to.width})` },
                { transform: 'none' }
            ];
            const still = reduced.matches || !image.animate;
            thumb.style.visibility = 'hidden';
            layer.offsetWidth;
            layer.classList.add('is-on');
            if (!still) image.animate(flight(fit()), { duration: 420, easing: EASE });

            const close = () => {
                if (!lightbox) return;
                lightbox = null;
                document.removeEventListener('keydown', onKey);
                layer.classList.remove('is-on');
                const done = () => {
                    thumb.style.visibility = '';
                    layer.remove();
                    document.documentElement.classList.remove('has-lightbox');
                };
                if (still) return done();
                const back = image.animate(flight(fit()).reverse(), { duration: 320, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
                back.finished.then(done, done);
            };
            const onKey = e => { if (e.key === 'Escape') close(); };
            layer.addEventListener('click', close);
            document.addEventListener('keydown', onKey);
            lightbox = { image, close };
        }

        // Each block goes to whichever column is shorter, so they stay level.
        function place(item) {
            let k = 0;
            heights.forEach((h, i) => { if (h < heights[k]) k = i; });
            columns[k].append(item.node);
            heights[k] += item.weight;
        }

        function layout() {
            box.dataset.cols = cols;
            box.textContent = '';
            columns = Array.from({ length: cols }, () => el('div', 'arena-col'));
            heights = columns.map(() => 0);
            box.append(...columns);
            items.forEach(item => {
                const image = item.node.querySelector('img[srcset]');
                if (image) image.sizes = sizes();
                place(item);
            });
            if (toggle) toggle.textContent = cols === 2 ? '2 columns' : '1 column';
            nudge();
        }

        /* Blocks appear strictly in reading order — top to bottom, left before
           right — one beat apart. A block takes its turn when its image has
           arrived and it is on (or near) the screen; a slow image holds the line
           only briefly, then the rest carry on and it fades in when it lands. */
        const BEAT = 70;
        const PATIENCE = 700;
        let turn = null, headSince = 0, headItem = null;

        const ready = item => !item.image || item.image.complete;

        function show(item, instant) {
            item.shown = true;
            if (item.image && !item.image.complete) {
                item.image.classList.add('is-late');
                const land = () => item.image.classList.remove('is-late');
                item.image.addEventListener('load', land, { once: true });
                item.image.addEventListener('error', land, { once: true });
            }
            if (instant) {
                item.node.style.transition = 'none';
                item.node.classList.remove('is-waiting');
                item.node.offsetWidth;
                item.node.style.transition = '';
            } else item.node.classList.remove('is-waiting');
        }

        function pump() {
            if (turn) return;
            const waiting = items.filter(item => !item.shown);
            if (!waiting.length) return;
            const edge = window.innerHeight * 1.1;
            waiting.forEach(item => { item.rect = item.node.getBoundingClientRect(); });
            waiting.sort((p, q) => (p.rect.top - q.rect.top) || (p.rect.left - q.rect.left));

            // Anything already scrolled past is simply there.
            let next = waiting[0];
            while (next && next.rect.bottom < 0) {
                show(next, true);
                waiting.shift();
                next = waiting[0];
            }
            if (!next || next.rect.top > edge) return;      // nothing due on screen yet

            const now = performance.now();
            if (headItem !== next) { headItem = next; headSince = now; }
            if (!ready(next) && now - headSince < PATIENCE) {
                turn = setTimeout(() => { turn = null; pump(); }, 80);
                return;
            }
            show(next);
            turn = setTimeout(() => { turn = null; pump(); }, BEAT);
        }

        let queued = false;
        const nudge = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => { queued = false; pump(); });
        };
        window.addEventListener('scroll', nudge, { passive: true });
        window.addEventListener('resize', nudge);

        const add = blocks => blocks.forEach(block => {
            const item = render(block);
            if (!item) return;
            item.image = item.node.querySelector('img');
            item.node.classList.add('is-waiting');
            // The first screenful is fetched straight away, in order; the rest wait
            // until they are scrolled near.
            if (item.image && items.length < 6) {
                item.image.loading = 'eager';
                item.image.fetchPriority = items.length < 2 ? 'high' : 'auto';
            }
            if (item.image) item.image.addEventListener('load', nudge, { once: true });
            items.push(item);
            place(item);
            nudge();
        });

        if (toggle) toggle.addEventListener('click', () => {
            cols = cols === 2 ? 1 : 2;
            try { localStorage.setItem('arena-cols', cols); } catch (e) {}
            layout();
        });

        async function more() {
            if (loading || done) return;
            loading = true;
            try {
                if (!started) {
                    started = true;
                    if (group) {
                        // A group lists its channels (and any loose blocks).
                        const json = await get(`/groups/${encodeURIComponent(group)}/contents?per=100`);
                        json.data.forEach(item => { if (item.type === 'Channel') channels.push(item.slug); });
                        add(json.data);
                    }
                }
                // Keep going until something new is on screen or everything is read.
                const before = items.length;
                while (channels.length && items.length === before) {
                    const json = await get(`/channels/${encodeURIComponent(channels[0])}/contents?per=${PER}&page=${page + 1}`);
                    add(json.data);
                    if (json.meta && json.meta.has_more_pages) page++;
                    else { channels.shift(); page = 0; }
                }
                if (!channels.length) done = true;
            } catch (err) {
                done = true;
                if (!items.length) {
                    const note = el('a', 'arena-note', 'See the collection on Are.na');
                    note.href = `https://www.are.na/${encodeURIComponent(group || channels[0] || '')}`;
                    note.target = '_blank';
                    note.rel = 'noopener';
                    box.after(note);
                }
            }
            loading = false;
            if (toggle) toggle.hidden = !items.length;
            if (done && sentinel) sentinel.remove();
            // Still near the end of a short page: fetch the next one.
            else if (sentinel && sentinel.getBoundingClientRect().top < window.innerHeight + 800) more();
        }

        function load() {
            if ((!group && !channels.length) || sentinel) return;
            layout();
            sentinel = el('div', 'arena-end');
            box.after(sentinel);
            if ('IntersectionObserver' in window) {
                new IntersectionObserver(entries => {
                    if (entries.some(entry => entry.isIntersecting)) more();
                }, { rootMargin: '800px' }).observe(sentinel);
            }
            more();
        }

        return { load };
    })();

    // Sticky header: its backdrop and fade only switch on once content scrolls under it.
    const onScroll = () => page.classList.toggle('is-scrolled', window.scrollY > 1);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Deep link: /#events opens straight into that section, no animation.
    const initial = location.hash.slice(1);
    if (byName[initial]) apply(want = initial);
    if (initial === 'curation' && pager) pager.go('curation', { push: false, instant: true });

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
        // Re-measure only when the headline's own width changes (rotation, window
        // resize) — never for the browser's toolbars sliding in and out.
        let lastWidth = Math.round(lede.clientWidth);
        const relock = () => {
            const width = Math.round(lede.clientWidth);
            if (!width || width === lastWidth) return;
            lastWidth = width;
            lockHeight();
        };
        if ('ResizeObserver' in window) new ResizeObserver(relock).observe(lede);
        else window.addEventListener('resize', relock);

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

    clocks.forEach(clock => {
        const span = text => { const node = document.createElement('span'); node.textContent = text; return node; };
        clock.hour = span('--');
        clock.colon = span(':');
        clock.colon.className = 'colon';
        clock.minute = span('--');
        clock.tz = document.createTextNode('');
        clock.el.textContent = '';
        clock.el.append(clock.hour, clock.colon, clock.minute, clock.tz);
    });

    // The colon blinks in CSS; the digits change when the minute does.
    function tick() {
        const now = new Date();
        clocks.forEach(clock => {
            const parts = Object.fromEntries(clock.fmt.formatToParts(now).map(p => [p.type, p.value]));
            if (clock.minute.textContent !== parts.minute || clock.hour.textContent !== parts.hour) {
                clock.hour.textContent = parts.hour;
                clock.minute.textContent = parts.minute;
                clock.tz.textContent = ' ' + (clock.zone || parts.timeZoneName);
                clock.el.dateTime = now.toISOString();
            }
        });
        setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    }

    tick();
})();
