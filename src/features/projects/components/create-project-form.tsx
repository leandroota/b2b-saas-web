"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProjectSchema, type CreateProjectInput } from "../lib/project-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppStore } from "@/store/use-app-store";

interface CreateProjectFormProps {
    onSuccess?: () => void;
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
    const { workspaceId } = useAppStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateProjectInput>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            name: "",
            description: "",
            methodology: "KANBAN",
            workspaceId: workspaceId ?? "default-workspace",
        },
    });

    const methodology = watch("methodology");

    const onSubmit = async (data: CreateProjectInput) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Projeto criado:", data);
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nome do Projeto</Label>
                    <Input
                        id="name"
                        placeholder="Ex: Redesign do Dashboard"
                        {...register("name")}
                        className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                    />
                    {errors.name && (
                        <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Descrição (Opcional)</Label>
                    <Textarea
                        id="description"
                        placeholder="Breve resumo dos objetivos..."
                        className="resize-none"
                        {...register("description")}
                    />
                    {errors.description && (
                        <p className="text-xs font-medium text-destructive">{errors.description.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="methodology">Metodologia</Label>
                    <Select
                        value={methodology}
                        onValueChange={(value: any) => setValue("methodology", value)}
                    >
                        <SelectTrigger id="methodology">
                            <SelectValue placeholder="Selecione a metodologia" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="KANBAN">Kanban (Colunas e Fluxo)</SelectItem>
                            <SelectItem value="AGILE">Ágil / Scrum (Sprints e Backlog)</SelectItem>
                            <SelectItem value="LIST">Lista Simples (Checklist)</SelectItem>
                            <SelectItem value="PLANNING">Planejamento Estratégico (Wiki First)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                    {isSubmitting ? "Criando..." : "Criar Projeto"}
                </Button>
            </div>
        </form>
    );
}
