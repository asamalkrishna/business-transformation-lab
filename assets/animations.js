
/* =========================================================
   AMAL KRISHNA — Site interactions
   Responsive mobile navigation
   ========================================================= */
(function () {
  "use strict";

  function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-links");

    if (!toggle || !menu) return;

    function setMenu(open) {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      document.body.classList.toggle("menu-open", open);
    }

    // Prevent duplicate listeners if a page/script is evaluated more than once.
    if (toggle.dataset.navReady === "true") return;
    toggle.dataset.navReady = "true";

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setMenu(!menu.classList.contains("open"));
    });

    // Navigation links must remain clickable. Close only after the browser
    // has received the click; do not preventDefault.
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    // Close when tapping outside the menu.
    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        setMenu(false);
      }
    });

    // Escape closes the menu.
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    // Restore desktop state if the viewport grows.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) setMenu(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavigation);
  } else {
    initNavigation();
  }
})();


(function () {
  "use strict";
  document.documentElement.classList.add("js");

  function initReveal() {
    var selectors = [
      ".page-header .wrap",
      "section .section-head",
      ".personal-card",
      ".country-card",
      ".method-detail",
      ".insight-card",
      ".professional-teaser",
      ".family-card",
      ".callout",
      ".about-visual figure",
      ".editorial-photo",
      ".case-visual",
      ".doc-section"
    ];
    var items = [];
    selectors.forEach(function (selector) {
      document.querySelectorAll(selector).forEach(function (el) {
        if (!el.classList.contains("reveal")) {
          el.classList.add("reveal");
          items.push(el);
        }
      });
    });

    if (!items.length) return;

    // Give repeated cards a restrained stagger, but never make the page feel slow.
    var counters = {};
    items.forEach(function (el) {
      var parent = el.parentElement;
      var key = parent ? parent.className : "root";
      counters[key] = (counters[key] || 0) + 1;
      var n = Math.min(counters[key], 5);
      if (n > 1) el.setAttribute("data-delay", String(n - 1));
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  function initMobileExpanders() {
    // Only long narrative case-study sections are collapsible.
    document.querySelectorAll(".doc-section").forEach(function (section) {
      if (section.querySelector(".data-table,.process-flow,.case-visual,.mock-dashboard,.diagram")) return;
      var textLength = (section.innerText || "").replace(/\s+/g, " ").trim().length;
      if (textLength < 520) return;
      section.classList.add("mobile-expandable");
      var button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-expand-toggle";
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = "<span>Read more</span> <span aria-hidden=\"true\">↓</span>";
      button.addEventListener("click", function () {
        var expanded = section.classList.toggle("is-expanded");
        button.setAttribute("aria-expanded", expanded ? "true" : "false");
        button.innerHTML = expanded
          ? "<span>Show less</span> <span aria-hidden=\"true\">↑</span>"
          : "<span>Read more</span> <span aria-hidden=\"true\">↓</span>";
      });
      section.appendChild(button);
    });
  }

  function init() {
    initReveal();
    initMobileExpanders();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
