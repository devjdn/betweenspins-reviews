import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "img.clerk.com",
            },
            {
                protocol: "https",
                hostname: "images.clerk.dev",
            },
            {
                protocol: "https",
                hostname: "i.scdn.co",
            },
            {
                protocol: "https",
                hostname: "coverartarchive.org"
            },
            {
                protocol: "https",
                hostname: "**.archive.org",
                pathname: "/**",
            },
        ],
    },
    reactCompiler: true,
    // cacheComponents: true,
};

export default nextConfig;
