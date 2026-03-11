"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreateProjectForm } from "./create-project-form";

export function CreateProjectModal() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="font-mono gap-2" />}>
                <Plus className="size-4" />
                Novo Projeto
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-mono text-xl">Novo Projeto</DialogTitle>
                    <DialogDescription>
                        Configure seu novo ambiente de trabalho. Escolha o nome e a metodologia ideal para sua equipe.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <CreateProjectForm onSuccess={() => setOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>
    );
}
