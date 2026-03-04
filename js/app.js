/*! ------------------------------------------------
 * Project Name: Rayo - Digital Agency & Personal Portfolio HTML Template
 * Project Description: Elevate your digital presence with Rayo - dynamic and stylish HTML template designed for creative agencies and personal brands. With modern layouts, smooth interactions and a polished aesthetic, Rayo template helps showcase projects, services and expertise with clarity and impact.
 * Tags: mix_design, resume, portfolio, personal page, cv, template, one page, responsive, html5, css3, creative, clean, agency, studio
 * Version: 1.0.0
 * Build Date: July 2025
 * Last Update: August 2025
 * This product is available exclusively on Themeforest
 * Author: mix_design
 * Author URI: https://themeforest.net/user/mix_design
 * File name: app.js
 * ------------------------------------------------

 * ------------------------------------------------
 * Table of Contents
 * ------------------------------------------------
 *
 *  01. Loader & Loading Animation
 *  02. Lenis Scroll Plugin
 *  03. Typed.js Plugin
 *  04. Header Scroll Behavior
 *  05. Hero #02 Scroll Out Animation
 *  06. Hero #07 Scroll Out Animation
 *  07. Hero #08 Scroll Out Animation
 *  08. SVG Fallback
 *  09. Chrome Smooth Scroll
 *  10. Images Moving Ban
 *  11. Detecting Mobile/Desktop
 *  12. Smooth Scrolling
 *  13. Menu & Hamburger
 *  14. Menu Accordion
 *  15. Layout Masonry
 *  16. Accordion
 *  17. Magnific Popup Video
 *  18. Mailchimp Subscribe Form
 *  19. Contact Form
 *  20. Parallax - Ukiyo Images & Video
 *  21. Pinned Images
 *  22. Stacking Cards
 *  23. Animation - Buttons Common
 *  24. Animation - Text Reveal
 *  25. Animation - Scroll Universal
 *  26. Animation - Images Reveal on Hover
 *  27. Swiper Slider - Testimonials #01
 *  28. Swiper Slider - Testimonials #02
 *  29. Swiper Slider - Inner Pages Demo
 *  30. CountUp - All Counters Options
 *  31. Marquee - Two Lines
 *  32. Marquee - One Line To Right
 *  33. Marquee - One Line To Left
 *  34. SVG DOM Injection
 *  35. Color Switch
 *  36. Scroll to Top Button
 *  37. Parallax Universal
 *
 * ------------------------------------------------
 * Table of Contents End
 * ------------------------------------------------ */

/* global gsap, ScrollTrigger, Flip, imagesLoaded, Lenis, Typed, Modernizr, $, Ukiyo, SplitType, Swiper, SVGInjector */
/* global gsap, ScrollTrigger, Flip, imagesLoaded, Lenis, Typed, Modernizr, $, Ukiyo, SplitType, Swiper, SVGInjector */
/* exported optionsNormal, optionsDecimal, optionsDecimalTwo, optionsPercent, optionsK, optionsPlus */

/* =========================================================
   GSAP / PLUGINS / BASE
========================================================= */

if (window.gsap) {
  gsap.config({ nullTargetWarn: false });
}

if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);
if (typeof Flip !== "undefined") gsap.registerPlugin(Flip);

/* =========================================================
   PRELOAD (imagesLoaded)
========================================================= */

const content = document.querySelector("body");
const imgLoad = imagesLoaded(content);

const loadingWrap = document.querySelector(".loading-wrap");
const loadingItems = loadingWrap ? loadingWrap.querySelectorAll(".loading__item") : [];
const fadeInItems = document.querySelectorAll(".loading__fade");

/* =========================================================
   LENIS (created paused — starts after enter)
========================================================= */

window.lenis = new Lenis();
const lenis = window.lenis;

// pause immediately (loader will start later)
if (typeof lenis.stop === "function") lenis.stop();

if (typeof ScrollTrigger !== "undefined") {
  lenis.on("scroll", ScrollTrigger.update);
}

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

/* =========================================================
   LOADER GATE (stays until scroll, NO scroll leakage, NO jump)
========================================================= */

(function loaderGate() {
  const loader = document.getElementById("loader");
  const label = document.getElementById("loaderLabel");
  const hint = document.getElementById("loaderHint");

  let ready = false;
  let opening = false;
  let cooldownTimer = null;

  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  function getScrollbarWidth() {
    return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
  }

  function forceTop() {
    if (opening) return;
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  }

  function lockScrollHard() {
    window.scrollTo(0, 0);

    const sbw = getScrollbarWidth();
    document.documentElement.classList.add("is-locked");
    document.body.classList.add("is-locked");
    document.body.classList.add("is-gated");

    document.body.style.paddingRight = sbw ? `${sbw}px` : "";
    document.body.style.top = "0px";

    try {
      if (window.lenis && typeof window.lenis.stop === "function") window.lenis.stop();
    } catch (e) {}
  }

  function unlockScrollHard() {
    document.documentElement.classList.remove("is-locked");
    document.body.classList.remove("is-locked");

    document.body.style.top = "";
    document.body.style.paddingRight = "";

    window.scrollTo(0, 0);

    document.body.classList.remove("is-gated");
  }

  function startLenisDeferred() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        try {
          if (window.lenis && typeof window.lenis.start === "function") window.lenis.start();
        } catch (e) {}
      });
    });
  }

  function setReadyState() {
    if (!loader) return;
    ready = true;
    loader.classList.add("is-ready");
    if (label) label.textContent = "Scroll to enter";
    if (hint) hint.textContent = "Wheel / touch / space";
  }

  function openGate() {
    if (!ready || opening || !loader) return;
    opening = true;

    window.scrollTo(0, 0);

    gsap.to(".loader__content", {
      duration: 0.55,
      ease: "power2.out",
      opacity: 0,
      y: 10,
    });

    gsap.to(".loader__wrapper", {
      duration: 0.85,
      ease: "power4.inOut",
      y: "-100%",
      delay: 0.15,
      onComplete: () => {
        loader.classList.add("loaded");
        loader.setAttribute("aria-hidden", "true");

        clearTimeout(cooldownTimer);
        cooldownTimer = setTimeout(() => {
          window.scrollTo(0, 0);

          unlockScrollHard();
          removeBlockers();

          pageAppearance();
          bootAfterEnter();

          if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh(true);
          startLenisDeferred();
        }, 650);
      },
    });
  }

  // IMPORTANT: open gate from the blocker itself
  function kill(e) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

    // user intent: if ready, open immediately (once)
    if (ready && !opening) openGate();

    forceTop();
  }

  function killKeys(e) {
    const keysToBlock = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "];
    if (keysToBlock.includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      if (typeof e.stopImmediatePropagation === "function") e.stopImmediatePropagation();

      if (ready && !opening) openGate();
      forceTop();
    }

    // Enter should also open
    if (e.key === "Enter") {
      e.preventDefault();
      if (ready && !opening) openGate();
    }
  }

  function addBlockers() {
    window.addEventListener("wheel", kill, { passive: false, capture: true });
    window.addEventListener("touchmove", kill, { passive: false, capture: true });
    window.addEventListener("keydown", killKeys, { passive: false, capture: true });
    window.addEventListener("scroll", forceTop, { passive: true, capture: true });
  }

  function removeBlockers() {
    window.removeEventListener("wheel", kill, { capture: true });
    window.removeEventListener("touchmove", kill, { capture: true });
    window.removeEventListener("keydown", killKeys, { capture: true });
    window.removeEventListener("scroll", forceTop, { capture: true });
  }

  // INIT
  lockScrollHard();
  addBlockers();

  // ready after images + fonts
  imgLoad.on("done", () => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setReadyState());
    } else {
      setReadyState();
    }
  });
})();

