/* AMAL KRISHNA — Site interactions
   Navigation intentionally uses simple click/tap state on mobile.
   This avoids Safari's hover/focus behaviour for nested menus.
*/
(function () {
  "use strict";

  function initNavigation() {
    var nav = document.querySelector(".site-nav");
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector(".nav-links");
    if (!nav || !toggle || !menu) return;

    var dropdowns = nav.querySelectorAll(".nav-dropdown");

    function closeDropdown(dropdown) {
      if (!dropdown) return;
      dropdown.classList.remove("open", "mobile-open");
      var button = dropdown.querySelector(".nav-dropdown-toggle");
      if (button) button.setAttribute("aria-expanded", "false");
    }

    function closeAllDropdowns(except) {
      dropdowns.forEach(function (dropdown) {
        if (dropdown !== except) closeDropdown(dropdown);
      });
    }

    function setMenu(open) {
      if (open) {
        menu.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation");
        document.body.classList.add("menu-open");
      } else {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
        document.body.classList.remove("menu-open");
        closeAllDropdowns(null);
      }
    }

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      setMenu(!menu.classList.contains("open"));
    });

    /* Mobile Work / Personal: explicit tap state. */
    dropdowns.forEach(function (dropdown) {
      var button = dropdown.querySelector(".nav-dropdown-toggle");
      if (!button) return;

      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        var wasOpen = dropdown.classList.contains("open");
        closeAllDropdowns(dropdown);

        if (wasOpen) {
          closeDropdown(dropdown);
        } else {
          dropdown.classList.add("open", "mobile-open");
          button.setAttribute("aria-expanded", "true");

          /* iOS Safari fix: newly-revealed content inside a
             backdrop-filter ancestor (.nav-links) sometimes isn't
             painted until the compositor is forced to recalculate.
             Reading offsetHeight forces a synchronous reflow. */
          void dropdown.offsetHeight;
          void menu.offsetHeight;
        }
      });
    });

    /* Let every actual page link navigate normally. */
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });

    /* Close only when the tap/click starts outside the navigation. */
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) setMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    /* Current-page state. */
    var currentPage = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    menu.querySelectorAll("a").forEach(function (link) {
      var href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (href && href === currentPage) {
        link.classList.add("active");
        var parent = link.closest(".nav-dropdown");
        if (parent) parent.classList.add("has-active");
      }
    });

    /* Keep desktop clean if the viewport changes size. */
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
