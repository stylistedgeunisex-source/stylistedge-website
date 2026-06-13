import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://stylistedge.in'),
  title: {
    default: "Stylist Edge Salon | Style That Speaks Confidence",
    template: "%s | Stylist Edge Salon",
  },
  description: "Experience the ultimate in feminine luxury, spa therapies, advanced facial treatments, and precision hair styling at Stylist Edge Salon, Dharmapuri. Curated by E. Ranjitha.",
  keywords: ["Stylist Edge Salon", "Dharmapuri Salon", "Unisex Salon Dharmapuri", "Hair Styling", "Spa Therapies", "Facial Treatments", "Bridal Makeup", "E. Ranjitha"],
  authors: [{ name: "E. Ranjitha" }],
  creator: "E. Ranjitha",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://stylistedge.in",
    title: "Stylist Edge Salon | Style That Speaks Confidence",
    description: "Experience the ultimate in feminine luxury, spa therapies, advanced facial treatments, and precision hair styling at Stylist Edge Salon, Dharmapuri. Curated by E. Ranjitha.",
    siteName: "Stylist Edge Salon",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "Stylist Edge Salon Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stylist Edge Salon | Style That Speaks Confidence",
    description: "Experience the ultimate in feminine luxury, spa therapies, advanced facial treatments, and precision hair styling at Stylist Edge Salon, Dharmapuri.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "https://stylistedge.in",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FDF8F6] text-[#1A1A1A]">
        {children}
      </body>
    </html>
  );
}