/* =========================================================
   PAGE APPEARANCE
========================================================= */

function pageAppearance() {
  if (loadingItems && loadingItems.length) {
    gsap.set(loadingItems, { opacity: 0 });
    gsap.to(loadingItems, {
      duration: 1.1,
      ease: "power4",
      startAt: { y: 120 },
      y: 0,
      opacity: 1,
      delay: 0.25,
      stagger: 0.08,
    });
  }

  if (fadeInItems && fadeInItems.length) {
    gsap.set(fadeInItems, { opacity: 0 });
    gsap.to(fadeInItems, {
      duration: 0.8,
      ease: "none",
      opacity: 1,
      delay: 0.2,
    });
  }
}

/* =========================================================
   BOOT AFTER ENTER (ONLY after gate)
========================================================= */

function bootAfterEnter() {
  initTyped();
  initHeroScrollTriggers();
  initJqueryExtras();

  // DO NOT run $.smoothScroll() with Lenis (double smoothing = jumps)
}

/* ---------- Typed ---------- */
function initTyped() {
  const animatedHeadline = $(".animated-type");
  if (animatedHeadline.length && typeof Typed !== "undefined") {
    new Typed("#typed", {
      stringsElement: "#typed-strings",
      showCursor: true,
      cursorChar: "_",
      loop: true,
      typeSpeed: 70,
      backSpeed: 30,
      backDelay: 2500,
    });
  }
}

/* ---------- Header hide ---------- */
$(window).on("scroll", function () {
  if ($(window).scrollTop() > 10) $(".mxd-header").addClass("is-hidden");
  else $(".mxd-header").removeClass("is-hidden");
});

/* ---------- Hero ScrollTriggers ---------- */
function initHeroScrollTriggers() {
  if (typeof ScrollTrigger === "undefined") return;

  const hero02StaticEls = document.querySelectorAll(".hero-02-static-anim-el");
  hero02StaticEls.forEach((element) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-02-static__tl-trigger",
        start: "top 14%",
        end: "top 0.2%",
        scrub: true,
      },
    }).fromTo(
      element,
      { transform: "translate3d(0, 0, 0)", scaleY: 1, opacity: 1 },
      { transform: "translate3d(0, -5rem, 0)", scaleY: 1.3, opacity: 0 }
    );
  });

  const hero02FadeEls = document.querySelectorAll(".hero-02-fade-out-scroll");
  hero02FadeEls.forEach((element) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-pinned-fullscreen__tl-trigger",
        start: "top 80%",
        end: "top 10%",
        scrub: true,
      },
    }).fromTo(element, { opacity: 1 }, { opacity: 0 });
  });

  const hero07SlideEls = document.querySelectorAll(".hero-07-slide-out-scroll");
  hero07SlideEls.forEach((element) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-hero-07__tl-trigger",
        start: "top 86%",
        end: "top 10%",
        scrub: true,
      },
    }).fromTo(
      element,
      { transform: "translate3d(0, 0, 0)", scaleY: 1 },
      { transform: "translate3d(0, -26rem, 0)", scaleY: 0.8 }
    );
  });

  const hero07FadeEls = document.querySelectorAll(".hero-07-fade-out-scroll");
  hero07FadeEls.forEach((element) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-hero-07__tl-trigger",
        start: "top 70%",
        end: "top 40%",
        scrub: true,
      },
    }).fromTo(
      element,
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
      { opacity: 0, transform: "translate3d(0, -10rem, 0)" }
    );
  });

  const hero08SlideEls = document.querySelectorAll(".hero-08-slide-out-scroll");
  hero08SlideEls.forEach((element) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-hero-08__tl-trigger",
        start: "top 80%",
        end: "top 40%",
        scrub: true,
      },
    }).fromTo(
      element,
      { transform: "translate3d(0, 0, 0)", opacity: 1 },
      { transform: "translate3d(0, -5rem, 0)", opacity: 0 }
    );
  });

  const hero08ScaleEls = document.querySelectorAll(".hero-08-scale-out-scroll");
  hero08ScaleEls.forEach((element) => {
    gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-hero-08__tl-trigger",
        start: "top 40%",
        end: "top 10%",
        scrub: true,
      },
    }).fromTo(
      element,
      { transform: "translate3d(0, 0, 0)", scaleY: 1, opacity: 1 },
      { transform: "translate3d(0, -5rem, 0)", scaleY: 1.2, opacity: 0 }
    );
  });
}

