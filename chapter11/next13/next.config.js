/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverActions: true,
      appDir: true,
    },
    env: {
      KV_URL: 'http://localhost:3000',
      KV_REST_API_URL: 'http://localhost:3000',
      KV_REST_API_TOKEN: 'example_token',
      KV_REST_API_READ_ONLY_TOKEN: "example_token",
    }
  }
  
  module.exports = nextConfig