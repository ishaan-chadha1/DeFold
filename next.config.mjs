export default {
  async rewrites() {
    return [
      {
        source: "/api/noun",
        destination: "https://noun-api.com/beta/pfp", // Proxy to external API
      },
    ];
  },
  reactStrictMode: true,
};