/* ---------- jQuery extras ---------- */
function initJqueryExtras() {
  if (typeof Modernizr !== "undefined" && !Modernizr.svg) {
    $("img[src*='svg']").attr("src", function () {
      return $(this).attr("src").replace(".svg", ".png");
    });
  }

  $("img, a").on("dragstart", function (event) {
    event.preventDefault();
  });

  if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    $("html").addClass("touch");
  } else {
    $("html").addClass("no-touch");
  }

  // Anchor smooth scroll
  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .off("click")
    .on("click", function (event) {
      if (
        location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") &&
        location.hostname === this.hostname
      ) {
        let target = $(this.hash);
        target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();

          // Prefer Lenis if available
          if (window.lenis && typeof window.lenis.scrollTo === "function") {
            window.lenis.scrollTo(target.get(0), { offset: 0, duration: 1.0 });
            return;
          }

          $("html, body").animate({ scrollTop: target.offset().top }, 1000, function () {
            const $target = $(target);
            $target.attr("tabindex", "-1").focus();
          });
        }
      }
    });
}

  $(".mxd-nav__wrap").each(function () {
    const hamburgerEl = $(this).find(".mxd-nav__hamburger");
    const navLineEl = $(this).find(".hamburger__line");
    const menuContainEl = $(this).find(".mxd-menu__contain");
    const flipItemEl = $(this).find(".hamburger__base");
    const menuWrapEl = $(this).find(".mxd-menu__wrapper");
    const menuBaseEl = $(this).find(".mxd-menu__base");
    const menuItem = $(this).find(".main-menu__item");
    const videoEl = $(this).find(".menu-promo__video");
    const fadeInEl = $(this).find(".menu-fade-in");
    const flipDuration = 0.6;

    function flip(forwards) {
      const state = Flip.getState(flipItemEl);
      if (forwards) {
        flipItemEl.appendTo(menuContainEl);
      } else {
        flipItemEl.appendTo(hamburgerEl);
      }
      Flip.from(state, { ease: "power4.inOut", duration: 0.8 });
    }

    const tl = gsap.timeline({ paused: true });
    tl.set(menuWrapEl, { display: "flex" });
    tl.from(menuBaseEl, {
      opacity: 0,
      duration: flipDuration,
      ease: "none",
      onStart: () => {
        flip(true);
      },
    });
    tl.to(navLineEl.eq(0), { y: 5, duration: 0.16 }, "<");
    tl.to(navLineEl.eq(1), { y: -5, duration: 0.16 }, "<");
    tl.to(navLineEl.eq(0), { rotate: 45, duration: 0.16 }, 0.2);
    tl.to(navLineEl.eq(1), { rotate: -45, duration: 0.16 }, 0.2);
    tl.add("fade-in-up")
      .from(
        menuItem,
        {
          opacity: 0,
          yPercent: 50,
          duration: 0.2,
          stagger: { amount: 0.2 },
          onReverseComplete: () => {
            flip(false);
          },
        },
        "fade-in-up",
      )
      .from(
        videoEl,
        {
          opacity: 0,
          yPercent: 20,
          duration: 0.2,
        },
        "fade-in-up",
      );
    tl.from(fadeInEl, { opacity: 0, duration: 0.3 });

    function openMenu(open) {
      if (!tl.isActive()) {
        if (open) {
          tl.play();
          hamburgerEl.addClass("nav-open");
        } else {
          tl.reverse();
          hamburgerEl.removeClass("nav-open");
        }
      }
    }

    hamburgerEl.on("click", function (e) {
      e.preventDefault();
      if ($(this).hasClass("nav-open")) {
        openMenu(false);
      } else {
        openMenu(true);
      }
    });
    menuBaseEl.on("click", function () {
      openMenu(false);
    });
    $(document).on("keydown", function (e) {
      if (e.key === "Escape") {
        openMenu(false);
      }
    });

    window.addEventListener("beforeunload", () => {
      openMenu(false);
    });
  });

  $(".mxd-nav__hamburger").on("click", function () {
    if ($(".mxd-nav__hamburger").hasClass("nav-open")) {
      $(".mxd-header").addClass("menu-is-visible");
    } else {
      setTimeout(function () {
        $(".mxd-header").removeClass("menu-is-visible");
      }, 1100);
    }
  });

  const Accordion = function (el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;
    const links = this.el.find(".main-menu__toggle");
    links.on("click", { el: this.el, multiple: this.multiple }, this.dropdown);
  };
  Accordion.prototype.dropdown = function (e) {
    const $el = e.data.el;
    const $this = $(this),
      $next = $this.next();
    $next.slideToggle();
    $this.parent().toggleClass("open");
    if (!e.data.multiple) {
      $el.find(".submenu").not($next).slideUp().parent().removeClass("open");
    }
  };
  new Accordion($("#main-menu"), false);

  $(".mxd-projects-masonry__gallery")
    .imagesLoaded()
    .progress(function () {
      $(".mxd-projects-masonry__gallery").masonry("layout");
      ScrollTrigger.refresh();
    });

  $(".mxd-accordion__title").on("click", function (e) {
    e.preventDefault();
    const $this = $(this);
    if (!$this.hasClass("accordion-active")) {
      $(".mxd-accordion__content").slideUp(400);
      $(".mxd-accordion__title").removeClass("accordion-active");
      $(".mxd-accordion__arrow").removeClass("accordion-rotate");
    }
    $this.toggleClass("accordion-active");
    $this.next().slideToggle();
    $(".mxd-accordion__arrow", this).toggleClass("accordion-rotate");
  });

  $("#showreel-trigger").magnificPopup({
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
    callbacks: {
      beforeOpen: function () {
        $("body").addClass("overflow-hidden");
        lenis.stop();
      },
      close: function () {
        $("body").removeClass("overflow-hidden");
        lenis.start();
      },
    },
  });

  $(".notify-form").ajaxChimp({
    callback: mailchimpCallback,
    url: "https://club.us10.list-manage.com/subscribe/post?u=e8d650c0df90e716c22ae4778&amp;id=54a7906900&amp;f_id=00b64ae4f0",
  });

  function mailchimpCallback(resp) {
    if (resp.result === "success") {
      $(".notify").find(".form").addClass("is-hidden");
      $(".notify").find(".subscription-ok").addClass("is-visible");
      setTimeout(function () {
        $(".notify").find(".subscription-ok").removeClass("is-visible");
        $(".notify").find(".form").delay(300).removeClass("is-hidden");
        $(".notify-form").trigger("reset");
      }, 5000);
    } else if (resp.result === "error") {
      $(".notify").find(".form").addClass("is-hidden");
      $(".notify").find(".subscription-error").addClass("is-visible");
      setTimeout(function () {
        $(".notify").find(".subscription-error").removeClass("is-visible");
        $(".notify").find(".form").delay(300).removeClass("is-hidden");
        $(".notify-form").trigger("reset");
      }, 5000);
    }
  }

  $("#contact-form").submit(function () {
    const th = $(this);
    $.ajax({
      type: "POST",
      url: "mail.php",
      data: th.serialize(),
    }).done(function () {
      $(".contact").find(".form").addClass("is-hidden");
      $(".contact").find(".form__reply").addClass("is-visible");
      setTimeout(function () {
        $(".contact").find(".form__reply").removeClass("is-visible");
        $(".contact").find(".form").delay(300).removeClass("is-hidden");
        th.trigger("reset");
      }, 5000);
    });
    return false;
  });


const images = document.querySelectorAll(".parallax-img");
const imagesSmall = document.querySelectorAll(".parallax-img-small");
const video = document.querySelectorAll(".parallax-video");
new Ukiyo(images, {
  scale: 1.5,
  speed: 1.5,
  externalRAF: false,
});
new Ukiyo(imagesSmall, {
  scale: 1.2,
  speed: 1.5,
  externalRAF: false,
});
new Ukiyo(video, {
  scale: 1.5,
  speed: 1.5,
  externalRAF: false,
});

$(".mxd-pinned").each(function () {
  const childTriggers = $(this).find(".mxd-pinned__text-item");
  const childTargets = $(this).find(".mxd-pinned__img-item");
  function makeItemActive(index) {
    childTriggers.removeClass("is-active");
    childTargets.removeClass("is-active");
    childTriggers.eq(index).addClass("is-active");
    childTargets.eq(index).addClass("is-active");
  }
  makeItemActive(0);
  childTriggers.each(function (index) {
    ScrollTrigger.create({
      trigger: $(this),
      start: "top center",
      end: "bottom center",
      onToggle: (isActive) => {
        if (isActive) {
          makeItemActive(index);
        }
      },
    });
  });
});

const cards = document.querySelectorAll(".stack-item");
const stickySpace = document.querySelector(".stack-offset");
const animation = gsap.timeline();
let cardHeight;

