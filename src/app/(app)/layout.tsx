import Footer from "@/components/ui/footer";
import Sidebar from "@/components/ui/sidebar/sidebar";
import { currentUser } from "@clerk/nextjs/server";

export default async function AppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await currentUser();

    return (
        <main className="flex flex-col md:grid md:grid-cols-[256px_1fr] flex-1 md:pb-6 md:px-6 md:space-x-6 overflow-hidden relative">
            <Sidebar clerkUserId={user?.id} />
            <div className="overflow-y-scroll flex flex-col flex-1 space-y-12 md:rounded-xl">
                <div className="flex-1 flex">{children}</div>
                <Footer />
            </div>
        </main>
    );
}
