module.exports = {
  reactStrictMode: true,
  images: {
    // loader: "custom",
    domains: ["www.dropbox.com"],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: "/(.*).(jpg|png)",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=31536000, s-maxage=31536000, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        // has: [
        //   {
        //     type: "content-type",
        //     key: "application/octet-stream",
        //   },
        // ],
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=86401, s-maxage=86401, stale-while-revalidate=172801",
          },
        ],
      },
    ];
  },
};
