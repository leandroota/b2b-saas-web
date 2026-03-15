"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCommunitySchema, CreateCommunity, COMMUNITY_CATEGORIES } from "../lib/community-schema";
import { useAppStore } from "@/store/use-app-store";
import { Sparkles } from "lucide-react";

const EMOJI_OPTIONS = ["🧠", "🎲", "📚", "💪", "🎵", "⚡", "🚀", "🎨", "🌱", "☕", "🎯", "🔬", "🎭", "🏆", "💡", "🌍"];

interface CreateCommunityModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateCommunityModal({ open, onOpenChange }: CreateCommunityModalProps) {
    const { createCommunity, currentUser } = useAppStore();
    const [selectedEmoji, setSelectedEmoji] = useState("🧠");

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(createCommunitySchema),
        defaultValues: { emoji: "🧠", isPrivate: false, tags: [] as string[], name: "", description: "", category: "" },
    });

    const onSubmit = (data: Record<string, unknown>) => {
        createCommunity({
            name: data.name as string,
            description: data.description as string,
            category: data.category as string,
            tags: (data.tags as string[]) ?? [],
            emoji: selectedEmoji,
            createdBy: currentUser.id,
            isPrivate: (data.isPrivate as boolean) ?? false,
        });
        reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg rounded-2xl border-border bg-card p-0 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-5 border-b border-border bg-card/80">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Sparkles className="size-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-tight">Novo Grupo</h2>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Crie um espaço de interesse compartilhado</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
                    {/* Emoji Picker */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ícone</Label>
                        <div className="flex flex-wrap gap-2">
                            {EMOJI_OPTIONS.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => { setSelectedEmoji(emoji); setValue("emoji", emoji); }}
                                    className={`size-10 rounded-xl text-xl flex items-center justify-center transition-all border ${
                                        selectedEmoji === emoji
                                            ? "bg-primary/10 border-primary/40 scale-110 shadow-md"
                                            : "bg-muted/30 border-border hover:bg-muted/60"
                                    }`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nome do Grupo</Label>
                        <Input
                            {...register("name")}
                            placeholder="ex: Psicologia & UX, RPG Lovers..."
                            className="rounded-xl bg-muted/30 border-border/50 font-medium text-sm"
                        />
                        {errors.name && <p className="text-[10px] text-destructive font-bold">{errors.name.message}</p>}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Categoria</Label>
                        <Select onValueChange={(v: string | null) => { if (v) setValue("category", v); }}>
                            <SelectTrigger className="rounded-xl bg-muted/30 border-border/50 font-medium text-sm">
                                <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border bg-card">
                                {COMMUNITY_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="font-medium text-sm rounded-lg">
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && <p className="text-[10px] text-destructive font-bold">{errors.category.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Descrição</Label>
                        <Textarea
                            {...register("description")}
                            placeholder="Descreva o propósito deste grupo..."
                            className="rounded-xl bg-muted/30 border-border/50 font-medium text-sm resize-none min-h-[80px]"
                        />
                        {errors.description && <p className="text-[10px] text-destructive font-bold">{errors.description.message}</p>}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="h-10 px-5 rounded-xl font-black uppercase text-[10px] tracking-widest"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
                        >
                            Criar Grupo
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
