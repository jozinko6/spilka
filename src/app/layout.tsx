import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://spilkaterasa.sk"),
  title: "SPILKA Terasa | Tradičná kuchyňa s moderným duchom | Hlohovec",
  description:
    "SPILKA Terasa v Hlohovci - tradičná slovenská kuchyňa s moderným duchom. Exkluzívne tankové pivo Svijany 450. Reštaurácia, terasa, spoločenské priestory. Rezervácie: 033/322 22 99",
  keywords: [
    "SPILKA Terasa",
    "Hlohovec",
    "reštaurácia",
    "slovenská kuchyňa",
    "Svijany 450",
    "tankové pivo",
    "Flammkuchen",
    "denné menu",
    "rozvoz jedla",
    "oslavy",
    "svadby",
  ],
  authors: [{ name: "SPILKA Terasa" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SPILKA Terasa | Tradičná kuchyňa s moderným duchom",
    description:
      "Reštaurácia v Hlohovci s exkluzívnym tankovým pivom Svijany 450. Tradičná kuchyňa, moderná gastronomia, krásna terasa.",
    url: "https://spilkaterasa.sk",
    siteName: "SPILKA Terasa",
    type: "website",
    locale: "sk_SK",
    images: ["/images/spilka-facebook.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SPILKA Terasa | Hlohovec",
    description:
      "Tradičná slovenská kuchyňa s moderným duchom. Exkluzívne tankové pivo Svijany 450.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
