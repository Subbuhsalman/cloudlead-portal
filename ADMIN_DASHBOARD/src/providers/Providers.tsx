"use client";

import StoreProvider from "@/store/StoreProvider";
import { PrimeReactProvider } from "primereact/api";
import { LayoutProvider } from "./LayoutProvider";
import ToastProvider from "@/components/general/ToastProvider";

export function Providers({ children }:{children: React.ReactNode}) {
  return (
    <StoreProvider>
      <PrimeReactProvider>
           <LayoutProvider>
           <ToastProvider/>
            {children}
            </LayoutProvider>
      </PrimeReactProvider>
    </StoreProvider>

  );
}