if (document.querySelector(".stack-item")) {
  function initCards() {
    animation.clear();
    cardHeight = cards[0].offsetHeight;

    cards.forEach((card, index) => {
      if (index > 0) {
        gsap.set(card, { y: index * cardHeight });
        animation.to(card, { y: 0, duration: index * 0.5, ease: "none" }, 0);
      }
    });
  }
  initCards();
  ScrollTrigger.create({
    trigger: ".stack-wrapper",
    start: "top top",
    pin: true,
    end: () => `+=${cards.length * cardHeight + stickySpace.offsetHeight}`,
    scrub: true,
    animation: animation,

    invalidateOnRefresh: true,
  });
  ScrollTrigger.addEventListener("refreshInit", initCards);
}

const elements = document.querySelectorAll(".btn-anim .btn-caption");

elements.forEach((element) => {
  const innerText = element.innerText;
  element.innerHTML = "";
  const textContainer = document.createElement("div");
  textContainer.classList.add("btn-anim__block");
  for (const letter of innerText) {
    const span = document.createElement("span");
    span.innerText = letter.trim() === "" ? "\xa0" : letter;
    span.classList.add("btn-anim__letter");
    textContainer.appendChild(span);
  }
  element.appendChild(textContainer);
  element.appendChild(textContainer.cloneNode(true));
});

elements.forEach((element) => {
  element.addEventListener("mouseover", () => {
    element.classList.remove("play");
  });
});

const splitTypes = document.querySelectorAll(".reveal-type");
splitTypes.forEach((char) => {
  const text = new SplitType(char, { types: "words, chars" });
  gsap.from(text.chars, {
    scrollTrigger: {
      trigger: char,
      start: "top 80%",
      end: "top 20%",
      scrub: true,
      markers: false,
    },
    opacity: 0.2,
    stagger: 0.1,
  });
});

const animInUp = document.querySelectorAll(".reveal-in-up");
animInUp.forEach((char) => {
  const text = new SplitType(char);
  gsap.from(text.chars, {
    scrollTrigger: {
      trigger: char,
      start: "top 90%",
      end: "top 20%",
      scrub: true,
    },
    transformOrigin: "top left",

    y: 10,
    stagger: 0.2,
    delay: 0.2,
    duration: 2,
  });
});

const animateRotation = document.querySelectorAll(".animate-rotation");
animateRotation.forEach((section) => {
  const value = $(section).data("value");
  gsap.fromTo(
    section,
    {
      ease: "sine",
      rotate: 0,
    },
    {
      rotate: value,
      scrollTrigger: {
        trigger: section,
        scrub: true,
        toggleActions: "play none none reverse",
      },
    },
  );
});

const animateInUp = document.querySelectorAll(".anim-uni-in-up");
animateInUp.forEach((element) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 50,
      ease: "sine",
    },
    {
      y: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: element,
        toggleActions: "play none none reverse",
      },
    },
  );
});

const animateInUpFront = document.querySelectorAll(".anim-uni-scale-in");
animateInUpFront.forEach((element) => {
  gsap.fromTo(
    element,
    {
      opacity: 1,
      y: 50,

      scale: 1.2,
      ease: "sine",
    },
    {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      scrollTrigger: {
        trigger: element,
        toggleActions: "play none none reverse",
      },
    },
  );
});

const animateInUpRight = document.querySelectorAll(".anim-uni-scale-in-right");
animateInUpRight.forEach((element) => {
  gsap.fromTo(
    element,
    {
      opacity: 1,
      y: 50,
      x: -70,
      scale: 1.2,
      ease: "sine",
      duration: 5,
    },
    {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      scrollTrigger: {
        trigger: element,
        toggleActions: "play none none reverse",
      },
    },
  );
});

const animateInUpLeft = document.querySelectorAll(".anim-uni-scale-in-left");
animateInUpLeft.forEach((element) => {
  gsap.fromTo(
    element,
    {
      opacity: 1,
      y: 50,
      x: 70,
      scale: 1.2,
      ease: "sine",
    },
    {
      y: 0,
      x: 0,
      opacity: 1,
      scale: 1,
      scrollTrigger: {
        trigger: element,
        toggleActions: "play none none reverse",
      },
    },
  );
});

if (document.querySelector(".animate-card-2")) {
  gsap.set(".animate-card-2", { y: 50, opacity: 0 });
  ScrollTrigger.batch(".animate-card-2", {
    interval: 0.1,
    batchMax: 2,
    duration: 3,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 2] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  });
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-2", { y: 0, opacity: 1 }),
  );
}

if (document.querySelector(".animate-card-3")) {
  gsap.set(".animate-card-3", { y: 50, opacity: 0 });
  ScrollTrigger.batch(".animate-card-3", {
    interval: 0.1,
    batchMax: 3,
    duration: 3,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 3] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  });
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-3", { y: 0, opacity: 1 }),
  );
}

if (document.querySelector(".animate-card-4")) {
  gsap.set(".animate-card-4", { y: 50, opacity: 0 });
  ScrollTrigger.batch(".animate-card-4", {
    interval: 0.1,
    batchMax: 4,
    delay: 1000,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 4] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  });
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-4", { y: 0, opacity: 1 }),
  );
}

if (document.querySelector(".animate-card-5")) {
  gsap.set(".animate-card-5", { y: 50, opacity: 0 });
  ScrollTrigger.batch(".animate-card-5", {
    interval: 0.1,
    batchMax: 5,
    delay: 1000,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        ease: "sine",
        stagger: { each: 0.15, grid: [1, 5] },
        overwrite: true,
      }),
    onLeave: (batch) => gsap.set(batch, { opacity: 1, y: 0, overwrite: true }),
    onEnterBack: (batch) =>
      gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    onLeaveBack: (batch) =>
      gsap.set(batch, { opacity: 0, y: 50, overwrite: true }),
  });
  ScrollTrigger.addEventListener("refreshInit", () =>
    gsap.set(".animate-card-5", { y: 0, opacity: 1 }),
  );
}

const toBottomEl = document.querySelectorAll(".anim-top-to-bottom");
toBottomEl.forEach((element) => {
  const toBottomTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".fullwidth-text__tl-trigger",
      start: "top 99%",
      end: "top 24%",
      scrub: {
        scrub: true,
        ease: "none",
      },
    },
  });
  toBottomTl.fromTo(
    element,
    {
      transform: "translate3d(0, -100%, 0)",
    },
    {
      transform: "translate3d(0, 0, 0)",
    },
  );
});

const docStyle = getComputedStyle(document.documentElement);
const zoomInContainer = document.querySelectorAll(".anim-zoom-in-container");
const zoomOutContainer = document.querySelectorAll(".anim-zoom-out-container");

