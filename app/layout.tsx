import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Logo from "./components/Logo";
import PuzzleProvider from "./context-providers/PuzzleProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Musoudle",
  description: "Inspired by Loldle which was inspired by Wordle, Musoudle is for guessing Dynasty Warriors characters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center pt-8`}
      >
        <PuzzleProvider>
          <Logo />
          {children}
        </PuzzleProvider>
      </body>
    </html>
  );
}
