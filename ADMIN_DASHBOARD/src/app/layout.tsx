import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "../assets/themes/lara-light-teal/theme.css"
import "../assets/themes/lara-light-admin/theme.css"


import { APP_NAME } from "@/utils/constants";
import { Providers } from "@/providers/Providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME || "CloudLead Admin Dashboard",
  description: "CloudLead Admin Dashboard - Manage your business operations",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
      {children}
        </Providers>
        
      </body>
    </html>
  );
}
