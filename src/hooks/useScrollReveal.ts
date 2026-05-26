import { useEffect } from 'react';

const SELECTORS = [
  '.section-heading',
  '.feature-card',
  '.catalog-card',
  '.service-card',
  '.contact-card',
  '.review-card',
  '.stats > div',
  '.order-intro',
  '.order-form',
  '.location-panel',
  '.highlight-list li',
  '.order-trust-item',
  '.sub-page-card',
  '.sub-page-two-col > div',
  '.achieve-stats > div',
  '.award-banner',
  '.cta-row',
  '.ticker',
  '.lede',
].join(', ');

export function useScrollReveal(dep?: unknown) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          // Stagger siblings by their index among observed siblings
          const siblings = el.parentElement
            ? Array.from(el.parentElement.querySelectorAll(':scope > .sr'))
            : [];
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = `${Math.min(idx * 0.08, 0.4)}s`;
          el.classList.add('sr--in');
          observer.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
    );

    document.querySelectorAll(SELECTORS).forEach((el) => {
      el.classList.add('sr');
      observer.observe(el);
    });

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep]);
}
