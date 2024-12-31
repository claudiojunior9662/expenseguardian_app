import MainPage from "@/components/main-page/main-page";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Layout() {
    const session = useSession();

    useEffect(() => {
        if(session.status === "loading") return;

        if(session.data)
            localStorage.setItem("apiAuthToken", session.data.authorizationToken!);
    }, []);

    return (
        <MainPage />
    )
}