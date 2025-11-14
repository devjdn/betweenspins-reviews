"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "motion/react";

type SidebarContextProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider.");
    }
    return context;
}

function SidebarProvider({
    defaultOpen = false,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const isMobile = useIsMobile();
    const [_open, _setOpen] = React.useState(defaultOpen);

    const open = openProp ?? _open;
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === "function" ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
        },
        [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
        setOpen((open) => !open);
    }, [setOpen]);

    const contextValue = React.useMemo<SidebarContextProps>(
        () => ({
            open,
            setOpen,
            isMobile,
            toggleSidebar,
        }),
        [open, setOpen, isMobile, toggleSidebar]
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <div
                className={cn(
                    "flex w-full flex-1 overflow-y-hidden",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    );
}

function Sidebar({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) {
    const { isMobile, open, setOpen } = useSidebar();

    if (isMobile) {
        return (
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="p-0 w-64">
                    <SheetHeader className="sr-only">
                        <SheetTitle>Sidebar</SheetTitle>
                        <SheetDescription>Navigation menu</SheetDescription>
                    </SheetHeader>
                    {children}
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <AnimatePresence>
            {open && (
                <motion.aside
                    key="sidebar"
                    initial={{ width: 0 }}
                    animate={{ width: 368 }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={cn("overflow-hidden", className)}
                >
                    <motion.div
                        key="sidebar-content"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{
                            duration: 0.18,
                            ease: "easeOut",
                            delay: 0.05,
                        }}
                    >
                        {children}
                    </motion.div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}

function SidebarTrigger({
    className,
    onClick,
    children,
    ...props
}: React.ComponentProps<typeof Button>) {
    const { toggleSidebar } = useSidebar();

    return (
        <Button
            className={cn(className)}
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            {children}
        </Button>
    );
}

export { Sidebar, SidebarProvider, SidebarTrigger, useSidebar };
