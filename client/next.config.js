module.exports = {
	reactStrictMode: true,
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	images: {
		domains: ["www.dropbox.com", "res.cloudinary.com"],
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
				source: "/(.*).(jpg|png)",
				headers: [
					{
						key: "Cache-Control",
						value:
							"public, max-age=31536000, s-maxage=31536000, must-revalidate",
					},
				],
			},
		];
	},
};
