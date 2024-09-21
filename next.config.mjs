export default {
  async rewrites() {
    return [
      {
        source: "/api/noun",
        destination: "https://noun-api.com/beta/pfp", // Proxy to external API
      },
      {
        source: "/api/worldcoin",
        destination: "https://bridge.worldcoin.org/request", // Proxy to Worldcoin API
      }
    ];
  },
  reactStrictMode: true,
};