zoomInContainer.forEach((element) => {
  const zoomInBlockTl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: "top 82%",
      end: "top 14%",
      scrub: {
        scrub: true,
        ease: "power4.inOut",
      },
    },
  });
  zoomInBlockTl.fromTo(
    element,
    {
      borderRadius: "200px",
      transform: "scale3d(0.94, 1, 1)",
    },
    {
      borderRadius: docStyle.getPropertyValue("--_radius-l"),
      transform: "scale3d(1, 1, 1)",
    },
  );
});

zoomOutContainer.forEach((element) => {
  const zoomOutBlockTl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: "top 82%",
      end: "top 14%",
      scrub: {
        scrub: true,
        ease: "power4.inOut",
      },
    },
  });
  zoomOutBlockTl.fromTo(
    element,
    {
      borderRadius: "200px",
      transform: "scale3d(1.14, 1, 1)",
    },
    {
      borderRadius: docStyle.getPropertyValue("--_radius-l"),
      transform: "scale3d(1, 1, 1)",
    },
  );
});

const link = document.querySelectorAll(".hover-reveal__item");
const linkHoverReveal = document.querySelectorAll(".hover-reveal__content");
const linkImages = document.querySelectorAll(".hover-reveal__image");

for (let i = 0; i < link.length; i++) {
  link[i].addEventListener("mousemove", (e) => {
    linkHoverReveal[i].style.opacity = 1;
    linkHoverReveal[i].style.transform = `translate(-80%, -50% )`;
    linkImages[i].style.transform = "scale(1, 1)";
    linkHoverReveal[i].style.left = e.clientX + "px";
  });

  link[i].addEventListener("mouseleave", () => {
    linkHoverReveal[i].style.opacity = 0;
    linkHoverReveal[i].style.transform = `translate(-80%, -50%)`;
    linkImages[i].style.transform = "scale(1, 1.4)";
  });
}

const testimonialsSlider = document.querySelector("testimonials-slider");

if (!testimonialsSlider) {
  new Swiper(".swiper-testimonials", {
    slidesPerView: "auto",
    grabCursor: true,
    spaceBetween: 30,
    autoplay: true,
    delay: 3000,
    speed: 1000,
    loop: true,
    parallax: true,
    loopFillGroupWithBlank: true,
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

const testimonialsSlider2 = document.querySelector("testimonials-slider-2");

if (!testimonialsSlider2) {
  new Swiper(".swiper-testimonials-2", {
    slidesPerView: 1,
    grabCursor: true,
    effect: "fade",
    spaceBetween: 30,
    autoplay: true,
    delay: 3000,
    speed: 1000,
    loop: true,
    parallax: true,
    loopFillGroupWithBlank: true,
    pagination: {
      el: ".swiper-pagination",
      type: "fraction",
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

const innerDemoSlider = document.querySelector("mxd-demo-swiper");

if (!innerDemoSlider) {
  new Swiper(".mxd-demo-swiper", {
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1600: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
    loop: true,
    parallax: true,
    autoplay: { disableOnInteraction: false, enabled: true },
    grabCursor: true,
    speed: 600,
    centeredSlides: true,
    keyboard: { enabled: true },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
}

const optionsNormal = {
  enableScrollSpy: true,
}; // eslint-disable-line no-unused-vars
const optionsDecimal = {
  decimalPlaces: 1,
  enableScrollSpy: true,
}; // eslint-disable-line no-unused-vars
const optionsDecimalTwo = {
  decimalPlaces: 2,
  enableScrollSpy: true,
}; // eslint-disable-line no-unused-vars
const optionsPercent = {
  suffix: "%",
  enableScrollSpy: true,
}; // eslint-disable-line no-unused-vars
const optionsK = {
  suffix: "K",
  enableScrollSpy: true,
}; // eslint-disable-line no-unused-vars
const optionsPlus = {
  suffix: "+",
  enableScrollSpy: true,
}; // eslint-disable-line no-unused-vars

const initMarquees = () => {
  const items = [...document.querySelectorAll(".marquee--gsap")];
  if (items) {
    const marqueeObject = {
      top: {
        el: null,
        width: 0,
      },
      bottom: {
        el: null,
        width: 0,
      },
    };
    items.forEach((itemBlock) => {
      marqueeObject.top.el = itemBlock.querySelector(".marquee__top");
      marqueeObject.bottom.el = itemBlock.querySelector(".marquee__bottom");
      marqueeObject.top.width = marqueeObject.top.el.offsetWidth;
      marqueeObject.bottom.width = marqueeObject.bottom.el.offsetWidth;
      marqueeObject.top.el.innerHTML += marqueeObject.top.el.innerHTML;
      marqueeObject.bottom.el.innerHTML += marqueeObject.bottom.el.innerHTML;
      const dirFromLeft = "-=50%";
      const dirFromRight = "+=50%";
      const master = gsap
        .timeline()
        .add(marquee(marqueeObject.top.el, 30, dirFromLeft), 0)
        .add(marquee(marqueeObject.bottom.el, 30, dirFromRight), 0);
      const tween = gsap.to(master, {
        duration: 1.5,
        timeScale: 1,
        paused: true,
      });
      const timeScaleClamp = gsap.utils.clamp(1, 6);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
          tween.invalidate().restart();
        },
      });
    });
  }
};
const marquee = (item, time, direction) => {
  const mod = gsap.utils.wrap(0, 50);
  return gsap.to(item, {
    duration: time,
    ease: "none",
    x: direction,
    modifiers: {
      x: (x) => (direction = mod(parseFloat(x)) + "%"),
    },
    repeat: -1,
  });
};
initMarquees();

const initMarquee = () => {
  const items = [...document.querySelectorAll(".marquee-right--gsap")];
  if (items) {
    const marqueeObject = {
      el: null,
      width: 0,
    };
    items.forEach((itemBlock) => {
      marqueeObject.el = itemBlock.querySelector(".marquee__toright");
      marqueeObject.width = marqueeObject.el.offsetWidth;
      marqueeObject.el.innerHTML += marqueeObject.el.innerHTML;

      const dirFromRight = "+=50%";
      const master = gsap
        .timeline()

        .add(marqueeRight(marqueeObject.el, 30, dirFromRight), 0);
      const tween = gsap.to(master, {
        duration: 1.5,
        timeScale: 1,
        paused: true,
      });
      const timeScaleClamp = gsap.utils.clamp(1, 6);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
          tween.invalidate().restart();
        },
      });
    });
  }
};
const marqueeRight = (item, time, direction) => {
  const mod = gsap.utils.wrap(0, 50);
  return gsap.to(item, {
    duration: time,
    ease: "none",
    x: direction,
    modifiers: {
      x: (x) => (direction = mod(parseFloat(x)) + "%"),
    },
    repeat: -1,
  });
};
initMarquee();

const initMarqueeLeft = () => {
  const items = [...document.querySelectorAll(".marquee-left--gsap")];
  if (items) {
    const marqueeObject = {
      el: null,
      width: 0,
    };
    items.forEach((itemBlock) => {
      marqueeObject.el = itemBlock.querySelector(".marquee__toleft");
      marqueeObject.width = marqueeObject.el.offsetWidth;
      marqueeObject.el.innerHTML += marqueeObject.el.innerHTML;
      const dirFromLeft = "-=50%";

      const master = gsap
        .timeline()
        .add(marquee(marqueeObject.el, 30, dirFromLeft), 0);

      const tween = gsap.to(master, {
        duration: 1.5,
        timeScale: 1,
        paused: true,
      });
      const timeScaleClamp = gsap.utils.clamp(1, 6);
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          master.timeScale(timeScaleClamp(Math.abs(self.getVelocity() / 200)));
          tween.invalidate().restart();
        },
      });
    });
  }
};
initMarqueeLeft();

