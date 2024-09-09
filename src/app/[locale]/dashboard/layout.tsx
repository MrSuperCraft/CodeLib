'use client'


import { ThemeProvider } from "@/components/ThemeProvider";
import { SessionProvider, useSession } from "next-auth/react";
import Sidebar from "@/components/dashboard/Sidebar";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import useSizingStore from "../../store/SizingStore";
import { cn } from "@/lib/utils";
import { BeatLoader } from "react-spinners";
import { Toaster } from "sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { data: session, status } = useSession();
    const sidebarState = useSizingStore();
    const router = useRouter();

    if (status === "loading") {
        return (
            <div className="flex gap-4 flex-col items-center justify-center w-full max-h-screen z-[99999] bg-white">
                <span className="text-2xl font-black">Loading</span>
                <BeatLoader />
            </div>
        );
    }


    if (!session) {
        router.push("/get-started");
        return null;
    }


    return (
        <html lang="en" suppressHydrationWarning>
            <SessionProvider session={session}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >

                    <body>
                        <div className="min-h-screen flex overflow-auto">
                            <Sidebar session={session} />
                            <main className={cn(`flex-1 p-2 transition-all duration-300`, sidebarState.isCollapsed ? 'md:pl-32' : 'md:pl-72')}>
                                <DashboardHeader username={session?.user?.name || 'User'} email={session?.user?.email || 'user@example.com'} />
                                {children}
                            </main>
                        </div>
                        <Toaster />
                    </body>
                </ThemeProvider>
            </SessionProvider>
        </html>
    );
}
