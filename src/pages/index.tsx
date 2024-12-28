import MainLayout from "@/components/main-layout/main-layout";
import MainPage from "@/components/main-page/main-page";
import { SessionProvider } from "next-auth/react";

export default function Layout() {
    return (
        <SessionProvider>
            <MainLayout>
                <MainPage />
            </MainLayout>
        </SessionProvider>
    )
}