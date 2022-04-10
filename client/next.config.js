module.exports = {
  reactStrictMode: true,
  images: {
    loader: "custom",
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: "/(.*).jpg",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800",
          },
        ],
      },
      {
        source: "/(.*).png",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86400, s-maxage=86400, stale-while-revalidate=172800",
          },
        ],
      },
    ];
  },
};
