/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    domains: [
      'cdn.hashnode.com',
      'cdn-images-1.medium.com',
      'raw.githubusercontent.com',
      'github.com',
      'res.cloudinary.com',
      'static.npmjs.com',
      'camo.githubusercontent.com',
      'user-images.githubusercontent.com',
      'pbs.twimg.com',
      'localhost',
      'lumoz-v2.web.app'
    ]
  }
};

module.exports = nextConfig;
