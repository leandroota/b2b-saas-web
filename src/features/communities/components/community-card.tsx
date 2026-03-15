"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MessageSquare, Lock } from "lucide-react";
import { Community } from "../lib/community-schema";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CommunityCardProps {
    community: Community;
    isJoined: boolean;
    onJoin: (id: string) => void;
    onLeave: (id: string) => void;
}

export function CommunityCard({ community, isJoined, onJoin, onLeave }: CommunityCardProps) {
    return (
        <Link href={`/communities/${community.id}`} className="block group">
        <Card className={cn(
            "border-border bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer",
            isJoined && "border-primary/20 bg-primary/5"
        )}>
            <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "size-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner transition-transform group-hover:scale-105",
                            isJoined ? "bg-primary/10 border border-primary/20" : "bg-muted/50 border border-border"
                        )}>
                            {community.emoji}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors truncate">
                                    {community.name}
                                </h3>
                                {community.isPrivate && (
                                    <Lock className="size-3 text-muted-foreground shrink-0" />
                                )}
                            </div>
                            <Badge
                                variant="secondary"
                                className="text-[9px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 bg-muted/60 text-muted-foreground border-border/50"
                            >
                                {community.category}
                            </Badge>
                        </div>
                    </div>

                    {isJoined && (
                        <Badge className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-primary/10 text-primary border-primary/20 shrink-0">
                            Membro
                        </Badge>
                    )}
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {community.description}
                </p>

                {/* Tags */}
                {community.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {community.tags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted/40 text-muted-foreground border border-border/40"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-border/50">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                            <Users className="size-3" />
                            {community.memberCount} membros
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                            <MessageSquare className="size-3" />
                            {community.postCount} posts
                        </span>
                    </div>

                    {isJoined ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={e => { e.preventDefault(); onLeave(community.id); }}
                            className="h-7 px-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all"
                        >
                            Sair
                        </Button>
                    ) : (
                        <Button
                            size="sm"
                            onClick={e => { e.preventDefault(); onJoin(community.id); }}
                            className="h-7 px-3 text-[9px] font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white shadow-sm shadow-primary/20 active:scale-95 transition-all"
                        >
                            Participar
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
        </Link>
    );
}
