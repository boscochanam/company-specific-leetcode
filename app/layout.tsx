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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
