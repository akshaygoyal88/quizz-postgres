/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Exclude Node.js built-in modules from the client bundle
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      // Add any other Node.js core modules you need to exclude
    };

    // Optional: If you want to exclude certain modules entirely from client-side builds
    config.externals = [
      ...config.externals,
      (context, request, callback) => {
        if (/^@mapbox\/node-pre-gyp/.test(request)) {
          return callback(null, "commonjs " + request);
        }
        callback();
      },
    ];

    return config;
  },
};

module.exports = nextConfig;