const mySVGsToInject = document.querySelectorAll("img.inject-me");
const injectorOptions = {
  evalScripts: "once",
  pngFallback: "assets/png",
  each: function () {},
};
SVGInjector(mySVGsToInject, injectorOptions, function (totalSVGsInjected) {
  console.log("We injected " + totalSVGsInjected + " SVG(s)!");
});

window.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(":root");

  root.setAttribute("color-scheme", "dark");

  try {
    localStorage.removeItem("template.theme");
  } catch (e) {}

  const themeBtn = document.querySelector("#color-switcher");
  if (themeBtn) {
    themeBtn.innerHTML = "";
    themeBtn.disabled = true;
  }
});

const toTop = document.querySelector(".btn-to-top");

$(".btn-to-top").each(function () {
  toTop.addEventListener("click", function (event) {
    event.preventDefault();
  });

  toTop.addEventListener("click", () =>
    gsap.to(window, {
      scrollTo: 0,
      ease: "power4.inOut",
      duration: 1.3,
    }),
  );

  gsap.set(toTop, { opacity: 0 });

  gsap.to(toTop, {
    opacity: 1,
    autoAlpha: 1,
    scrollTrigger: {
      trigger: "body",
      start: "top -20%",
      end: "top -20%",
      toggleActions: "play none reverse none",
    },
  });
});

const parallaxElements = document.querySelectorAll("[data-speed]");

if (parallaxElements.length) {
  gsap.to(parallaxElements, {
    y: (i, el) =>
      (1 - parseFloat(el.getAttribute("data-speed"))) *
      ScrollTrigger.maxScroll(window),
    ease: "none",
    scrollTrigger: {
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      scrub: 0
    }
  });
}


/* ======================================================================
   TUBES CANVAS BACKGROUND — FINAL FIX (NO FINGER TRACKING)
   ✅ Blocks touch/pointer MOVE events globally BEFORE tubes registers listeners
   ✅ Uses CAPTURE + stopImmediatePropagation (beats libs that listen globally)
   ✅ Does NOT break scroll (no preventDefault)
====================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  void initTubesBackground();
});

async function initTubesBackground() {
  const host = document.getElementById("canvas");
  if (!host) return;

  // Prevent double-mount
  if (host.dataset.tubesMounted === "1") return;
  host.dataset.tubesMounted = "1";

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

  const env = getEnv();

  // ✅ IMPORTANT: install shield BEFORE importing/creating TubesCursor
  // This ensures our capture listeners run before the library’s listeners exist.
  let removeShield = null;
  if (env.isTouchDevice) {
    removeShield = installTouchMoveShield();
  }

  const CONFIG = {
    importUrl:
      "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js",
    colors: ["#11cee3", "#058391", "#006e7a", "#017380"],
    renderer: { alpha: true, antialias: false, powerPreference: "low-power" },
    tubes: { lightsIntensity: env.isMobile ? 7 : 11 },
    fps: env.isMobile ? 18 : 24,
    dprCap: env.isMobile ? 0.35 : 0.45,
    renderScale: env.isMobile ? 0.55 : 0.6,
  };

  const TubesCursor = await safeImportDefault(CONFIG.importUrl);
  if (!TubesCursor) return;

  lockBehind(host);

  const app = createApp(TubesCursor, host, CONFIG);
  if (!app?.renderer) return;

  const renderer = app.renderer;
  const gl = renderer.domElement;

  renderer.setClearColor?.(0x000000, 0);
  lockBehind(gl);

  const viewport = createViewportController({
    renderer,
    dprCap: CONFIG.dprCap,
    renderScale: CONFIG.renderScale,
  });
  viewport.sync(true);

  const renderFn = app.render || app.update;
  if (typeof renderFn !== "function") return;

  const loop = createFpsLoop({
    fps: CONFIG.fps,
    tick: (t) => renderFn(t),
  });
  loop.start();

  const onVisibility = () => (document.hidden ? loop.stop() : loop.start(true));
  document.addEventListener("visibilitychange", onVisibility, { passive: true });

  const onResize = () => viewport.sync();
  window.addEventListener("resize", onResize, { passive: true });

  host.__tubesCleanup = () => {
    loop.stop();
    viewport.destroy();
    removeShield?.();
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("resize", onResize);
    delete host.dataset.tubesMounted;
  };
}

function getEnv() {
  const isTouchDevice =
    window.matchMedia?.("(hover: none)")?.matches ||
    window.matchMedia?.("(pointer: coarse)")?.matches ||
    (navigator.maxTouchPoints || 0) > 0;

  const isMobile =
    window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);

  return { isTouchDevice, isMobile };
}

async function safeImportDefault(url) {
  try {
    const mod = await import(url);
    return mod?.default || null;
  } catch (err) {
    console.warn("[tubes] import failed:", err);
    return null;
  }
}

function createApp(TubesCursor, host, CONFIG) {
  return TubesCursor(host, {
    renderer: CONFIG.renderer,
    tubes: {
      colors: CONFIG.colors,
      lights: { intensity: CONFIG.tubes.lightsIntensity, colors: CONFIG.colors },
    },
  });
}

function lockBehind(el) {
  if (!el) return;
  el.style.position = "fixed";
  el.style.inset = "0";
  el.style.width = "100vw";
  el.style.height = "100vh";
  el.style.display = "block";
  el.style.pointerEvents = "none";
  el.style.background = "transparent";
  el.style.zIndex = "-1";
  el.style.transform = "translateZ(0)";
}

function createViewportController({ renderer, dprCap, renderScale = 0.6 }) {
  const vv = window.visualViewport || null;
  let raf = 0;

  const getSize = () => {
    const w = vv ? Math.round(vv.width) : document.documentElement.clientWidth;
    const h = vv ? Math.round(vv.height) : document.documentElement.clientHeight;
    return { w, h };
  };

  const apply = () => {
    if (!renderer) return;
    const { w, h } = getSize();

    const baseDpr = Math.min(window.devicePixelRatio || 1, 2);
    const dpr = baseDpr * dprCap;
    renderer.setPixelRatio(Math.max(0.35, Math.min(1, dpr)));

    const rw = Math.max(320, Math.floor(w * renderScale));
    const rh = Math.max(240, Math.floor(h * renderScale));
    renderer.setSize(rw, rh, false);

    const c = renderer.domElement;
    c.style.width = "100vw";
    c.style.height = "100vh";
  };

  const sync = (immediate = false) => {
    if (!renderer) return;
    if (immediate) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      apply();
      return;
    }
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      apply();
    });
  };

  const onVVResize = () => sync();
  const onVVScroll = () => sync();
  const onWinResize = () => sync();

  if (vv) {
    vv.addEventListener("resize", onVVResize, { passive: true });
    vv.addEventListener("scroll", onVVScroll, { passive: true });
  } else {
    window.addEventListener("resize", onWinResize, { passive: true });
  }

  const destroy = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (vv) {
      vv.removeEventListener("resize", onVVResize);
      vv.removeEventListener("scroll", onVVScroll);
    } else {
      window.removeEventListener("resize", onWinResize);
    }
  };

  return { sync, destroy };
}

function createFpsLoop({ fps, tick }) {
  const frameInterval = 1000 / fps;
  let running = false;
  let rafId = 0;
  let lastT = 0;

  const loop = (t) => {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    if (t - lastT < frameInterval) return;
    lastT = t;
    tick(t);
  };

  const start = (resetTime = false) => {
    if (running) return;
    running = true;
    if (resetTime) lastT = 0;
    rafId = requestAnimationFrame(loop);
  };

  const stop = () => {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  };

  return { start, stop };
}

/**
 * ✅ THE FIX:
 * Block touch/pointer MOVE globally using CAPTURE + stopImmediatePropagation().
 * We DO NOT preventDefault → page scroll stays normal.
 *
 * This must be installed BEFORE TubesCursor is created (we do that).
 */
