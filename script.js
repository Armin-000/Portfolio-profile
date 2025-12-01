document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

    const hasIntersectionObserver = "IntersectionObserver" in window;
    const body = document.body;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const preloader = $(".preloader");
    const heroInner = $(".section--hero .section__inner");

    if (preloader) {
        body.classList.add("is-preloading");

        const triggerHeroIntro = () => {
            if (!heroInner) return;
            heroInner.classList.add("hero-pop-in");
            setTimeout(() => {
                heroInner.classList.remove("hero-pop-in");
            }, 900);
        };

        const hidePreloader = () => {
            if (preloader.classList.contains("preloader--hide")) return;

            preloader.classList.add("preloader--hide");
            body.classList.remove("is-preloading");

            if (!prefersReducedMotion) {
                body.classList.add("decor-animated");
            }

            triggerHeroIntro();

            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 800);
        };

        const MIN_DURATION = 300;
        const startTime = performance.now();

        const finishPreloader = () => {
            const elapsed = performance.now() - startTime;
            const remaining = Math.max(MIN_DURATION - elapsed, 0);
            setTimeout(hidePreloader, remaining);
        };

        window.addEventListener("load", finishPreloader);
        setTimeout(finishPreloader, 8000);
    } else {
        if (!prefersReducedMotion) {
            body.classList.add("decor-animated");
        }
    }

    const yearSpan = $("#year");
    if (yearSpan) {
        yearSpan.textContent = String(new Date().getFullYear());
    }

    const scrollToHash = (hash, options = {}) => {
        if (!hash || !hash.startsWith("#")) return;

        const target = document.querySelector(hash);
        if (!target) return;

        const behavior = options.behavior ?? "smooth";
        const block = options.block ?? "start";

        target.scrollIntoView({ behavior, block });
    };

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

    scrollLinks.forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");
            if (!href || !href.startsWith("#")) return;

            event.preventDefault();
            scrollToHash(href);

            if (body.classList.contains("nav-open")) {
                closeNav();
            }
        });
    });

    const dotButtons = $$(".dot-nav__item");

    dotButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            if (!target) return;
            scrollToHash(target);
        });
    });

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
        revealEls.forEach(el => el.classList.add("in-view"));
    }

    const sections = $$(".js-section");
    const topNavLinks = $$(".nav__link");

    if (hasIntersectionObserver && sections.length) {
        const spyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = `#${entry.target.id}`;

                topNavLinks.forEach(link => {
                    link.classList.toggle(
                        "nav__link--active",
                        link.getAttribute("href") === id
                    );
                });

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

    const heroOrbit = $("#heroOrbit");

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
