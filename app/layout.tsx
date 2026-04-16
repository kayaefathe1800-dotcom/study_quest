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
  title: "STUDY QUEST - 勉強で強くなれ！",
  description: "中学生向け勉強ゲームアプリ。問題を解いてキャラを育てよう！",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "STUDY QUEST",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950">{children}</body>
    </html>
  );
}
