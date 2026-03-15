"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, GripVertical, Paperclip, MessageCircle, Clock, PlayCircle, MessageSquare, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Task, TaskStatus } from "../lib/task-schema";
import { CreateTaskSheet } from "./create-task-sheet";
import { useAppStore } from "@/store/use-app-store";
import { useEffect } from "react";
import { KanbanSkeleton } from "@/components/layout/skeletons";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const COLUMNS: { id: TaskStatus; label: string }[] = [
    { id: "BACKLOG", label: "Backlog" },
    { id: "TODO", label: "A Fazer" },
    { id: "IN_PROGRESS", label: "Em Progresso" },
    { id: "REVIEW", label: "Revisão" },
    { id: "DONE", label: "Concluído" },
];

interface KanbanBoardProps {
    tasks: Task[];
}

export function KanbanBoard({ tasks }: KanbanBoardProps) {
    const [isLoading, setIsLoading] = useState(true);
    // Basic state to hold tasks, in a real app this would use a more robust state manager or optimistic UI
    const [boardTasks, setBoardTasks] = useState(tasks);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedId, setEditedId] = useState("");
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedPriority, setEditedPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
    const [editedSubtitle, setEditedSubtitle] = useState("");
    const [commentInput, setCommentInput] = useState("");
    const [comments, setComments] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // UI State for task creation
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("TODO");
    const { setProjectContext, openMessaging } = useAppStore();

    // Broadcast project context for AI
    useEffect(() => {
        setProjectContext({
            id: "active-proj", // Simplificação por enquanto
            name: "Projeto Atual",
            taskCount: boardTasks.length,
            inProgressCount: boardTasks.filter(t => t.status === "IN_PROGRESS").length,
            blockedCount: boardTasks.filter(t => t.priority === "URGENT").length, // Usando URGENt como proxy de bloqueio
        });
    }, [boardTasks, setProjectContext]);

    if (isLoading) return <KanbanSkeleton />;

    const handleCreateTask = (status: TaskStatus) => {
        setDefaultStatus(status);
        setCreateTaskOpen(true);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT": return "bg-destructive/10 text-destructive border-destructive/20";
            case "HIGH": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "MEDIUM": return "bg-primary/10 text-primary border-primary/20";
            default: return "bg-muted text-muted-foreground border-muted-foreground/20";
        }
    };
    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case "URGENT": return "Urgente";
            case "HIGH": return "Alta";
            case "MEDIUM": return "Média";
            case "LOW": return "Baixa";
            default: return priority;
        }
    };

    const handleOpenDetails = (task: Task) => {
        setSelectedTask(task);
        setIsEditing(false);
        setEditedId(task.id);
        setEditedTitle(task.title);
        setEditedDescription(task.description || "");
        setEditedPriority(task.priority as any);
        setEditedSubtitle(task.labels[0] || "");
        setDetailsOpen(true);
    };

    const handleStartTask = (taskId: string) => {
        setBoardTasks(prev =>
            prev.map(t =>
                t.id === taskId
                    ? { ...t, status: "IN_PROGRESS" as TaskStatus, updatedAt: new Date().toISOString() }
                    : t
            )
        );
        setSelectedTask(prev => (prev && prev.id === taskId ? { ...prev, status: "IN_PROGRESS" as TaskStatus } : prev));
    };

    const handleFinishTask = (taskId: string) => {
        setBoardTasks(prev =>
            prev.map(t =>
                t.id === taskId
                    ? { ...t, status: "DONE" as TaskStatus, updatedAt: new Date().toISOString() }
                    : t
            )
        );
        setSelectedTask(prev => (prev && prev.id === taskId ? { ...prev, status: "DONE" as TaskStatus } : prev));
    };

    const handleSaveEdits = () => {
        if (!selectedTask) return;
        const oldId = selectedTask.id;
        const updated = {
            ...selectedTask,
            id: editedId || selectedTask.id,
            title: editedTitle || selectedTask.title,
            description: editedDescription,
            priority: editedPriority,
            labels: editedSubtitle ? [editedSubtitle, ...selectedTask.labels.slice(1)] : selectedTask.labels,
            updatedAt: new Date().toISOString(),
        };
        setBoardTasks(prev => prev.map(t => (t.id === selectedTask.id ? updated : t)));
        setSelectedTask(updated);
        // Move comentários para o novo ID, se ele mudou
        if (oldId !== updated.id) {
            setComments(prev => {
                const current = prev[oldId] || [];
                const { [oldId]: _removed, ...rest } = prev;
                return { ...rest, [updated.id]: current };
            });
        }
        setIsEditing(false);
    };

    const handleAddComment = () => {
        if (!selectedTask || !commentInput.trim()) return;
        setComments(prev => ({
            ...prev,
            [selectedTask.id]: [...(prev[selectedTask.id] || []), commentInput.trim()],
        }));
        setCommentInput("");
    };

    const handleOpenChat = () => {
        if (!selectedTask) return;
        openMessaging();
        // Em uma futura integração, poderíamos abrir uma conversa específica já com esse card vinculado.
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <ScrollArea className="w-full h-full whitespace-nowrap bg-background/50">
                <div className="flex gap-6 p-8 h-full min-h-[calc(100vh-14rem)]">
                    {COLUMNS.map((column) => (
                        <div key={column.id} className="w-[300px] flex flex-col gap-4">
                            <div className="flex items-center justify-between px-2 shrink-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-mono font-bold tracking-tight uppercase text-foreground/70">
                                        {column.label}
                                    </h3>
                                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-muted/50 text-muted-foreground shrink-0 rounded-full h-4 min-w-4 flex items-center justify-center">
                                        {boardTasks.filter(t => t.status === column.id).length}
                                    </Badge>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="size-8 text-muted-foreground hover:text-foreground"
                                    onClick={() => handleCreateTask(column.id)}
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>

                            <div className="flex-1 flex flex-col gap-3 min-h-[100px]">
                                {boardTasks
                                    .filter((task) => task.status === column.id)
                                    .map((task) => (
                                        <Card
                                            key={task.id}
                                            className="group cursor-pointer hover:ring-1 hover:ring-primary/20 transition-all shadow-sm border-border bg-card overflow-hidden"
                                            onClick={() => handleOpenDetails(task)}
                                        >
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="space-y-1">
                                                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground/70">
                                                            {task.id}
                                                        </span>
                                                        <h4 className="text-sm font-medium leading-tight text-foreground line-clamp-2 whitespace-normal">
                                                            {task.title}
                                                        </h4>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-xs"
                                                        className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenDetails(task);
                                                        }}
                                                    >
                                                        <MoreHorizontal className="size-3 text-muted-foreground" />
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between gap-3 pt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 uppercase tracking-wider font-mono ${getPriorityColor(task.priority)}`}>
                                                            {getPriorityLabel(task.priority)}
                                                        </Badge>
                                                        {task.labels.length > 0 && (
                                                            <span className="text-[10px] text-muted-foreground font-mono italic">
                                                                #{task.labels[0]}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <Avatar className="size-6 border border-background shadow-sm">
                                                        <AvatarImage src={`https://avatar.vercel.sh/${task.assigneeId || 'guest'}`} />
                                                        <AvatarFallback className="text-[8px]">U</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-muted-foreground hover:text-foreground text-xs gap-2 h-9 border-dashed border border-transparent hover:border-border mt-1"
                                    onClick={() => handleCreateTask(column.id)}
                                >
                                    <Plus className="size-3" />
                                    Adicionar Tarefa
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>

            <CreateTaskSheet
                open={createTaskOpen}
                onOpenChange={setCreateTaskOpen}
                defaultStatus={defaultStatus}
            />

            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-[720px] bg-card border-border p-0 overflow-hidden">
                    {selectedTask && (
                        <>
                            <DialogHeader className="px-8 pt-6 pb-4 border-b border-border/50 bg-card/60">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <DialogTitle className="flex items-center gap-2 text-base">
                                            {isEditing ? (
                                                <input
                                                    className="w-20 px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono font-black uppercase tracking-[0.2em] text-muted-foreground border border-border focus:outline-none focus:border-primary"
                                                    value={editedId}
                                                    onChange={(e) => setEditedId(e.target.value)}
                                                />
                                            ) : (
                                                <span
                                                    className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono font-black uppercase tracking-[0.2em] text-muted-foreground cursor-text"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    {selectedTask.id}
                                                </span>
                                            )}
                                            {isEditing ? (
                                                <input
                                                    className="bg-transparent border-b border-border text-sm font-semibold leading-tight focus:outline-none focus:border-primary px-1 flex-1"
                                                    value={editedTitle}
                                                    onChange={(e) => setEditedTitle(e.target.value)}
                                                />
                                            ) : (
                                                <span
                                                    className="text-sm font-semibold leading-tight cursor-text"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    {selectedTask.title}
                                                </span>
                                            )}
                                        </DialogTitle>
                                        <DialogDescription className="flex flex-col gap-1 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
                                            {isEditing ? (
                                                <input
                                                    className="bg-transparent border-b border-border text-[10px] font-mono tracking-widest focus:outline-none focus:border-primary px-1"
                                                    placeholder="Subtítulo / etiqueta principal"
                                                    value={editedSubtitle}
                                                    onChange={(e) => setEditedSubtitle(e.target.value)}
                                                />
                                            ) : (
                                                <span
                                                    className="cursor-text"
                                                    onClick={() => setIsEditing(true)}
                                                >
                                                    {editedSubtitle || "Detalhes da tarefa e contexto do projeto."}
                                                </span>
                                            )}
                                        </DialogDescription>
                                    </div>
                                    <Select
                                        value={editedPriority}
                                        onValueChange={(val) => setEditedPriority(val as any)}
                                    >
                                        <SelectTrigger className="h-8 w-36 bg-background/60 border-border px-0">
                                            <div className={`flex items-center gap-1.5 w-full justify-between px-2 text-[10px] font-mono uppercase tracking-widest ${getPriorityColor(editedPriority)}`}>
                                                <span>{getPriorityLabel(editedPriority)}</span>
                                                <ChevronDown className="size-3" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">Baixa</SelectItem>
                                            <SelectItem value="MEDIUM">Média</SelectItem>
                                            <SelectItem value="HIGH">Alta</SelectItem>
                                            <SelectItem value="URGENT">Urgente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 p-8 pt-6 h-full flex flex-col">
                                <div className="space-y-3">
                                    <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground">
                                        Descrição
                                    </h3>
                                    {isEditing ? (
                                        <textarea
                                            className="w-full min-h-[200px] text-sm leading-relaxed text-foreground bg-background/40 border border-border rounded-xl px-3 py-2 resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                            value={editedDescription}
                                            onChange={(e) => setEditedDescription(e.target.value)}
                                        />
                                    ) : (
                                        <div
                                            className="h-[200px] overflow-y-auto border-l-2 border-border/60 pl-3 py-1 cursor-text"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                                                {selectedTask.description && selectedTask.description.trim().length > 0
                                                    ? selectedTask.description
                                                    : "Esta tarefa ainda não possui uma descrição detalhada. Use o campo de descrição para orientar o time sobre o contexto, critérios de aceite e riscos principais."}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-3">
                                        <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                                            <Paperclip className="size-3" />
                                            Arquivos anexos
                                        </h3>
                                        <div className="rounded-xl border border-dashed border-border/60 bg-background/40 p-3 text-[11px] text-muted-foreground flex items-center justify-between">
                                            <span>Nenhum arquivo anexado (mock).</span>
                                            <Button variant="outline" size="xs" className="h-7 px-2 text-[10px] uppercase tracking-[0.18em]">
                                                Adicionar
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground flex items-center gap-2">
                                                <MessageCircle className="size-3" />
                                                Comentários
                                            </h3>
                                            <Button
                                                variant="ghost"
                                                size="icon-xs"
                                                className="size-7 text-muted-foreground hover:text-primary"
                                                onClick={handleOpenChat}
                                            >
                                                <MessageSquare className="size-3" />
                                            </Button>
                                        </div>
                                        <div className="rounded-xl border border-border/60 bg-background/40 p-3 text-[11px] text-muted-foreground space-y-3 h-[200px] overflow-y-auto">
                                            {(comments[selectedTask.id] || []).length === 0 ? (
                                                <p className="italic text-muted-foreground/80">
                                                    Nenhum comentário ainda. Comece a discussão abaixo.
                                                </p>
                                            ) : (
                                                (comments[selectedTask.id] || []).map((c, idx) => (
                                                    <p key={idx} className="leading-relaxed">
                                                        {c}
                                                    </p>
                                                ))
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 pt-1">
                                            <input
                                                className="flex-1 h-8 rounded-lg border border-border bg-background/60 px-3 text-[11px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                                placeholder="Comente esta história..."
                                                value={commentInput}
                                                onChange={(e) => setCommentInput(e.target.value)}
                                            />
                                            <Button
                                                variant="default"
                                                size="xs"
                                                className="h-8 px-3 text-[10px] font-mono uppercase tracking-[0.2em]"
                                                onClick={handleAddComment}
                                            >
                                                Enviar
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                        <Clock className="size-3.5" />
                                        <div className="flex flex-col gap-1">
                                            <span className="font-mono uppercase tracking-[0.18em]">
                                                Criada em {new Date(selectedTask.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
                                                Última atualização {new Date(selectedTask.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {isEditing && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]"
                                                onClick={handleSaveEdits}
                                            >
                                                Salvar
                                            </Button>
                                        )}
                                        <Button
                                            variant={selectedTask.status === "IN_PROGRESS" ? "secondary" : "default"}
                                            size="sm"
                                            className="gap-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]"
                                            onClick={() => handleStartTask(selectedTask.id)}
                                        >
                                            <PlayCircle className="size-4" />
                                            {selectedTask.status === "IN_PROGRESS" ? "Em progresso" : "Iniciar"}
                                        </Button>
                                        <Button
                                            variant={selectedTask.status === "DONE" ? "secondary" : "outline"}
                                            size="sm"
                                            className="gap-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em]"
                                            onClick={() => handleFinishTask(selectedTask.id)}
                                        >
                                            Concluir
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
