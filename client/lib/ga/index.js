// log the pageview with their URL
export const pageview = (url) => {
  window.gtag('config', 'G-2B8SVV4K29', {
    page_path: url
  })
}

// log specific events happening.
export const event = ({ action, params }) => {
  window.gtag('event', action, params)
}
