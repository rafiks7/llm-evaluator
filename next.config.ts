import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    config.module?.rules?.push({
      test: /\.node$/,
      loader: "node-loader",
    });

    if (isServer) {
      config.ignoreWarnings = config.ignoreWarnings || [];
      config.ignoreWarnings.push({ module: /opentelemetry/ });
    }

    return config;
  },
};

export default nextConfig;
