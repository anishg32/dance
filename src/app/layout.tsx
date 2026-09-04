import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { academyConfig } from "@/config/academy";

export const metadata: Metadata = {
  metadataBase: new URL(academyConfig.seo.url),
  title: `${academyConfig.name} - Bharatanatyam Dance Academy`,
  description: `${academyConfig.tagline}. ${academyConfig.description}`,
  openGraph: {
    title: academyConfig.name,
    description: `${academyConfig.tagline}. ${academyConfig.description}`,
    url: academyConfig.seo.url,
    siteName: academyConfig.name,
    images: [
      {
        url: academyConfig.seo.ogImage,
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: academyConfig.name,
    description: `${academyConfig.tagline}. ${academyConfig.description}`,
    images: [academyConfig.seo.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
