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
  title: "VTU MCA GPA Calculator — 2026 Scheme",
  description:
    "Calculate your VTU MCA SGPA & CGPA for the 2026 scheme. Subject-wise marks entry with real-time grade calculation, specialization electives, charts, and PDF export.",
  keywords: [
    "VTU",
    "MCA",
    "GPA Calculator",
    "SGPA",
    "CGPA",
    "2026 Scheme",
    "Grade Calculator",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mesh bg-grid grain-overlay">
        {children}
      </body>
    </html>
  );
}
