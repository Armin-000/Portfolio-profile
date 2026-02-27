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

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Flip);

const content = document.querySelector("body");
const imgLoad = imagesLoaded(content);
const loadingWrap = document.querySelector(".loading-wrap");
const loadingItems = loadingWrap.querySelectorAll(".loading__item");
const fadeInItems = document.querySelectorAll(".loading__fade");

function startLoader() {
  const counterElement = document.querySelector(".loader__count .count__text");
  let currentValue = 0;
  function updateCounter() {
    if (currentValue < 100) {
      const increment = Math.floor(Math.random() * 10) + 1;
      currentValue = Math.min(currentValue + increment, 100);
      counterElement.textContent = currentValue;
      const delay = Math.floor(Math.random() * 120) + 25;
      setTimeout(updateCounter, delay);
    }
  }
  updateCounter();
}
startLoader();

imgLoad.on("done", () => {
  hideLoader();
  pageAppearance();
});

function hideLoader() {
  gsap.to(".loader__count", {
    duration: 0.8,
    ease: "power2.in",
    y: "100%",
    delay: 1.8,
  });
  gsap.to(".loader__wrapper", {
    duration: 0.8,
    ease: "power4.in",
    y: "-100%",
    delay: 2.2,
  });
  setTimeout(() => {
    document.getElementById("loader").classList.add("loaded");
  }, 3200);
}

function pageAppearance() {
  gsap.set(loadingItems, { opacity: 0 });
  gsap.to(
    loadingItems,
    {
      duration: 1.1,
      ease: "power4",
      startAt: { y: 120 },
      y: 0,
      opacity: 1,
      delay: 0.8,
      stagger: 0.08,
    },
    ">-=1.1",
  );
  gsap.set(fadeInItems, { opacity: 0 });
  gsap.to(fadeInItems, { duration: 0.8, ease: "none", opacity: 1, delay: 3.2 });
}

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

$(window).on("load", function () {
  "use strict";

  const animatedHeadline = $(".animated-type");
  if (animatedHeadline.length) {
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
});

$(window).on("scroll", function () {
  if ($(window).scrollTop() > 10) {
    $(".mxd-header").addClass("is-hidden");
  } else {
    $(".mxd-header").removeClass("is-hidden");
  }
});

// Hero animations grouped and scoped
(() => {
  // Hero 02 static elements
  const hero02StaticEls = document.querySelectorAll(".hero-02-static-anim-el");
  hero02StaticEls.forEach((element) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero-02-static__tl-trigger",
        start: "top 14%",
        end: "top 0.2%",
        scrub: { scrub: true, ease: "sine" },
      },
    });
    tl.fromTo(
      element,
      { transform: "translate3d(0, 0, 0)", scaleY: 1, opacity: 1 },
      { transform: "translate3d(0, -5rem, 0)", scaleY: 1.3, opacity: 0 },
    );
  });

  const hero02FadeEls = document.querySelectorAll(".hero-02-fade-out-scroll");
  hero02FadeEls.forEach((element) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-pinned-fullscreen__tl-trigger",
        start: "top 80%",
        end: "top 10%",
        scrub: { scrub: true, ease: "sine" },
      },
    });
    tl.fromTo(element, { opacity: 1 }, { opacity: 0 });
  });

  // Hero 07 animations
  const hero07SlideEls = document.querySelectorAll(".hero-07-slide-out-scroll");
  hero07SlideEls.forEach((element) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-hero-07__tl-trigger",
        start: "top 86%",
        end: "top 10%",
        scrub: { scrub: true, ease: "power4.out" },
      },
    });
    tl.fromTo(
      element,
      { transform: "translate3d(0, 0, 0)", scaleY: 1 },
      { transform: "translate3d(0, -26rem, 0)", scaleY: 0.8 },
    );
  });

  const hero07FadeEls = document.querySelectorAll(".hero-07-fade-out-scroll");
  hero07FadeEls.forEach((element) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-hero-07__tl-trigger",
        start: "top 70%",
        end: "top 40%",
        scrub: { scrub: true, ease: "elastic.out(1,0.3)" },
      },
    });
    tl.fromTo(
      element,
      { opacity: 1, transform: "translate3d(0, 0, 0)" },
      { opacity: 0, transform: "translate3d(0, -10rem, 0)" },
    );
  });

  // Hero 08 animations
  const hero08SlideEls = document.querySelectorAll(".hero-08-slide-out-scroll");
  hero08SlideEls.forEach((element) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-hero-08__tl-trigger",
        start: "top 80%",
        end: "top 40%",
        scrub: { scrub: true, ease: "power4.inOut" },
      },
    });
    tl.fromTo(
      element,
      { transform: "translate3d(0, 0, 0)", opacity: 1 },
      { transform: "translate3d(0, -5rem, 0)", opacity: 0 },
    );
  });

  const hero08ScaleEls = document.querySelectorAll(".hero-08-scale-out-scroll");
  hero08ScaleEls.forEach((element) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".mxd-hero-08__tl-trigger",
        start: "top 40%",
        end: "top 10%",
        scrub: { scrub: true, ease: "power4.inOut" },
      },
    });
    tl.fromTo(
      element,
      { transform: "translate3d(0, 0, 0)", scaleY: 1, opacity: 1 },
      { transform: "translate3d(0, -5rem, 0)", scaleY: 1.2, opacity: 0 },
    );
  });
})();

