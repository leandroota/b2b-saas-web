"use client";

import { useState, useRef } from "react";
import {
    Code,
    Send,
    Smile,
    ImageIcon,
    Video,
    X,
    Play,
    Globe,
    ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/use-app-store";
import { cn } from "@/lib/utils";

type MediaItem = { url: string; type: "image" | "video"; name: string };

export function Publisher() {
    const { currentUser, communities, joinedCommunityIds, addCommunityPost } = useAppStore();
    const [content, setContent] = useState("");
    const [targetCommunityId, setTargetCommunityId] = useState<string | null>(null);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const joinedCommunities = communities.filter(c => joinedCommunityIds.includes(c.id));
    const selectedCommunity = joinedCommunities.find(c => c.id === targetCommunityId) ?? null;

    const handleFiles = (files: FileList | null, type: "image" | "video") => {
        if (!files) return;
        const newItems: MediaItem[] = Array.from(files).slice(0, 4 - media.length).map(f => ({
            url: URL.createObjectURL(f),
            type,
            name: f.name,
        }));
        setMedia(prev => [...prev, ...newItems].slice(0, 4));
    };

    const removeMedia = (idx: number) => setMedia(prev => prev.filter((_, i) => i !== idx));

    const handlePublish = () => {
        if (!content.trim() && media.length === 0) return;

        if (targetCommunityId && selectedCommunity) {
            addCommunityPost({
                communityId: selectedCommunity.id,
                communityName: selectedCommunity.name,
                communityEmoji: selectedCommunity.emoji,
                userId: currentUser.id,
                userName: currentUser.name,
                userRole: currentUser.role,
                content: content.trim(),
                ...(media.length > 0 && {
                    mediaUrls: media.map(m => m.url),
                    mediaType: media[0].type,
                }),
            });
        }
        setContent("");
        setTargetCommunityId(null);
        setMedia([]);
    };

    return (
        <div className="py-6 px-6 bg-background/30 backdrop-blur-sm">
            <div className="flex gap-4">
                <Avatar className="size-10 rounded-full border-2 border-primary/20 shrink-0">
                    <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                    {/* Target Community Selector */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all outline-none",
                                selectedCommunity
                                    ? "border-primary/30 bg-primary/5 text-primary"
                                    : "border-border/40 bg-muted/20 text-muted-foreground hover:bg-muted/40"
                            )}>
                                {selectedCommunity ? (
                                    <>
                                        <span>{selectedCommunity.emoji}</span>
                                        {selectedCommunity.name}
                                    </>
                                ) : (
                                    <>
                                        <Globe className="size-3" />
                                        Workspace Geral
                                    </>
                                )}
                                <ChevronDown className="size-3 ml-1" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56 rounded-xl border-border/50 bg-card/90 backdrop-blur-xl shadow-2xl p-1">
                            <DropdownMenuItem
                                onClick={() => setTargetCommunityId(null)}
                                className={cn(
                                    "rounded-lg py-2 gap-2 cursor-pointer font-bold text-[9px] uppercase tracking-wider",
                                    !targetCommunityId && "bg-primary/10 text-primary"
                                )}
                            >
                                <Globe className="size-3" />
                                Workspace Geral
                            </DropdownMenuItem>
                            {joinedCommunities.length > 0 && (
                                <>
                                    <DropdownMenuSeparator className="bg-border/50 my-1" />
                                    <p className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                                        Seus Grupos
                                    </p>
                                    {joinedCommunities.map((comm) => (
                                        <DropdownMenuItem
                                            key={comm.id}
                                            onClick={() => setTargetCommunityId(comm.id)}
                                            className={cn(
                                                "rounded-lg py-2 gap-2 cursor-pointer font-bold text-[9px] uppercase tracking-wider",
                                                targetCommunityId === comm.id && "bg-primary/10 text-primary"
                                            )}
                                        >
                                            <span>{comm.emoji}</span>
                                            {comm.name}
                                        </DropdownMenuItem>
                                    ))}
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="relative group">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={
                                selectedCommunity
                                    ? `Compartilhe algo com ${selectedCommunity.name}...`
                                    : "Compartilhe uma atualização, imagem, vídeo ou conquista..."
                            }
                            className="min-h-[80px] bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-2xl resize-none p-4 text-sm font-medium leading-relaxed transition-all group-hover:bg-muted/50"
                        />
                        <div className="absolute bottom-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <Button size="icon-xs" variant="ghost" className="rounded-xl">
                                <Smile className="size-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>

                    {/* Media preview grid */}
                    {media.length > 0 && (
                        <div className={cn(
                            "grid gap-2 rounded-2xl overflow-hidden",
                            media.length === 1 && "grid-cols-1",
                            media.length === 2 && "grid-cols-2",
                            media.length >= 3 && "grid-cols-2",
                        )}>
                            {media.map((item, idx) => (
                                <div key={idx} className={cn(
                                    "relative group/thumb rounded-xl overflow-hidden bg-muted/40",
                                    media.length === 1 ? "aspect-video" : "aspect-square",
                                    media.length === 3 && idx === 0 && "col-span-2 aspect-video",
                                )}>
                                    {item.type === "image" ? (
                                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                                            <video src={item.url} className="w-full h-full object-cover opacity-70" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="size-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                    <Play className="size-5 text-white fill-white ml-0.5" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => removeMedia(idx)}
                                        className="absolute top-1.5 right-1.5 size-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-black/80"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Hidden file inputs */}
                    <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files, "image")} />
                    <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={e => handleFiles(e.target.files, "video")} />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="ghost" size="sm"
                                className="h-9 px-3 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5"
                                onClick={() => imageInputRef.current?.click()}
                                disabled={media.length >= 4}
                            >
                                <ImageIcon className="size-3.5" />
                                Foto
                            </Button>
                            <Button
                                variant="ghost" size="sm"
                                className="h-9 px-3 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5"
                                onClick={() => videoInputRef.current?.click()}
                                disabled={media.length >= 4}
                            >
                                <Video className="size-3.5" />
                                Vídeo
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5">
                                <Code className="size-3.5" />
                                Código
                            </Button>
                        </div>

                        <Button
                            onClick={handlePublish}
                            disabled={!content.trim() && media.length === 0}
                            className="h-10 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-black uppercase text-[11px] tracking-widest gap-2 active:scale-95 transition-all disabled:opacity-50"
                        >
                            Publicar
                            <Send className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
