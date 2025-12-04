import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    if (
        (await auth()).sessionClaims?.metadata.onboardingStatus === "completed"
    ) {
        redirect("/");
    }

    return <Suspense>{children}</Suspense>;
}
