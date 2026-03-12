import { ManagementDashboard } from "@/features/dashboard/components/management-dashboard";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function DashboardPage() {
    return (
        <div className="flex flex-col h-full bg-background/50 overflow-hidden relative">
            {/* Premium Standard Header */}
            <header className="shrink-0 border-b border-border/50 bg-card/30 backdrop-blur-md px-8 py-6 z-20">
                <div className="max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <h1 className="text-sm font-black font-mono tracking-[0.2em] uppercase text-primary mb-0.5">Management Suite</h1>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black font-mono tracking-tighter uppercase text-foreground">Global Overview</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-[1600px] mx-auto">
                    <PermissionGuard role="ADMIN" fallback={
                        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="size-20 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                                <span className="text-4xl">🔐</span>
                            </div>
                            <h2 className="text-xl font-bold font-mono uppercase tracking-tight">Acesso Restrito</h2>
                            <p className="text-muted-foreground max-w-md">O Dashboard Executivo está disponível apenas para administradores do workspace.</p>
                        </div>
                    }>
                        <ManagementDashboard />
                    </PermissionGuard>
                </div>
            </main>
        </div>
    );
}
