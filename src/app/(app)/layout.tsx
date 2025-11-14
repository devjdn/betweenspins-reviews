import Footer from "@/components/ui/footer";
import Sidebar from "@/components/ui/nav-sidebar/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import ReviewSidebar from "@/components/ui/review/review-sidebar";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await currentUser();

    return (
        <SidebarProvider>
            <main className="flex flex-col md:grid md:grid-cols-[256px_1fr_auto] flex-1 md:pb-4 md:px-4 md:space-x-4 overflow-y-auto relative">
                <Sidebar clerkUserId={user?.id} />
                <div className="overflow-y-scroll flex flex-col flex-1 space-y-12 md:rounded-xl">
                    <div className="flex-1 flex">{children}</div>
                    <Footer />
                </div>
                <ReviewSidebar />
            </main>
        </SidebarProvider>
    );
}
