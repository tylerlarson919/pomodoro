import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; " +
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com www.youtube.com; " +
                   "script-src-elem 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com www.youtube.com; " +
                   "style-src 'self' 'unsafe-inline'; " +
                   "frame-src https://www.youtube.com; " +
                   "connect-src https://www.youtube.com; " +
                   "img-src 'self' data: https:;"
          }
        ]
      }
    ]
  }
};

export default nextConfig;