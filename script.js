document.addEventListener("DOMContentLoaded", () => {
    /**
     * Small helpers
     */
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const hasIntersectionObserver = "IntersectionObserver" in window;
    const body = document.body;

        /* =========================================================
       PRELOADER LOGIC
       ========================================================= */
    const preloader = $(".preloader");
    const heroInner = $(".section--hero .section__inner");

    if (preloader) {
        body.classList.add("is-preloading");

        const triggerHeroIntro = () => {
            if (!heroInner) return;
            heroInner.classList.add("hero-pop-in");

            // makni klasu nakon animacije da ne utječe kasnije
            setTimeout(() => {
                heroInner.classList.remove("hero-pop-in");
            }, 900);
        };

        const hidePreloader = () => {
            // Ako je već sakriven, ne radimo ništa
            if (preloader.classList.contains("preloader--hide")) return;

            preloader.classList.add("preloader--hide");
            body.classList.remove("is-preloading");

            // pokreni hero pop-in animaciju
            triggerHeroIntro();

            // (Opcija) nakon animacije maknuti iz DOM-a
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 800);
        };

        // Cilj: ~3 sekunde osjećaja “introa”
        const MIN_DURATION = 3000;
        const startTime = performance.now();

        // Kada se sve (slike, CSS, itd.) učita:
        window.addEventListener("load", () => {
            const elapsed = performance.now() - startTime;
            const remaining = Math.max(MIN_DURATION - elapsed, 0);
            setTimeout(hidePreloader, remaining);
        });

        // Sigurnosni fallback – ako se iz nekog razloga "load" ne okine
        setTimeout(hidePreloader, MIN_DURATION + 2000);
    }

    /* =========================================================
       1. FOOTER YEAR
       ========================================================= */
    const yearSpan = $("#year");
    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }

    /* =========================================================
       2. SMOOTH SCROLL
       ========================================================= */
    const scrollToHash = (hash, options = {}) => {
        if (!hash || !hash.startsWith("#")) return;

        const target = document.querySelector(hash);
        if (!target) return;

        const behavior = options.behavior ?? "smooth";
        const block = options.block ?? "start";

        target.scrollIntoView({ behavior, block });
    };

    /* =========================================================
       3. MOBILE NAVIGATION
       ========================================================= */
    const navToggle = $(".nav-toggle");
    const nav = $(".nav");
    const scrollLinks = $$(".js-scroll-link");

    const openNav = () => {
        if (!nav || !navToggle) return;
        navToggle.classList.add("is-open");
        nav.classList.add("nav--open");
        body.classList.add("nav-open");
    };

    const closeNav = () => {
        if (!nav || !navToggle) return;
        navToggle.classList.remove("is-open");
        nav.classList.remove("nav--open");
        body.classList.remove("nav-open");
    };

    const toggleNav = () => {
        if (!nav || !navToggle) return;
        const isOpen = navToggle.classList.contains("is-open");
        isOpen ? closeNav() : openNav();
    };

    if (navToggle && nav) {
        navToggle.addEventListener("click", toggleNav);
    }

    /* =========================================================
       4. LINK HANDLING (TOP NAV + IN-PAGE LINKS)
       ========================================================= */
    scrollLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            event.preventDefault();
            scrollToHash(href);

            // Ako je bio otvoren mobilni meni – zatvori ga
            if (body.classList.contains("nav-open")) {
                closeNav();
            }
        });
    });

    /* =========================================================
       5. DOT NAVIGATION (DESNO)
       ========================================================= */
    const dotButtons = $$(".dot-nav__item");

    dotButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            if (!target) return;
            scrollToHash(target);
        });
    });

    /* =========================================================
       6. SCROLL REVEAL
       ========================================================= */
    const revealEls = $$(".reveal");

    if (hasIntersectionObserver && revealEls.length) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const delay = el.dataset.delay;

                if (delay) {
                    el.style.transitionDelay = delay;
                }

                el.classList.add("in-view");
                observer.unobserve(el);
            });
        }, {
            threshold: 0.2
        });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        // Fallback bez IntersectionObservera
        revealEls.forEach(el => el.classList.add("in-view"));
    }

    /* =========================================================
       7. SCROLLSPY (TOP NAV + DOT-NAV)
       ========================================================= */
    const sections = $$(".js-section");
    const topNavLinks = $$(".nav__link");

    if (hasIntersectionObserver && sections.length) {
        const spyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = `#${entry.target.id}`;

                // Top nav active state
                topNavLinks.forEach(link => {
                    link.classList.toggle(
                        "nav__link--active",
                        link.getAttribute("href") === id
                    );
                });

                // Dot nav active state
                dotButtons.forEach(btn => {
                    const target = btn.getAttribute("data-target");
                    btn.classList.toggle("dot-nav__item--active", target === id);
                });
            });
        }, {
            threshold: 0.4
        });

        sections.forEach(section => spyObserver.observe(section));
    }

    /* =========================================================
       8. SCROLL PROGRESS BAR
       ========================================================= */
    const progressBar = $("#scrollProgress");
    if (progressBar) {
        let ticking = false;

        const updateScrollProgress = () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
            ticking = false;
        };

        window.addEventListener("scroll", () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollProgress);
                ticking = true;
            }
        });
    }

    /* =========================================================
       9. HERO ORBIT PARALLAX (DESKTOP SAMO)
       ========================================================= */
    const heroOrbit = $("#heroOrbit");
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (heroOrbit && window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
        const baseTransform = "perspective(900px)";

        heroOrbit.addEventListener("mousemove", event => {
            const rect = heroOrbit.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            const rotateX = y * -8;
            const rotateY = x * 8;

            heroOrbit.style.transform = `${baseTransform} rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroOrbit.addEventListener("mouseleave", () => {
            heroOrbit.style.transform = `${baseTransform} rotateX(0deg) rotateY(0deg)`;
        });
    }
});
