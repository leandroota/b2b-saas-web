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

export function Header() {
    return (
        <header className="h-14 border-b border-border bg-background flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4 flex-1">
                {/* Dynamic Context Breadcrumbs can be injected here based on route */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

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
        </header>
    );
}
