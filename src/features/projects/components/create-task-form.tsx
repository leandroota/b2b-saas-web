"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTaskInput } from "../lib/create-task-schema";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useParams } from "next/navigation";
import { Button as ButtonPrimitive } from "@base-ui/react/button";

interface CreateTaskFormProps {
    onSuccess?: () => void;
    defaultStatus?: string;
}

export function CreateTaskForm({ onSuccess, defaultStatus }: CreateTaskFormProps) {
    const { workspaceId } = useAppStore();
    const params = useParams();
    const projectId = params.id as string;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CreateTaskInput>({
        resolver: zodResolver(createTaskSchema) as any,
        defaultValues: {
            title: "",
            description: "",
            status: (defaultStatus as any) || "TODO",
            priority: "MEDIUM",
            projectId: projectId || "default-project",
            workspaceId: workspaceId || "default-workspace",
            labels: [],
        } as any,
    });

    const status = watch("status");
    const priority = watch("priority");
    const dueDate = watch("dueDate");

    const onSubmit = async (data: any) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log("Tarefa criada:", data);
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Título</Label>
                    <Input
                        id="title"
                        placeholder="O que precisa ser feito?"
                        {...register("title")}
                        className={cn(
                            "bg-muted/30 border-border focus-visible:ring-primary h-9",
                            errors.title && "border-destructive focus-visible:ring-destructive"
                        )}
                    />
                    {errors.title && (
                        <p className="text-xs font-medium text-destructive">{errors.title.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Descrição (Opcional)</Label>
                    <Textarea
                        id="description"
                        placeholder="Adicione mais detalhes..."
                        className="resize-none min-h-[100px] bg-muted/30 border-border focus-visible:ring-primary text-sm"
                        {...register("description")}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Status</Label>
                        <Select
                            value={status}
                            onValueChange={(value: any) => setValue("status", value)}
                        >
                            <SelectTrigger id="status" className="bg-muted/30 border-border h-9">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BACKLOG">Backlog</SelectItem>
                                <SelectItem value="TODO">A Fazer</SelectItem>
                                <SelectItem value="IN_PROGRESS">Em Progresso</SelectItem>
                                <SelectItem value="REVIEW">Revisão</SelectItem>
                                <SelectItem value="DONE">Concluído</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority" className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Prioridade</Label>
                        <Select
                            value={priority}
                            onValueChange={(value: any) => setValue("priority", value)}
                        >
                            <SelectTrigger id="priority" className="bg-muted/30 border-border h-9">
                                <SelectValue placeholder="Prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="LOW">Baixa</SelectItem>
                                <SelectItem value="MEDIUM">Média</SelectItem>
                                <SelectItem value="HIGH">Alta</SelectItem>
                                <SelectItem value="URGENT">Urgente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Data de Entrega</Label>
                    <Popover>
                        <PopoverTrigger
                            className={cn(
                                "flex h-9 w-full items-center justify-start rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm font-normal text-left transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                                !dueDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dueDate ? format(dueDate, "PPP") : <span>Selecione uma data</span>}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={dueDate}
                                onSelect={(date) => setValue("dueDate", date || undefined)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-2">
                <Button type="submit" disabled={isSubmitting} className="w-full h-10 font-bold uppercase tracking-wider">
                    {isSubmitting ? "Salvando..." : "Criar Tarefa"}
                </Button>
            </div>
        </form>
    );
}
