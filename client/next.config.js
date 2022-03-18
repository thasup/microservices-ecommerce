module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["www.dropbox.com"],
    minimumCacheTTL: 86400,
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
};
