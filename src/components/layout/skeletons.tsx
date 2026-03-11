"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function KanbanSkeleton() {
    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex gap-6 p-8 h-full">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-[300px] flex flex-col gap-6">
                        <div className="flex items-center justify-between px-2 shrink-0">
                            <Skeleton className="h-4 w-24 bg-muted/50" />
                            <Skeleton className="size-8 rounded-md bg-muted/50" />
                        </div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="p-4 rounded-xl border border-border/50 space-y-3 bg-muted/10">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-3 w-2/3" />
                                    <div className="flex justify-between pt-2">
                                        <Skeleton className="h-4 w-12 rounded-full" />
                                        <Skeleton className="size-6 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="p-8 space-y-8 animate-pulse">
            <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
                <Skeleton className="h-[400px] rounded-xl" />
            </div>
        </div>
    );
}