$(function () {
  if (!Modernizr.svg) {
    $("img[src*='svg']").attr("src", function () {
      return $(this).attr("src").replace(".svg", ".png");
    });
  }

  try {
    $.browserSelector();
    if ($("html").hasClass("chrome")) {
      $.smoothScroll();
    }
  } catch (err) {}

  $("img, a").on("dragstart", function (event) {
    event.preventDefault();
  });

  // detect touch devices, legacy IE detection removed (unused)
  if (
    /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  ) {
    $("html").addClass("touch");
  } else {
    $("html").addClass("no-touch");
  }

  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ===
          this.pathname.replace(/^\//, "") &&
        location.hostname === this.hostname
      ) {
        let target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            { scrollTop: target.offset().top },
            1000,
            function () {
              const $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr("tabindex", "-1");
                $target.focus();
              }
            },
          );
        }
      }
    });

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

gsap.to("[data-speed]", {
  y: (i, el) =>
    (1 - parseFloat(el.getAttribute("data-speed"))) *
    ScrollTrigger.maxScroll(window),
  ease: "none",
  scrollTrigger: {
    start: 0,
    end: "max",
    invalidateOnRefresh: true,
    scrub: 0,
  },
});

document.addEventListener("DOMContentLoaded", () => {
  void initTubesBackground();
});

