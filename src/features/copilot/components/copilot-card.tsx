"use client";

import { Sparkles } from "lucide-react";
import { useAppStore } from "@/store/use-app-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopilotCard() {
    const { toggleCopilot, isCopilotOpen } = useAppStore();

    return (
        <Button
            className={cn(
                "font-mono gap-2 w-full justify-start h-12 px-5 rounded-xl transition-all shadow-lg",
                isCopilotOpen
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-secondary/20"
                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
            )}
            onClick={toggleCopilot}
        >
            <Sparkles className={cn(
                "size-4",
                isCopilotOpen ? "text-secondary-foreground" : "text-primary-foreground"
            )} />
            <span className="uppercase tracking-widest text-[11px] font-black">
                {isCopilotOpen ? "IA Ativa no Contexto" : "Alpha intelligence"}
            </span>
        </Button>
    );
}
