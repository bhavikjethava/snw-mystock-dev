import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import Header from "@/components/header";

const roboto = Roboto({ weight: ["400","700"], subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Stocks",
  description: "Stocks app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={roboto.className}>
          <Header />
          {children}
        </body>
      </UserProvider>
    </html>
  );
}
