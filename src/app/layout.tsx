import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { NextUIProvider } from '@nextui-org/react';
import Head from "next/head";


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
        <Head>
          <script src="https://js.stripe.com/v3/"></script>
        </Head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full bg-dark1`}
        >
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </body>
      </html>
  );
}
