import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riffus - Cafe Music",
  description: "Customers request songs, cafe owners control the queue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
