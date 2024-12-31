import { SessionProvider } from "next-auth/react";
import "../shared/globals.css";
import MainLayout from "@/components/main-layout/main-layout";
import { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <SessionProvider>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
          </SessionProvider>
  
  ;
}
