import { ManagementDashboard } from "@/features/dashboard/components/management-dashboard";
import { PermissionGuard } from "@/components/auth/permission-guard";

export default function DashboardPage() {
    return (
        <div className="flex flex-col h-full bg-background/50 overflow-hidden relative">
            <PermissionGuard role="ADMIN" fallback={
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-12">
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
    );
}
