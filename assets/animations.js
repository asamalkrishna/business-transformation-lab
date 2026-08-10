// Lightweight scroll-reveal — tags common content blocks with .reveal
// then fades/slides them in as they enter the viewport. No dependencies.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var selectors = [
    'section',
    '.case-card',
    '.gallery-card',
    '.funfact',
    '.method-detail',
    '.finding-box',
    '.doc-section',
    '.kpi-cell',
    '.exp-item'
  ];

  document.querySelectorAll(selectors.join(',')).forEach(function (el) {
    el.classList.add('reveal');
  });

  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          setTimeout(function () {
            el.classList.add('is-visible');
          }, (i % 4) * 70);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
})();