async function initTubesBackground() {
  const host = document.getElementById("canvas");
  if (!host) return;

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

  const env = getEnv();

  const CONFIG = {
    importUrl:
      "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js",

    colors: ["#11cee3", "#058391", "#006e7a", "#017380"],

    renderer: {
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    },

    tubes: {
      lightsIntensity: 18,
    },

    fps: env.isMobile ? 24 : 30,

    dprCap: env.isMobile ? 0.5 : 0.65,

    fixedPointerOnTouch: true,
    fixedPointer: { x: 0.5, y: 0.5 },

    scrollIdleMs: 160,

    blockedEventTypes: [
      "touchstart",
      "touchmove",
      "touchend",
      "touchcancel",
      "pointerdown",
      "pointermove",
      "pointerup",
      "pointercancel",
    ],
  };

  const TubesCursor = await safeImportDefault(CONFIG.importUrl);
  if (!TubesCursor) return;

  lockBehind(host);

  const app = env.isTouchDevice
    ? withTemporarilyBlockedListeners(CONFIG.blockedEventTypes, () =>
        createApp(TubesCursor, host, CONFIG),
      )
    : createApp(TubesCursor, host, CONFIG);

  if (!app?.renderer) return;

  const renderer = app.renderer;
  const gl = renderer.domElement;

  renderer.setClearColor?.(0x000000, 0);

  lockBehind(gl);

  const viewport = createViewportController({
    renderer,
    dprCap: CONFIG.dprCap,
  });
  viewport.sync();

  const pointer = createPointerController({
    app,
    env,
    getViewportSize: viewport.getSize,
    fixedPointer: CONFIG.fixedPointer,
    fixedOnTouch: CONFIG.fixedPointerOnTouch,
  });
  pointer.init();

  const renderFn = app.render || app.update;
  if (typeof renderFn !== "function") return;

  const loop = createFpsLoop({
    fps: CONFIG.fps,
    tick: (t) => {
      if (env.isTouchDevice && CONFIG.fixedPointerOnTouch) {
        pointer.setNormalized(CONFIG.fixedPointer.x, CONFIG.fixedPointer.y);
      }
      renderFn(t);
    },
  });
  loop.start();

  const onVisibility = () => (document.hidden ? loop.stop() : loop.start(true));
  document.addEventListener("visibilitychange", onVisibility, {
    passive: true,
  });

  let onScroll = null;
  if (env.isTouchDevice) {
    onScroll = createScrollPauseHandler({
      onPause: () => loop.stop(),
      onResume: () => loop.start(true),
      onSync: () => viewport.sync(),
      idleMs: CONFIG.scrollIdleMs,
    });
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // cleanup hook may be invoked externally (e.g. SPA unmount)
  // eslint-disable-next-line no-unused-vars
  const cleanup = () => {
    loop.stop();
    pointer.destroy();
    viewport.destroy();
    document.removeEventListener("visibilitychange", onVisibility);
    if (onScroll) window.removeEventListener("scroll", onScroll);
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
      lights: {
        intensity: CONFIG.tubes.lightsIntensity,
        colors: CONFIG.colors,
      },
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

function withTemporarilyBlockedListeners(blockedTypes, fn) {
  const proto = globalThis.EventTarget?.prototype;
  const add = proto?.addEventListener;
  if (typeof add !== "function") return fn();

  const blocked = new Set(blockedTypes);

  proto.addEventListener = function (type, listener, options) {
    try {
      const t = String(type);
      if (blocked.has(t) || t.startsWith("touch") || t.startsWith("pointer"))
        return;
    } catch (_) {}
    return add.call(this, type, listener, options);
  };

  try {
    return fn();
  } finally {
    proto.addEventListener = add;
  }
}

function createViewportController({ renderer, dprCap }) {
  const vv = window.visualViewport || null;
  let raf = 0;

  const getSize = () => {
    const w = vv ? Math.round(vv.width) : document.documentElement.clientWidth;
    const h = vv
      ? Math.round(vv.height)
      : document.documentElement.clientHeight;
    return { w, h };
  };

  const sync = () => {
    if (!renderer) return;
    if (raf) return;

    raf = requestAnimationFrame(() => {
      raf = 0;
      const { w, h } = getSize();
      const baseDpr = Math.min(window.devicePixelRatio || 1, 2);
      const dpr = baseDpr * dprCap;

      renderer.setPixelRatio(Math.max(0.5, Math.min(1, dpr)));
      renderer.setSize(w, h, false);
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

  return { getSize, sync, destroy };
}

function createPointerController({
  app,
  env,
  getViewportSize,
  fixedPointer,
  fixedOnTouch,
}) {
  let onMove = null;

  const setNormalized = (nx, ny) => {
    nx = clamp01(nx);
    ny = clamp01(ny);

    try {
      if (app?.pointer) {
        app.pointer.x = nx;
        app.pointer.y = ny;
        return;
      }
      if (app?.mouse) {
        app.mouse.x = nx;
        app.mouse.y = ny;
        return;
      }
      if (app?.params?.mouse) {
        app.params.mouse.x = nx;
        app.params.mouse.y = ny;
        return;
      }
      if (app?.uniforms?.u_mouse?.value) {
        app.uniforms.u_mouse.value.x = nx;
        app.uniforms.u_mouse.value.y = ny;
      }
    } catch (_) {}
  };

  const init = () => {
    if (env.isTouchDevice) {
      if (fixedOnTouch) setNormalized(fixedPointer.x, fixedPointer.y);
      return;
    }

    onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen")
        return;

      const { w, h } = getViewportSize();
      if (!w || !h) return;

      setNormalized(e.clientX / w, e.clientY / h);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
  };

  const destroy = () => {
    if (onMove) window.removeEventListener("pointermove", onMove);
    onMove = null;
  };

  return { init, destroy, setNormalized };
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

function createScrollPauseHandler({ onPause, onResume, onSync, idleMs }) {
  let timer = 0;
  return () => {
    onPause?.();
    onSync?.();
    clearTimeout(timer);
    timer = setTimeout(() => onResume?.(), idleMs);
  };
}

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("#skills.awSkillDeck");
  if (!section) return;

  const cards = Array.from(section.querySelectorAll(".awSkillCard"));

  section.classList.add("is-ready");

  cards.forEach((card) => {
    const level = Math.max(0, Math.min(100, Number(card.dataset.level || 0)));
    const bar = card.querySelector(".awGauge__bar");
    const glow = card.querySelector(".awGauge__glow");
    const count = card.querySelector(".awCount");
    if (!bar || !glow || !count) return;

    const r = 46;
    const C = 2 * Math.PI * r;

    bar.style.strokeDasharray = `0 ${C}`;
    glow.style.strokeDasharray = `0 ${C}`;
    count.textContent = "0";

    card._aw = { level, C, bar, glow, count, current: 0, raf: 0 };
  });

  function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function animateTo(card, toLevel, duration = 900) {
    const d = card._aw;
    if (!d) return;

    if (d.raf) cancelAnimationFrame(d.raf);

    const from = d.current;
    const to = Math.max(0, Math.min(100, toLevel));
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const e = easeInOut(p);

      const val = from + (to - from) * e;
      d.current = val;

      const cur = (val / 100) * d.C;
      d.bar.style.strokeDasharray = `${cur} ${d.C}`;
      d.glow.style.strokeDasharray = `${cur} ${d.C}`;
      d.count.textContent = String(Math.round(val));

      if (p < 1) d.raf = requestAnimationFrame(tick);
    };

    d.raf = requestAnimationFrame(tick);
  }

  const seen = new WeakSet();

  const cardIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const card = e.target;
        if (!card._aw) return;

        if (e.isIntersecting) {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";

          animateTo(card, card._aw.level, 950);
          seen.add(card);
        } else {
          animateTo(card, 0, 650);
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  cards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(10px)";
    card.style.transition = "opacity .45s ease, transform .45s ease";

    cardIO.observe(card);
  });

  setTimeout(() => {
    if (!document.querySelector("#skills .awSkillCard[style*='opacity: 1']")) {
      cards.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
      });
      section.classList.remove("is-ready");
    }
  }, 900);
});

(function () {
  const btn = document.getElementById("openProjectsMenu");
  if (!btn) return;

  const burger = document.querySelector(".mxd-nav__hamburger");

  const projectsToggle = Array.from(
    document.querySelectorAll(".main-menu__link.btn.btn-anim"),
  ).find((el) => (el.textContent || "").trim().toLowerCase() === "my projects");

  const openHamburger = () => {
    if (!burger) return;
    burger.click();
  };

  const openProjectsSubmenu = () => {
    if (!projectsToggle) return;

    projectsToggle.click();

    projectsToggle.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    openHamburger();

    setTimeout(openProjectsSubmenu, 120);
  });
})();
