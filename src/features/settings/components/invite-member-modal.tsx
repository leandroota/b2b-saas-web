"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Mail, Shield, UserPlus, Check } from "lucide-react";

interface InviteMemberModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function InviteMemberModal({ open, onOpenChange }: InviteMemberModalProps) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("MEMBER");
    const [isSending, setIsSending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInvite = () => {
        setIsSending(true);
        // Simulate API call
        setTimeout(() => {
            setIsSending(false);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                setEmail("");
                onOpenChange(false);
            }, 1500);
        }, 1200);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] bg-card border-border p-0 overflow-hidden">
                <DialogHeader className="p-8 border-b border-border/50 bg-card/50">
                    <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
                        <UserPlus className="size-6 text-primary" />
                    </div>
                    <DialogTitle className="text-xl font-mono uppercase tracking-widest">Convidar Novo Membro</DialogTitle>
                    <DialogDescription>
                        Envie um convite por e-mail para colaborar no workspace.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-8 space-y-6">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in zoom-in-95 duration-300">
                            <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Check className="size-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-bold">Convite Enviado!</h3>
                            <p className="text-sm text-muted-foreground text-center">Um e-mail de confirmação foi enviado para <br /><strong>{email}</strong>.</p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">E-mail do Colaborador</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                        <Input
                                            placeholder="exemplo@empresa.com"
                                            className="pl-10 bg-background/50 h-11"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cargo Inicial</Label>
                                    <Select value={role} onValueChange={(val) => val && setRole(val)}>
                                        <SelectTrigger className="bg-background/50 h-11">
                                            <SelectValue placeholder="Selecione um cargo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MEMBER">Membro (Colaborador)</SelectItem>
                                            <SelectItem value="ADMIN">Administrador (Gestor)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex gap-3 text-xs text-primary/80">
                                <Shield className="size-4 shrink-0" />
                                <p>Administradores têm acesso total às configurações e faturamento do workspace.</p>
                            </div>
                        </>
                    )}
                </div>

                {!isSuccess && (
                    <DialogFooter className="p-6 bg-muted/30 border-t border-border/50">
                        <Button variant="ghost" onClick={() => onOpenChange(false)} className="font-bold uppercase text-[10px] tracking-widest">Cancelar</Button>
                        <Button
                            disabled={!email || isSending}
                            onClick={handleInvite}
                            className="font-bold uppercase text-[10px] tracking-widest px-8"
                        >
                            {isSending ? "Enviando..." : "Enviar Convite"}
                        </Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
