"use client";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { CreateTaskForm } from "./create-task-form";

interface CreateTaskSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultStatus?: string;
}

export function CreateTaskSheet({ open, onOpenChange, defaultStatus }: CreateTaskSheetProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="sm:max-w-md border-l border-border bg-card shadow-2xl">
                <SheetHeader className="mb-6">
                    <SheetTitle className="font-mono text-xl">Nova Tarefa</SheetTitle>
                    <SheetDescription>
                        Descreva o trabalho a ser feito e defina prioridades.
                    </SheetDescription>
                </SheetHeader>
                <CreateTaskForm
                    onSuccess={() => onOpenChange(false)}
                    defaultStatus={defaultStatus}
                />
            </SheetContent>
        </Sheet>
    );
}
