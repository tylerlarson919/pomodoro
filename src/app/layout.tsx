
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from '@nextui-org/react';


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Focus Flow",
  description: "Get Ready to Focus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
      <html lang="en">

        <body
          className={`w-screen h-screen max-w-screen ${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
        >
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </body>
      </html>
  );
}
