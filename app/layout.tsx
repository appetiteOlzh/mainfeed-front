import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mainfeed - Your life is the main feed",
  description:
    "Swipe through the photos and videos already on your phone. Mainfeed is a private feed of your own life.",
  icons: { icon: "/assets/icon.webp" },
};
export const viewport: Viewport = { themeColor: "#f3f0e7" };
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/assets/phone/dog-feed.webp"
          type="image/webp"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
