"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Task, TaskStatus } from "../lib/task-schema";
import { CreateTaskSheet } from "./create-task-sheet";

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
    // Basic state to hold tasks, in a real app this would use a more robust state manager or optimistic UI
    const [boardTasks, setBoardTasks] = useState(tasks);

    // UI State for task creation
    const [createTaskOpen, setCreateTaskOpen] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("TODO");

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
                                            className="group cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-primary/20 transition-all shadow-sm border-border bg-card overflow-hidden"
                                        >
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="text-sm font-medium leading-tight text-foreground line-clamp-2 whitespace-normal">
                                                        {task.title}
                                                    </h4>
                                                    <Button variant="ghost" size="icon-xs" className="size-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="size-3 text-muted-foreground" />
                                                    </Button>
                                                </div>

                                                <div className="flex items-center justify-between gap-3 pt-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 uppercase tracking-wider font-mono ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
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
        </div>
    );
}
