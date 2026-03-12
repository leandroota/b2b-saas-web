"use client";

import { FileIcon, FileText, Upload, Plus, MoreVertical, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const MOCK_FILES = [
    { id: "1", name: "PRD_Sistema_V1.pdf", size: "2.4 MB", type: "PDF", date: "2024-03-10" },
    { id: "2", name: "User_Flow_Dashboard.md", size: "12 KB", type: "MD", date: "2024-03-11" },
    { id: "3", name: "Benchmark_Competidores.pdf", size: "5.1 MB", type: "PDF", date: "2024-03-09" },
];

export function ProjectFiles() {
    return (
        <div className="p-8 h-full flex flex-col space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-xl font-black font-mono tracking-tighter uppercase">Arquivo de Assets</h2>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Documentos, Specs e Media do Projeto</p>
                </div>
                <Button className="gap-2 font-bold text-[10px] uppercase tracking-widest h-9 px-4">
                    <Upload className="size-3.5" />
                    Upload
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar arquivos..."
                        className="pl-10 h-10 bg-card/20 border-border/50 rounded-xl focus-visible:ring-primary/20"
                    />
                </div>
                <Button variant="outline" size="icon" className="size-10 rounded-xl border-border/50">
                    <Filter className="size-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_FILES.map((file, idx) => (
                    <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group p-5 rounded-3xl border border-border/50 bg-card/10 backdrop-blur-sm hover:bg-card/20 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                            {file.type === 'PDF' ? <FileIcon className="size-20" /> : <FileText className="size-20" />}
                        </div>

                        <div className="flex items-start justify-between relative z-10">
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 border border-primary/20">
                                {file.type === 'PDF' ? <FileIcon className="size-6" /> : <FileText className="size-6" />}
                            </div>
                            <Button variant="ghost" size="icon" className="size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="size-4" />
                            </Button>
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="font-mono font-bold text-sm truncate uppercase tracking-tight">{file.name}</h3>
                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                                <span>{file.type}</span>
                                <span>•</span>
                                <span>{file.size}</span>
                                <span>•</span>
                                <span>{file.date}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}

                <button className="h-full min-h-[160px] rounded-3xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-2 hover:bg-muted/30 transition-colors group">
                    <div className="size-10 rounded-full bg-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus className="size-5 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Adicionar Novo</span>
                </button>
            </div>
        </div>
    );
}
