import Footer from "@/components/ui/footer";
import AppSidebar, { MobileHeader } from "@/components/ui/sidebar/app-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await currentUser();

    return (
        <SidebarProvider>
            <main className="flex flex-col md:grid md:grid-cols-[256px_1fr_auto] flex-1 bg-background/40 backdrop-blur-md">
                <AppSidebar clerkUserId={user?.id} />
                <MobileHeader />

                <div className="overflow-y-scroll flex flex-col flex-1 space-y-12 relative">
                    {children}
                    <Footer />
                </div>
            </main>
        </SidebarProvider>
    );
}
