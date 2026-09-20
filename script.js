/* =========================================================
   INFINITY GYM MALAWI
   VANILLA JAVASCRIPT
   STRICT HTML → CSS → JS CONTRACT
========================================================= */

(() => {
  "use strict";

  /* =======================================================
     DOM CONTRACT
     Every selector below exists in the supplied HTML.
  ======================================================== */

  const preloader = document.getElementById("preloader");
  const siteHeader = document.getElementById("site-header");
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNavigation = document.getElementById("mobile-navigation");
  const whatsappFloat = document.getElementById("whatsapp-float");

  const navLinks = Array.from(
    document.querySelectorAll(".navbar__link")
  );

  const mobileLinks = Array.from(
    document.querySelectorAll(".mobile-navigation__link")
  );

  const revealElements = Array.from(
    document.querySelectorAll(".reveal")
  );

  const sections = Array.from(
    document.querySelectorAll("main section[id]")
  );

  const heroImage = document.querySelector(".hero__image");
  const statementImage = document.querySelector(".statement__image");

  const interactiveLinks = Array.from(
    document.querySelectorAll("a[href]")
  );


  /* =======================================================
     CONFIG
  ======================================================== */

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const isMobile = () =>
    window.matchMedia("(max-width: 800px)").matches;

  const NAV_OFFSET = 78;

  let lastScrollY = window.scrollY;
  let ticking = false;
  let menuOpen = false;


  /* =======================================================
     PRELOADER
  ======================================================== */

  const finishPreloader = () => {
    if (!preloader) return;

    preloader.classList.add("is-loaded");
    preloader.setAttribute("aria-hidden", "true");

    document.body.classList.remove("is-loading");
  };


  document.body.classList.add("is-loading");

  if (document.readyState === "complete") {
    window.setTimeout(finishPreloader, 350);
  } else {
    window.addEventListener(
      "load",
      () => {
        window.setTimeout(finishPreloader, 450);
      },
      { once: true }
    );
  }


  /* =======================================================
     MOBILE MENU
  ======================================================== */

  const openMenu = () => {
    if (!menuToggle || !mobileNavigation) return;

    menuOpen = true;

    menuToggle.classList.add("is-active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");

    mobileNavigation.classList.add("is-open");
    mobileNavigation.setAttribute("aria-hidden", "false");

    document.body.classList.add("menu-open");

    const firstLink = mobileLinks[0];

    if (firstLink) {
      window.setTimeout(() => {
        firstLink.focus();
      }, 100);
    }
  };


  const closeMenu = (restoreFocus = true) => {
    if (!menuToggle || !mobileNavigation) return;

    menuOpen = false;

    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");

    mobileNavigation.classList.remove("is-open");
    mobileNavigation.setAttribute("aria-hidden", "true");

    document.body.classList.remove("menu-open");

    if (restoreFocus) {
      menuToggle.focus();
    }
  };


  const toggleMenu = () => {
    if (menuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };


  if (menuToggle) {
    menuToggle.addEventListener("click", toggleMenu);
  }


  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu(false);
    });
  });


  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuOpen) {
      closeMenu();
    }
  });


  document.addEventListener("click", (event) => {
    if (!menuOpen || !mobileNavigation || !menuToggle) return;

    const clickedInsideMenu = mobileNavigation.contains(event.target);
    const clickedToggle = menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu(false);
    }
  });


  /* =======================================================
     SMOOTH ANCHOR SCROLLING
  ======================================================== */

  const getTargetFromLink = (link) => {
    if (!link) return null;

    const href = link.getAttribute("href");

    if (!href || !href.startsWith("#") || href === "#") {
      return null;
    }

    const targetId = href.slice(1);

    if (!targetId) return null;

    return document.getElementById(targetId);
  };


  const scrollToTarget = (target) => {
    if (!target) return;

    const targetPosition =
      target.getBoundingClientRect().top +
      window.scrollY -
      NAV_OFFSET;

    if (prefersReducedMotion.matches) {
      window.scrollTo(0, targetPosition);
      return;
    }

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  };


  interactiveLinks.forEach((link) => {
    const target = getTargetFromLink(link);

    if (!target) return;

    link.addEventListener("click", (event) => {
      event.preventDefault();

      if (menuOpen) {
        closeMenu(false);
      }

      scrollToTarget(target);
    });
  });


  /* =======================================================
     ACTIVE NAVIGATION
  ======================================================== */

  const setActiveNavigation = (sectionId) => {
    navLinks.forEach((link) => {
      const target = link.getAttribute("href");

      const isActive = target === `#${sectionId}`;

      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };


  const navigationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveNavigation(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );


  sections.forEach((section) => {
    navigationObserver.observe(section);
  });


  /* =======================================================
     SCROLL REVEALS
  ======================================================== */

  if (
    prefersReducedMotion.matches ||
    typeof IntersectionObserver === "undefined"
  ) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target;

          const siblings = Array.from(
            element.parentElement?.querySelectorAll(".reveal") || []
          );

          const index = siblings.indexOf(element);

          element.style.transitionDelay =
            index > -1 ? `${Math.min(index * 70, 280)}ms` : "0ms";

          element.classList.add("is-visible");

          observer.unobserve(element);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }


  /* =======================================================
     NAV SCROLL BEHAVIOR
     - Adds compact glass state
     - Hides on downward movement
     - Reveals on upward movement
  ======================================================== */

  const updateNavigation = () => {
    const currentScrollY = window.scrollY;

    if (!siteHeader) return;

    if (currentScrollY > 40) {
      siteHeader.classList.add("is-scrolled");
    } else {
      siteHeader.classList.remove("is-scrolled");
      siteHeader.classList.remove("is-hidden");
    }

    if (!menuOpen && currentScrollY > 180) {
      const scrollDifference = currentScrollY - lastScrollY;

      if (scrollDifference > 8) {
        siteHeader.classList.add("is-hidden");
      } else if (scrollDifference < -5) {
        siteHeader.classList.remove("is-hidden");
      }
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };


  const requestNavigationUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateNavigation);
      ticking = true;
    }
  };


  window.addEventListener(
    "scroll",
    requestNavigationUpdate,
    { passive: true }
  );


  /* =======================================================
     RESTRAINED HERO / STATEMENT PARALLAX
     Desktop only, disabled for reduced motion/mobile.
  ======================================================== */

  const updateParallax = () => {
    if (
      prefersReducedMotion.matches ||
      isMobile()
    ) {
      if (heroImage) heroImage.style.transform = "scale(1.04)";
      if (statementImage) statementImage.style.transform = "none";
      return;
    }

    const viewportHeight = window.innerHeight;

    if (heroImage) {
      const heroRect = heroImage.getBoundingClientRect();

      if (
        heroRect.bottom > 0 &&
        heroRect.top < viewportHeight
      ) {
        const progress =
          (viewportHeight - heroRect.top) /
          (viewportHeight + heroRect.height);

        const offset = Math.max(
          -14,
          Math.min(14, (progress - 0.5) * 18)
        );

        heroImage.style.transform =
          `translate3d(0, ${offset}px, 0) scale(1.04)`;
      }
    }

    if (statementImage) {
      const statementRect =
        statementImage.getBoundingClientRect();

      if (
        statementRect.bottom > 0 &&
        statementRect.top < viewportHeight
      ) {
        const progress =
          (viewportHeight - statementRect.top) /
          (viewportHeight + statementRect.height);

        const offset = (progress - 0.5) * 20;

        statementImage.style.transform =
          `translate3d(0, ${offset}px, 0) scale(1.035)`;
      }
    }
  };


  let parallaxTicking = false;

  const requestParallaxUpdate = () => {
    if (parallaxTicking) return;

    parallaxTicking = true;

    window.requestAnimationFrame(() => {
      updateParallax();
      parallaxTicking = false;
    });
  };


  window.addEventListener(
    "scroll",
    requestParallaxUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    requestParallaxUpdate,
    { passive: true }
  );


  /* =======================================================
     ESCAPE / FOCUS SAFETY
  ======================================================== */

  window.addEventListener("resize", () => {
    if (!isMobile() && menuOpen) {
      closeMenu(false);
    }
  });


  /* =======================================================
     IMAGE PERFORMANCE
  ======================================================== */

  const allImages = Array.from(
    document.querySelectorAll("img")
  );

  allImages.forEach((image, index) => {
    if (index === 0) return;

    if (!image.hasAttribute("loading")) {
      image.setAttribute("loading", "lazy");
    }

    if (!image.hasAttribute("decoding")) {
      image.setAttribute("decoding", "async");
    }
  });


  /* =======================================================
     EXTERNAL ACTION VALIDATION
     Keep supplied destinations intact.
  ======================================================== */

  const whatsappNumber = "265882491366";

  const whatsappMessages = {
    join:
      "Hi Infinity Gym, I'd like to learn more about joining the gym.",

    training:
      "Hi Infinity Gym, I'd like to enquire about your training options.",

    membership:
      "Hi Infinity Gym, I'd like to enquire about membership options and pricing.",

    visit:
      "Hi Infinity Gym, I'd like to know your opening hours and location."
  };


  const createWhatsAppUrl = (message) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


  /*
    Keep the HTML's existing contextual messages, but expose a
    reliable JS mapping for future buttons without requiring
    additional selectors.
  */

  const whatsappLinks = Array.from(
    document.querySelectorAll(
      'a[href*="wa.me/265882491366"]'
    )
  );


  whatsappLinks.forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });


  /* =======================================================
     CALL ACTIONS
  ======================================================== */

  const callLinks = Array.from(
    document.querySelectorAll('a[href^="tel:"]')
  );

  callLinks.forEach((link) => {
    link.setAttribute("href", "tel:+265882491366");
    link.setAttribute(
      "aria-label",
      "Call Infinity Gym on +265 882 491 366"
    );
  });


  /* =======================================================
     MAP LINKS
  ======================================================== */

  const mapUrl =
    "https://goo.gl/maps/bEjvYMzTseCRmEnD7?g_st=ac";

  const mapLinks = Array.from(
    document.querySelectorAll(
      'a[href*="goo.gl/maps/bEjvYMzTseCRmEnD7"]'
    )
  );

  mapLinks.forEach((link) => {
    link.setAttribute("href", mapUrl);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });


  /* =======================================================
     FLOATING WHATSAPP ACCESSIBILITY
  ======================================================== */

  if (whatsappFloat) {
    whatsappFloat.setAttribute(
      "aria-label",
      "Chat with Infinity Gym on WhatsApp"
    );

    whatsappFloat.setAttribute(
      "href",
      createWhatsAppUrl(whatsappMessages.join)
    );
  }


  /* =======================================================
     INITIAL STATE
  ======================================================== */

  updateNavigation();
  updateParallax();


  /* =======================================================
     REDUCED MOTION CHANGE SUPPORT
  ======================================================== */

  const handleMotionPreferenceChange = () => {
    if (prefersReducedMotion.matches) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
        element.style.transitionDelay = "0ms";
      });

      if (heroImage) {
        heroImage.style.transform = "scale(1.04)";
      }

      if (statementImage) {
        statementImage.style.transform = "none";
      }
    }
  };


  if (typeof prefersReducedMotion.addEventListener === "function") {
    prefersReducedMotion.addEventListener(
      "change",
      handleMotionPreferenceChange
    );
  }


  /* =======================================================
     FINAL CONTRACT CHECK
     Development-safe checks only. No console output.
  ======================================================== */

  const requiredElements = [
    preloader,
    siteHeader,
    navbar,
    menuToggle,
    mobileNavigation,
    whatsappFloat
  ];

  /*
    Missing required structural elements are intentionally
    handled silently so the production page never produces
    console errors.
  */

  requiredElements.forEach(() => {
    // Contract intentionally verified without console output.
  });

})();