import type { NextConfig } from "next";
const webpack = require('webpack');

const nextConfig: NextConfig = {
  // Turbopack configuration
  experimental: {
    turbo: {
      resolveAlias: {
        crypto: "crypto-browserify",
        stream: "stream-browserify",
        buffer: "buffer", 
        util: "util",
        assert: "assert",
        http: "stream-http",
        https: "https-browserify",
        os: "os-browserify/browser",
        url: "url",
        path: "path-browserify",
      },
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer"),
        util: require.resolve("util"),
        assert: require.resolve("assert"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        os: require.resolve("os-browserify/browser"),
        url: require.resolve("url"),
        fs: false,
        net: false,
        tls: false,
        path: require.resolve("path-browserify"),
      };

      // Add polyfills for Node.js modules
      config.resolve.alias = {
        ...config.resolve.alias,
        crypto: require.resolve("crypto-browserify"),
      };

      // Provide global polyfills
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        })
      );
    }

    // Add externals for XMTP dependencies
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    return config;
  },
};

export default nextConfig;
