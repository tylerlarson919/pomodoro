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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' wss://ws-us3.pusher.com https://www.youtube.com https://s.ytimg.com https://apis.google.com https://vercel.live; " +
              "script-src-elem 'self' 'unsafe-inline' wss://ws-us3.pusher.com https://www.youtube.com https://s.ytimg.com https://apis.google.com https://vercel.live; " +
              "style-src 'self' 'unsafe-inline' wss://ws-us3.pusher.com https://vercel.live; " +
              "frame-src 'self' wss://ws-us3.pusher.com https://example.com https://www.youtube.com https://podo-fe249.firebaseapp.com https://vercel.live; " +
              "connect-src 'self' wss://ws-us3.pusher.com ttps://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://www.youtube.com https://firestore.googleapis.com https://vercel.live; " + // Added Firestore URL
              "img-src 'self' data: https:;"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
