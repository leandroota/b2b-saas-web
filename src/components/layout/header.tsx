"use client";

import { usePathname } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { useAppStore } from "@/store/use-app-store";

const routeMap: Record<string, string> = {
    projects: "Projetos",
    chat: "Chat",
    feed: "Feed",
    wiki: "Wiki",
    social: "Social",
    auth: "Autenticação",
    dashboard: "Dashboard",
};

export function Header() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    const { currentUser, toggleRole } = useAppStore();

    return (
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4 flex-1">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        {segments.length > 0 && <BreadcrumbSeparator />}
                        {segments.map((segment, index) => {
                            const isLast = index === segments.length - 1;
                            const href = `/${segments.slice(0, index + 1).join("/")}`;
                            const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

                            return (
                                <React.Fragment key={href}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{label}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="flex items-center gap-4">
                {/* Temporary Role Switcher for Testing */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleRole}
                    className="h-8 text-[10px] font-bold uppercase tracking-widest border-primary/20 hover:bg-primary/5 text-primary"
                >
                    Role: {currentUser.role}
                </Button>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <Search className="size-4" />
                        <span className="sr-only">Search</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                        <Bell className="size-4" />
                        <span className="absolute top-2 right-2 size-1.5 bg-primary rounded-full" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
