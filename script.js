document.addEventListener("DOMContentLoaded", () => {
    // Footer year
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Mobile navigation
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    const navLinks = document.querySelectorAll(".js-scroll-link");

    if (navToggle && nav) {
        navToggle.addEventListener("click", () => {
            navToggle.classList.toggle("is-open");
            nav.classList.toggle("nav--open");
            document.body.classList.toggle("nav-open");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("is-open");
                nav.classList.remove("nav--open");
                document.body.classList.remove("nav-open");
            });
        });
    }

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            const href = link.getAttribute("href");
            if (href && href.startsWith("#")) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });

    // Dot navigation (right side)
    const dotButtons = document.querySelectorAll(".dot-nav__item");
    dotButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            const section = document.querySelector(target);
            if (section) {
                section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    // Scroll reveal with data-delay
    const revealEls = document.querySelectorAll(".reveal");
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = el.dataset.delay;
                    if (delay) {
                        el.style.transitionDelay = delay;
                    }
                    el.classList.add("in-view");
                    obs.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        revealEls.forEach(el => observer.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add("in-view"));
    }

    // Scrollspy for nav and dot-nav
    const sections = document.querySelectorAll(".js-section");
    const scrollNavLinks = document.querySelectorAll(".nav__link");
    if ("IntersectionObserver" in window && sections.length) {
        const spy = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = "#" + entry.target.id;

                    // top nav
                    scrollNavLinks.forEach(link => {
                        link.classList.toggle(
                            "nav__link--active",
                            link.getAttribute("href") === id
                        );
                    });

                    // dot nav
                    dotButtons.forEach(btn => {
                        const target = btn.getAttribute("data-target");
                        btn.classList.toggle("dot-nav__item--active", target === id);
                    });
                }
            });
        }, { threshold: 0.4 });

        sections.forEach(sec => spy.observe(sec));
    }

    // Scroll progress bar
    const progressBar = document.getElementById("scrollProgress");
    if (progressBar) {
        window.addEventListener("scroll", () => {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = window.scrollY;
            const progress = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
            progressBar.style.width = `${progress}%`;
        });
    }

    // Small parallax in hero orbit
    const heroOrbit = document.getElementById("heroOrbit");
    if (heroOrbit && window.matchMedia("(pointer: fine)").matches) {
        heroOrbit.addEventListener("mousemove", (e) => {
            const rect = heroOrbit.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotateX = y * -8;
            const rotateY = x * 8;

            heroOrbit.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        heroOrbit.addEventListener("mouseleave", () => {
            heroOrbit.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
        });
    }
});
