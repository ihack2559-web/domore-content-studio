import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domore Content Studio",
  description: "Sprint 1 foundation for Domore Content Studio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
