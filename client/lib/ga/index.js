export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-2B8SVV4K29';

// log the pageview with their URL
export const pageview = (url) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('config', GA_ID, {
    page_path: url
  });
};

// log specific events happening.
export const event = ({ action, params }) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', action, params);
};
