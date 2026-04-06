import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/modules/landing/header";
import StoreProvider from "@/store/StoreProvider";
import { ToastProvider } from "@/components/ToastProvider";

import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import { Suspense } from "react";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "CloudLead - Management Platform",
  description: "CloudLead - Lead platform",
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} antialiased`}>
      <body>
        <PrimeReactProvider value={{ unstyled: true }} >
          <StoreProvider>
            <ToastProvider >
              <Suspense fallback={<></>}>
              {children}
              </Suspense>
            </ToastProvider>
          </StoreProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
