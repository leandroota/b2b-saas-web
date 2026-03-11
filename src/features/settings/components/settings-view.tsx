"use client";

import { useState } from "react";
import {
    User,
    Building2,
    Users,
    Bell,
    Shield,
    Check,
    Mail,
    Plus,
    MoreHorizontal,
    Upload,
    ExternalLink,
    Zap,
    Workflow,
    Palette
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAppStore } from "@/store/use-app-store";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { InviteMemberModal } from "./invite-member-modal";
import { IntegrationsGallery } from "./integrations-gallery";
import { AutomationRules } from "./automation-rules";
import { BrandingSettings } from "./branding-settings";

export function SettingsView() {
    const { currentUser } = useAppStore();
    const [isSaving, setIsSaving] = useState(false);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    return (
        <div className="flex flex-col h-full bg-background/50">
            <div className="p-8 border-b border-border bg-card/30">
                <div className="max-w-5xl mx-auto space-y-1">
                    <h1 className="text-3xl font-mono font-bold tracking-tight uppercase">Configurações</h1>
                    <p className="text-muted-foreground text-sm">Gerencie seu perfil, workspace e preferências da equipe.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    <Tabs defaultValue="profile" className="space-y-8">
                        <TabsList className="bg-card/50 border border-border p-1 h-12">
                            <TabsTrigger value="profile" className="gap-2 h-10 px-6 data-[state=active]:bg-background data-[state=active]:text-primary">
                                <User className="size-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Perfil</span>
                            </TabsTrigger>
                            <TabsTrigger value="workspace" className="gap-2 h-10 px-6 data-[state=active]:bg-background data-[state=active]:text-primary">
                                <Building2 className="size-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Workspace</span>
                            </TabsTrigger>
                            <TabsTrigger value="team" className="gap-2 h-10 px-6 data-[state=active]:bg-background data-[state=active]:text-primary">
                                <Users className="size-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Equipe</span>
                            </TabsTrigger>
                            <TabsTrigger value="integrations" className="gap-2 h-10 px-6 data-[state=active]:bg-background data-[state=active]:text-primary">
                                <Zap className="size-4" />
                                <span className="text-xs font-bold uppercase tracking-wider">Integrações</span>
                            </TabsTrigger>
                            <PermissionGuard role="ADMIN">
                                <TabsTrigger value="automation" className="gap-2 h-10 px-6 data-[state=active]:bg-background data-[state=active]:text-primary">
                                    <Workflow className="size-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Automação</span>
                                </TabsTrigger>
                                <TabsTrigger value="branding" className="gap-2 h-10 px-6 data-[state=active]:bg-background data-[state=active]:text-primary">
                                    <Palette className="size-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Personalização</span>
                                </TabsTrigger>
                            </PermissionGuard>
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                            <Card className="bg-card/30 border-border overflow-hidden">
                                <CardHeader className="border-b border-border/50 bg-card/30">
                                    <CardTitle className="text-lg font-mono uppercase tracking-widest">Informações Pessoais</CardTitle>
                                    <CardDescription>Atualize seus dados básicos e como outros te veem.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    <div className="flex items-center gap-8">
                                        <div className="relative group">
                                            <Avatar className="size-24 rounded-2xl border-2 border-primary/20">
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>JS</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl cursor-pointer">
                                                <Upload className="size-6 text-primary" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg">{currentUser.name}</h3>
                                            <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                                            <Badge variant="outline" className="mt-2 border-primary/20 text-primary font-mono text-[10px] uppercase">
                                                {currentUser.role}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                                            <Input defaultValue={currentUser.name} className="bg-background/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">E-mail</Label>
                                            <Input defaultValue={currentUser.email} disabled className="bg-muted/50" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t border-border/50 p-6 bg-card/30 justify-end">
                                    <Button onClick={handleSave} disabled={isSaving} className="font-bold uppercase tracking-widest text-xs h-10 px-8">
                                        {isSaving ? "Salvando..." : "Salvar Alterações"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* Workspace Tab */}
                        <TabsContent value="workspace" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                            <PermissionGuard role="ADMIN" fallback={
                                <Card className="border-destructive/20 bg-destructive/5">
                                    <CardHeader>
                                        <CardTitle className="text-destructive flex items-center gap-2">
                                            <Shield className="size-5" />
                                            Acesso Restrito
                                        </CardTitle>
                                        <CardDescription className="text-destructive/70">
                                            Apenas administradores podem gerenciar as configurações do workspace.
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            }>
                                <Card className="bg-card/30 border-border overflow-hidden">
                                    <CardHeader className="border-b border-border/50 bg-card/30">
                                        <CardTitle className="text-lg font-mono uppercase tracking-widest">Identidade do Workspace</CardTitle>
                                        <CardDescription>Customize como sua organização é identificada.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome da Organização</Label>
                                                    <Input defaultValue="Flyprod Acme" className="bg-background/50 h-11" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workspace Slug</Label>
                                                    <div className="flex">
                                                        <span className="h-11 flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted/30 text-muted-foreground text-xs">
                                                            flyprod.io/
                                                        </span>
                                                        <Input defaultValue="acme-corp" className="rounded-l-none bg-background/50 h-11" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-4 bg-muted/5">
                                                <div className="size-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                                    <Building2 className="size-8 text-primary" />
                                                </div>
                                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">Alterar Logo</Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="border-t border-border/50 p-6 bg-card/30 justify-end">
                                        <Button onClick={handleSave} disabled={isSaving} className="font-bold uppercase tracking-widest text-xs h-10 px-8">
                                            Salvar Configurações
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </PermissionGuard>
                        </TabsContent>

                        {/* Team Tab */}
                        <TabsContent value="team" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-mono font-bold uppercase tracking-tight">Membros da Equipe</h3>
                                    <p className="text-sm text-muted-foreground">Gerencie quem tem acesso a este workspace.</p>
                                </div>
                                <PermissionGuard role="ADMIN">
                                    <Button
                                        className="gap-2 h-10 font-bold uppercase tracking-widest text-xs px-6"
                                        onClick={() => setIsInviteModalOpen(true)}
                                    >
                                        <Plus className="size-4" />
                                        Convidar Membro
                                    </Button>
                                </PermissionGuard>
                            </div>

                            <InviteMemberModal
                                open={isInviteModalOpen}
                                onOpenChange={setIsInviteModalOpen}
                            />

                            <Card className="bg-card/30 border-border overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-muted/30">
                                        <TableRow className="border-border/50 hover:bg-transparent">
                                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground py-4">Membro</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cargo</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</TableHead>
                                            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="border-border/50 hover:bg-primary/5 transition-colors">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8 rounded-lg border border-border">
                                                        <AvatarImage src="https://github.com/shadcn.png" />
                                                        <AvatarFallback>JS</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold">{currentUser.name} (Você)</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">{currentUser.email}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-muted/50 text-[10px] font-bold uppercase tracking-widest">
                                                    {currentUser.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                                                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                    Ativo
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon-xs" className="size-8">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="border-border/50 hover:bg-primary/5 transition-colors">
                                            <TableCell className="py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="size-8 rounded-lg border border-border">
                                                        <AvatarFallback className="bg-orange-500/10 text-orange-500">MK</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold">Marcus K.</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono">marcus@acme.com</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-border text-[10px] font-bold uppercase tracking-widest">
                                                    ADMIN
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[10px] uppercase tracking-widest">
                                                    <div className="size-1.5 rounded-full bg-emerald-500" />
                                                    Ativo
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon-xs" className="size-8">
                                                    <MoreHorizontal className="size-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Card>
                        </TabsContent>

                        {/* Integrations Tab */}
                        <TabsContent value="integrations" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                            <div className="space-y-1">
                                <h3 className="text-xl font-mono font-bold uppercase tracking-tight">Conectores de Ecossistema</h3>
                                <p className="text-sm text-muted-foreground">Potencialize seu fluxo de trabalho conectando ferramentas externas.</p>
                            </div>
                            <IntegrationsGallery />
                        </TabsContent>

                        {/* Automation Tab */}
                        <TabsContent value="automation" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                            <AutomationRules />
                        </TabsContent>

                        {/* Branding Tab */}
                        <TabsContent value="branding" className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
                            <BrandingSettings />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
