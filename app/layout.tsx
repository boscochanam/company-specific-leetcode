import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Panda LeetCode",
  description: "Find LeetCode problems frequently asked by top tech companies. Search and filter problems by company and time period to focus your interview preparation.",
  keywords: ["leetcode", "interview", "coding", "tech companies", "programming", "algorithms", "data structures"],
  authors: [{ name: "Panda LeetCode" }],
  openGraph: {
    title: "Panda LeetCode",
    description: "Find LeetCode problems frequently asked by top tech companies. Search and filter problems by company and time period to focus your interview preparation.",
    url: "https://panda-leetcode.vercel.app",
    siteName: "Panda LeetCode",
    images: [
      {
        url: "/panda.svg",
        width: 800,
        height: 800,
        alt: "Panda LeetCode - Interview Preparation Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Panda LeetCode",
    description: "Find LeetCode problems frequently asked by top tech companies. Search and filter problems by company and time period to focus your interview preparation.",
    images: ["/panda.svg"],
    creator: "@pandaleetcode",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/panda.svg",
    shortcut: "/panda.svg",
    apple: "/panda.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#d3cac2" />
        <meta name="apple-mobile-web-app-title" content="Panda LeetCode" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{
          backgroundColor: '#d3cac2', // Panda agreeable grey
          minHeight: '100dvh', // Dynamic viewport height for mobile
        }}
      >
        <div 
          style={{
            backgroundColor: '#d3cac2',
            minHeight: '100dvh',
            paddingTop: 'env(safe-area-inset-top)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
