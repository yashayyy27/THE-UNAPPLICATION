import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "THE UNAPPLICATION — Yash Hurdale · R/GA 001",
  description:
    "Don’t interview my resume. Interview my thinking. An independent, interactive application by Yash Hurdale, grounded in inspectable analytical evidence.",
  robots: { index: false, follow: false },
  icons: { icon: "./favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
