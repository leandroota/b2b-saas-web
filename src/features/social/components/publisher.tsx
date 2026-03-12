import {
    ImagePlus,
    Code,
    Send,
    Smile,
    Paperclip,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/use-app-store";

export function Publisher() {
    const { currentUser } = useAppStore();

    if (currentUser.role !== 'ADMIN') return null;

    return (
        <div className="py-6 border-b border-border bg-background/30 backdrop-blur-sm">
            <div className="flex gap-4">
                <Avatar className="size-10 rounded-2xl border-2 border-primary/20">
                    <AvatarImage src={`https://i.pravatar.cc/100?u=${currentUser.id}`} />
                    <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                    <div className="relative group">
                        <Textarea
                            placeholder="Compartilhe uma atualização, deploy ou conquista..."
                            className="min-h-[100px] bg-muted/30 border-border/50 focus-visible:ring-primary/20 rounded-2xl resize-none p-4 text-sm font-medium leading-relaxed transition-all group-hover:bg-muted/50"
                        />
                        <div className="absolute bottom-3 right-3 opacity-0 group-focus-within:opacity-100 transition-opacity">
                            <Button size="icon-xs" variant="ghost" className="rounded-xl">
                                <Smile className="size-4 text-muted-foreground" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5">
                                <Paperclip className="size-3.5" />
                                Anexar
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5">
                                <Code className="size-3.5" />
                                Código
                            </Button>
                            <Button variant="ghost" size="sm" className="h-9 px-3 rounded-xl gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-primary/5 group">
                                <Sparkles className="size-3.5 text-primary group-hover:animate-pulse" />
                                Propor Wiki
                            </Button>
                        </div>

                        <Button className="h-10 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 font-black uppercase text-[11px] tracking-widest gap-2 active:scale-95 transition-all">
                            Publicar
                            <Send className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
