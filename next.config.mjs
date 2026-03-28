

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,  
    // Large admin uploads (PDFs, images) can exceed the default request body clone limit.
    // This keeps the full body available when Next needs to proxy/clone the request stream.
    proxyClientMaxBodySize: "200mb",
    // Keep Server Actions aligned (even though uploads here use Route Handlers).
    serverActions: {
      bodySizeLimit: "200mb",
    },
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
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
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
