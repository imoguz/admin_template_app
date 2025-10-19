/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ACCESS_KEY: process.env.ACCESS_KEY,
  },
  images: {
    domains: ['localhost', '127.0.0.1', 'production-domain.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/v1/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/api/v1/uploads/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

module.exports = nextConfig;
