

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,  
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
      };
    }
      config.externals = [...(config.externals || []), "canvas"];
    config.watchOptions = {
      ignored: ['**/node_modules', '**/.next', '**/C:/Users/**/AppData/Local/Temp/**'],
    };
    return config;
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "http", hostname: "res.cloudinary.com" },
    ],
  },
 
  async rewrites() {
    return [
      {
        source: '/:locale/api/:path*',   
        destination: '/api/:path*',      
      },
    ];
  },
};

export default withNextIntl(nextConfig);

