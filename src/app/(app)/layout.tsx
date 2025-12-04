import Footer from "@/components/ui/footer";
import AppSidebar, {
    MobileHeader,
} from "@/components/ui/nav-sidebar/app-sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { SidebarProvider } from "@/components/ui/sidebar";
import ShaderBackground from "@/components/shaders/global-shader";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await currentUser();

    return (
        <SidebarProvider>
            <main className="flex flex-col md:grid md:grid-cols-[256px_1fr_auto] flex-1">
                <AppSidebar clerkUserId={user?.id} />
                <MobileHeader />

                <div className="overflow-y-scroll flex flex-col flex-1 space-y-12">
                    <ShaderBackground />
                    <div className="flex-1 flex px-4 py-8 md:px-8">
                        {children}
                    </div>
                    <Footer />
                </div>
            </main>
        </SidebarProvider>
    );
}
