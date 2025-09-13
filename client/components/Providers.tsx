"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

function AppWithProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <NextTopLoader
        color="#3b82f6"
        initialPosition={0.08}
        crawlSpeed={200}
        height={5}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
        template='<div class="bar" role="bar"><div class="peg"></div></div> 
        <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
        zIndex={1600}
        showAtBottom={false}
      />
      {children}
      <Toaster />
    </>
  );
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppWithProviders>{children}</AppWithProviders>
      </ThemeProvider>
    </Provider>
  );
}