function installTouchMoveShield() {
  const opts = { capture: true, passive: true };

  const stopIfTouch = (e) => {
    // PointerEvents path
    if (e.type === "pointermove" || e.type === "pointerdown") {
      if (e.pointerType === "touch") {
        e.stopImmediatePropagation();
      }
      return;
    }

    // TouchEvents path
    if (e.type === "touchmove" || e.type === "touchstart") {
      e.stopImmediatePropagation();
    }
  };

  // Register on multiple targets to catch whatever the library uses
  const targets = [window, document, document.documentElement];

  targets.forEach((t) => {
      t.addEventListener("pointermove", stopIfTouch, opts);
      t.addEventListener("touchmove", stopIfTouch, opts);
  });

  return () => {
    targets.forEach((t) => {
      t.removeEventListener("pointermove", stopIfTouch, opts);
      t.removeEventListener("pointerdown", stopIfTouch, opts);
      t.removeEventListener("touchmove", stopIfTouch, opts);
      t.removeEventListener("touchstart", stopIfTouch, opts);
    });
  };
}



/* ======================================================================
   HXG — Optimized one-at-a-time gallery (smooth, no jank)
   - Wheel -> horizontal (normalized + rAF accumulator + sensitivity)
   - Pointer drag (capture)
   - rAF-throttled scroll handling
   - Snap-to-nearest after input ends (trackpad-aware)
   - Progress bar update
   - Active slide detection (binary search; fast, stable)
   - Realistic typing (cancel-safe)
   - Description height locked to maximum required height (no section shifting)
   - Start typing only when section is in viewport (IntersectionObserver)
   - Stable init (load + fonts.ready + ResizeObserver)
====================================================================== */

