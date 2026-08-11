
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
