/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    API_DOMAIN: process.env.API_DOMAIN,
  },
}

module.exports = nextConfig
