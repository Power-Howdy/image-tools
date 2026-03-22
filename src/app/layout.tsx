import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: "ImageTools - Quick Image Utilities",
  description:
    "Free online image tools: compress, resize, crop, convert formats, remove background. No upload required - all processing in your browser.",
  keywords: [
    "image compressor",
    "image resize",
    "image crop",
    "remove background",
    "PNG to JPG",
    "WebP to PNG",
    "base64 image",
    "online image editor",
    "free image tools",
    "privacy-first",
    "client-side image processing",
  ],
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "ImageTools - Quick Image Utilities",
    description:
      "Free online image tools: compress, resize, crop, convert formats, remove background.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased font-sans">
        {children}
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Analytics />
      </body>
    </html>
  );
}
