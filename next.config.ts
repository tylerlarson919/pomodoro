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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com https://apis.google.com; https://vercel.live; " +
              "script-src-elem 'self' 'unsafe-inline' https://www.youtube.com https://s.ytimg.com https://apis.google.com; https://vercel.live; " +
              "style-src 'self' 'unsafe-inline'; " +
              "frame-src 'self' https://example.com https://www.youtube.com https://podo-fe249.firebaseapp.com; " +
              "connect-src 'self' https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://www.youtube.com https://firestore.googleapis.com; " + // Added Firestore URL
              "img-src 'self' data: https:;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
