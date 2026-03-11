"use client";

import { useState } from "react";
import {
    Palette,
    Type,
    Chrome,
    Monitor,
    Save,
    Download,
    RefreshCcw,
    Layout
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BrandingSettings() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-mono font-bold uppercase tracking-tight">Identidade Visual (White-label)</h3>
                    <p className="text-sm text-muted-foreground font-medium">Personalize a interface do Flyprod para combinar com sua marca corporativa.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2 duration-500">
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-card/20 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                                <Palette className="size-4 text-primary" />
                                Cores do Sistema
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cor Primária (Highlights)</Label>
                                    <div className="flex gap-2">
                                        <div className="size-10 rounded-lg bg-primary border border-border shadow-inner" />
                                        <Input defaultValue="#7c3aed" className="font-mono bg-background/50 h-10" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Cor de Fundo (Padrão)</Label>
                                    <div className="flex gap-2">
                                        <div className="size-10 rounded-lg bg-background border border-border shadow-inner" />
                                        <Input defaultValue="#09090b" className="font-mono bg-background/50 h-10" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/20 border-border/50">
                        <CardHeader>
                            <CardTitle className="text-sm font-mono uppercase tracking-widest flex items-center gap-2">
                                <Type className="size-4 text-primary" />
                                Tipografia e Estilo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fonte Principal</Label>
                                    <Select defaultValue="inter">
                                        <SelectTrigger className="bg-background/50 h-10">
                                            <SelectValue placeholder="Selecione a fonte" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="inter">Inter (Default)</SelectItem>
                                            <SelectItem value="roboto">Roboto</SelectItem>
                                            <SelectItem value="mono">JetBrains Mono</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Arredondamento (Radius)</Label>
                                    <Select defaultValue="0.5rem">
                                        <SelectTrigger className="bg-background/50 h-10">
                                            <SelectValue placeholder="Selecione o raio" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="0">Quadrado (Sharp)</SelectItem>
                                            <SelectItem value="0.5rem">Padrão (0.5rem)</SelectItem>
                                            <SelectItem value="1rem">Arredondado (1.0rem)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-border/50 p-6 flex justify-end">
                            <Button onClick={handleSave} disabled={isSaving} className="font-bold uppercase tracking-widest text-[10px] px-8 h-10">
                                {isSaving ? "Aplicando..." : "Salvar Design"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="bg-card/20 border-border/50 border-dashed">
                        <CardContent className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Download className="size-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-base uppercase tracking-widest font-mono">Exportar Asset Bundle</CardTitle>
                                <CardDescription className="max-w-xs mx-auto">Gere um pacote com todos os logos, ícones e guias de estilo deste workspace.</CardDescription>
                            </div>
                            <Button variant="outline" className="font-bold font-mono text-[10px] uppercase tracking-[0.2em]">Gerar ZIP</Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <div className="sticky top-6">
                        <div className="p-1 bg-muted rounded-xl border border-border/50 mb-4 inline-flex">
                            <span className="px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-primary">Preview em Tempo Real</span>
                        </div>
                        <div className="rounded-2xl border border-border bg-background shadow-2xl overflow-hidden aspect-[4/5] relative">
                            <div className="h-4 bg-muted/50 border-b border-border flex items-center gap-1.5 px-3">
                                <div className="size-2 rounded-full bg-red-500/50" />
                                <div className="size-2 rounded-full bg-yellow-500/50" />
                                <div className="size-2 rounded-full bg-green-500/50" />
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center gap-2">
                                    <div className="size-6 rounded bg-primary" />
                                    <div className="h-3 w-20 bg-muted rounded" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-10 w-full bg-muted/30 rounded-lg border border-border/50" />
                                    <div className="h-20 w-full bg-primary/5 rounded-lg border border-primary/20" />
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <div className="h-8 w-24 bg-primary rounded border border-primary" />
                                </div>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 p-4 border-t border-border/30 bg-muted/5">
                                <p className="text-[8px] font-bold text-muted-foreground uppercase text-center tracking-[0.3em]">Flyprod White-Label Engine</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