(function initHXG() {
  const wrap = document.querySelector('[data-hxg]');
  if (!wrap) return;

  const rail = wrap.querySelector('.hxg-rail');
  if (!rail) return;

  const bar = document.querySelector('.hxg-progress__bar');
  const descEl = document.getElementById('hxgDesc');
  const cards = Array.from(rail.querySelectorAll('.hxg-card'));
  if (!cards.length) return;

  const reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function maxScrollLeft() {
    return Math.max(0, rail.scrollWidth - rail.clientWidth);
  }

  function updateProgress() {
    if (!bar) return;
    const max = maxScrollLeft();
    const p = max <= 0 ? 1 : rail.scrollLeft / max;
    bar.style.width = (clamp(p, 0, 1) * 100).toFixed(2) + '%';
  }

  function cardCenters() {
    return cards.map((c) => c.offsetLeft + c.offsetWidth / 2);
  }

  let centers = cardCenters();

  function nearestIndexByScroll() {
    const cx = rail.scrollLeft + rail.clientWidth / 2;
    const arr = centers;
    const n = arr.length;
    if (!n) return 0;

    let lo = 0, hi = n - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (arr[mid] < cx) lo = mid + 1;
      else hi = mid;
    }

    const i = lo;
    if (i <= 0) return 0;
    if (i >= n) return n - 1;

    const prev = i - 1;
    return (Math.abs(arr[prev] - cx) <= Math.abs(arr[i] - cx)) ? prev : i;
  }

  function scrollToIndex(i, behavior = 'smooth') {
    const c = cards[i];
    if (!c) return;
    const target = c.offsetLeft - (rail.clientWidth - c.offsetWidth) / 2;
    rail.scrollTo({ left: target, behavior });
  }

  function createMeasureEl() {
    if (!descEl) return null;
    const m = document.createElement('div');
    m.className = descEl.className;
    m.style.position = 'absolute';
    m.style.left = '-99999px';
    m.style.top = '0';
    m.style.visibility = 'hidden';
    m.style.height = 'auto';
    m.style.maxHeight = 'none';
    m.style.overflow = 'visible';
    m.style.transform = 'none';
    m.style.filter = 'none';
    m.style.opacity = '1';
    m.style.pointerEvents = 'none';
    m.style.whiteSpace = 'normal';
    document.body.appendChild(m);
    return m;
  }

  const measureEl = createMeasureEl();

  function lockDescHeightToMax() {
    if (!descEl || !measureEl) return;

    const rect = descEl.getBoundingClientRect();
    if (!rect.width) return;

    measureEl.style.width = rect.width + 'px';

    let maxH = 0;
    for (const c of cards) {
      const t = (c.getAttribute('data-desc') || '').trim();
      if (!t) continue;
      measureEl.textContent = t;
      const h = measureEl.scrollHeight;
      if (h > maxH) maxH = h;
    }

    if (!maxH) {
      measureEl.textContent = (descEl.textContent || '').trim();
      maxH = measureEl.scrollHeight || 0;
    }

    if (maxH) {
      descEl.style.height = maxH + 'px';
    }
  }

  let typingToken = 0;
  let typingTimer = 0;

  function stopTyping() {
    typingToken++;
    if (typingTimer) window.clearTimeout(typingTimer);
    typingTimer = 0;
  }

  function setDescTyped(text) {
    if (!descEl) return;

    const next = (text || '').trim();
    const current = descEl.getAttribute('data-full') || descEl.textContent.trim();
    if (!next || current === next) return;

    stopTyping();

    descEl.setAttribute('data-full', next);

    descEl.classList.add('is-enter');
    requestAnimationFrame(() =>
      requestAnimationFrame(() => descEl.classList.remove('is-enter'))
    );

    if (reduce) {
      descEl.textContent = next;
      return;
    }

    descEl.textContent = '';
    const caret = document.createElement('span');
    caret.className = 'hxg-caret';
    caret.textContent = '▍';
    descEl.appendChild(caret);

    const myToken = typingToken;
    let i = 0;
    let out = '';

    const baseMin = 18, baseMax = 42;
    const thinkChance = 0.06;
    const maxThinkPause = 180;

    const rand = (a, b) => a + Math.random() * (b - a);

    function charDelay(ch, prev) {
      if (ch === ' ') return rand(10, 18);
      if (',;:'.includes(ch)) return rand(90, 140);
      if ('.!?'.includes(ch)) return rand(140, 220);
      if (prev && '.!?'.includes(prev)) return rand(40, 80);
      if (ch >= 'A' && ch <= 'Z') return rand(baseMin + 6, baseMax + 10);
      if (ch >= '0' && ch <= '9') return rand(baseMin + 4, baseMax + 8);
      return rand(baseMin, baseMax);
    }

    function maybeThinkPause(ch) {
      const extra =
        (',;:'.includes(ch) && Math.random() < 0.35) ||
        (ch === ' ' && Math.random() < thinkChance);
      return extra ? rand(80, maxThinkPause) : 0;
    }

    function render(t) {
      descEl.textContent = t;
      descEl.appendChild(caret);
    }

    function step(prev) {
      if (myToken !== typingToken) return;

      if (i >= next.length) {
        render(out);
        typingTimer = window.setTimeout(() => {
          if (myToken !== typingToken) return;
          descEl.textContent = out;
          typingTimer = 0;
        }, 520);
        return;
      }

      const ch = next[i];
      out += ch;
      i++;
      render(out);

      typingTimer = window.setTimeout(
        () => step(ch),
        charDelay(ch, prev) + maybeThinkPause(ch)
      );
    }

    typingTimer = window.setTimeout(() => step(''), rand(120, 220));
  }

  let activeIndex = -1;

  let inView = false;
  let started = false;

  function setActiveIndex(i) {
    if (i === activeIndex) return;
    activeIndex = i;
    if (!inView && started) return;
    if (!started) return;
    setDescTyped(cards[i]?.getAttribute('data-desc') || '');
  }

  function startHXG() {
    if (started) return;
    started = true;

    lockDescHeightToMax();
    updateProgress();

    const i = nearestIndexByScroll();
    activeIndex = -1;
    setActiveIndex(i);
  }

  let rafPending = false;

  function onScrollTick() {
    rafPending = false;
    updateProgress();
    if (!started) return;
    setActiveIndex(nearestIndexByScroll());
  }

  function onScroll() {
    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(onScrollTick);
    }
  }

  rail.addEventListener('scroll', onScroll, { passive: true });

  let snapTimer = 0;

  function scheduleSnap(delay = 140) {
    if (reduce) return;
    if (!started) return;
    if (snapTimer) window.clearTimeout(snapTimer);
    snapTimer = window.setTimeout(() => {
      snapTimer = 0;
      const i = nearestIndexByScroll();
      scrollToIndex(i, 'smooth');
    }, delay);
  }

  const WHEEL_SENSITIVITY_MOUSE = 1.15;
  const WHEEL_SENSITIVITY_TRACKPAD = 1.0;

  let wheelAccum = 0;
  let wheelRaf = 0;
  let lastWheelTrackpad = false;

  function isLikelyTrackpad(e) {
    const dx = Math.abs(e.deltaX || 0);
    const dy = Math.abs(e.deltaY || 0);
    const d = Math.max(dx, dy);
    return d > 0 && d < 50;
  }

  function applyWheel() {
    wheelRaf = 0;

    const max = maxScrollLeft();
    if (max <= 0) {
      wheelAccum = 0;
      return;
    }

    const next = clamp(rail.scrollLeft + wheelAccum, 0, max);
    wheelAccum = 0;

    rail.scrollLeft = next;

    scheduleSnap(lastWheelTrackpad ? 180 : 120);
  }

  function onWheel(e) {
    const max = maxScrollLeft();
    if (max <= 0) return;

    const dx = e.deltaX || 0;
    const dy = e.deltaY || 0;

    const useX = Math.abs(dx) > Math.abs(dy);
    let delta = useX ? dx : dy;
    if (!delta) return;

    if (e.deltaMode === 1) delta *= 16;
    if (e.deltaMode === 2) delta *= 80;

    lastWheelTrackpad = isLikelyTrackpad(e);
    const sens = lastWheelTrackpad ? WHEEL_SENSITIVITY_TRACKPAD : WHEEL_SENSITIVITY_MOUSE;
    delta *= sens;

    e.preventDefault();
    stopTyping();

    wheelAccum += delta;
    if (!wheelRaf) wheelRaf = requestAnimationFrame(applyWheel);
  }

  rail.addEventListener('wheel', onWheel, { passive: false });

  let dragging = false;
  let startX = 0;
  let startLeft = 0;
  let dragId = 0;
  let moved = 0;

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    dragging = true;
    dragId = e.pointerId;
    moved = 0;
    startX = e.clientX;
    startLeft = rail.scrollLeft;

    stopTyping();
    rail.classList.add('hxg-dragging');
    rail.setPointerCapture(dragId);
  }

  function onPointerMove(e) {
    if (!dragging || e.pointerId !== dragId) return;
    const dx = e.clientX - startX;
    moved = Math.max(moved, Math.abs(dx));
    const max = maxScrollLeft();
    rail.scrollLeft = clamp(startLeft - dx, 0, max);
  }

  function onPointerUp(e) {
    if (!dragging || e.pointerId !== dragId) return;
    dragging = false;
    rail.classList.remove('hxg-dragging');

    try { rail.releasePointerCapture(dragId); } catch {}

    if (moved > 6) scheduleSnap(140);
  }

  rail.addEventListener('pointerdown', onPointerDown, { passive: true });
  rail.addEventListener('pointermove', onPointerMove, { passive: true });
  rail.addEventListener('pointerup', onPointerUp, { passive: true });
  rail.addEventListener('pointercancel', onPointerUp, { passive: true });

  function onResize() {
    centers = cardCenters();
    updateProgress();
    lockDescHeightToMax();
    if (started) setActiveIndex(nearestIndexByScroll());
  }

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(onResize);
    ro.observe(rail);
  } else {
    window.addEventListener('resize', onResize, { passive: true });
  }

  window.addEventListener('load', () => {
    requestAnimationFrame(() => requestAnimationFrame(onResize));
  }, { passive: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => onResize()).catch(() => {});
  }

  const sectionEl = wrap.closest('.hxg-section') || wrap;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        inView = !!e.isIntersecting;

        if (inView) {
          startHXG();
          requestAnimationFrame(() => {
            centers = cardCenters();
            lockDescHeightToMax();
            updateProgress();
            setActiveIndex(nearestIndexByScroll());
          });
        } else {
          stopTyping();
        }
      },
      {
        root: null,
        threshold: 0.35,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    io.observe(sectionEl);
  } else {
    inView = true;
    startHXG();
  }
})();