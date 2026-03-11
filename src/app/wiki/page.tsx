"use client";

import { WikiView } from "@/features/wiki/components/wiki-view";

export default function WikiPage() {
    return (
        <div className="h-full bg-background overflow-hidden">
            <WikiView />
        </div>
    );
}
