/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    styledComponents: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig