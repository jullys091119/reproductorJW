/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cms-imgp.jw-cdn.org",
      },
      {
        protocol: "http",
        hostname: "cms-imgp.jw-cdn.org",
      },
      {
        protocol: "https",
        hostname: "assetsnffrgf-a.akamaihd.net",
      }
    ],
  },
  
};

export default nextConfig;
