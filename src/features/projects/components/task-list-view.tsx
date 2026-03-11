"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Task } from "../lib/task-schema";
import { MoreHorizontal, Calendar, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTaskSheet } from "./create-task-sheet";
import { useState } from "react";

interface TaskListViewProps {
    tasks: Task[];
}

export function TaskListView({ tasks }: TaskListViewProps) {
    const [createTaskOpen, setCreateTaskOpen] = useState(false);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT": return "bg-destructive/10 text-destructive border-destructive/20";
            case "HIGH": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
            case "MEDIUM": return "bg-primary/10 text-primary border-primary/20";
            default: return "bg-muted text-muted-foreground border-muted-foreground/20";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DONE": return "text-green-500";
            case "REVIEW": return "text-blue-500";
            case "IN_PROGRESS": return "text-primary";
            default: return "text-muted-foreground";
        }
    };

    return (
        <div className="p-8 h-full overflow-auto bg-background">
            <div className="rounded-lg border border-border bg-card">
                <Table>
                    <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border">
                            <TableHead className="w-[40px] px-4">
                                <Checkbox className="rounded-[4px]" />
                            </TableHead>
                            <TableHead className="font-mono text-xs uppercase tracking-wider">Tarefa</TableHead>
                            <TableHead className="font-mono text-xs uppercase tracking-wider text-center">Status</TableHead>
                            <TableHead className="font-mono text-xs uppercase tracking-wider text-center">Prioridade</TableHead>
                            <TableHead className="font-mono text-xs uppercase tracking-wider text-center">Data</TableHead>
                            <TableHead className="font-mono text-xs uppercase tracking-wider text-right">Responsável</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id} className="group hover:bg-muted/20 border-border transition-colors">
                                <TableCell className="px-4">
                                    <Checkbox className="rounded-[4px]" checked={task.status === "DONE"} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className={`text-sm font-medium leading-none ${task.status === "DONE" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                            {task.title}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            {task.labels.map(label => (
                                                <span key={label} className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded leading-none italic">
                                                    #{label}
                                                </span>
                                            ))}
                                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                <MessageSquare className="size-3" />
                                                <span>2</span>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className={`text-[10px] font-bold font-mono tracking-tight uppercase ${getStatusColor(task.status)}`}>
                                        {task.status.replace("_", " ")}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 uppercase tracking-widest font-mono border-0 h-5 ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-mono">
                                        <Calendar className="size-3" />
                                        <span>12 Out</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end">
                                        <Avatar className="size-7 border border-background shadow-sm ring-1 ring-border/50">
                                            <AvatarImage src={`https://avatar.vercel.sh/${task.assigneeId || 'guest'}`} />
                                            <AvatarFallback className="text-[9px]">U</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-4">
                                    <Button variant="ghost" size="icon-xs" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <MoreHorizontal className="size-4 text-muted-foreground" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 flex justify-end">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-mono text-muted-foreground hover:text-foreground gap-2"
                    onClick={() => setCreateTaskOpen(true)}
                >
                    <Plus className="size-3" />
                    Adicionar nova tarefa
                </Button>
            </div>

            <CreateTaskSheet
                open={createTaskOpen}
                onOpenChange={setCreateTaskOpen}
            />
        </div>
    );
}
