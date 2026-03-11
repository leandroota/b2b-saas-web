import {
  ArrowRight,
  Clock,
  CheckCircle2,
  MessageSquare,
  AlertCircle,
  FileText,
  LayoutGrid
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex-1 p-8 pt-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-mono font-bold tracking-tight text-foreground">
            Bom dia, John.
          </h2>
          <p className="text-muted-foreground mt-2">
            Aqui está o que exige sua atenção hoje e o que mudou recentemente no seu workspace.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="font-mono">
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Quick Metrics / Pendencies */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bloqueios Ativos</p>
              <h3 className="text-2xl font-bold font-mono">3</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tarefas para Hoje</p>
              <h3 className="text-2xl font-bold font-mono">5</h3>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-secondary text-secondary-foreground rounded-lg">
              <MessageSquare className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Menções não lidas</p>
              <h3 className="text-2xl font-bold font-mono">12</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-7">
        {/* Main Timeline Column */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-mono font-semibold">Timeline Recente</h3>
            <Button variant="outline" size="sm" className="h-8">
              Filtrar
            </Button>
          </div>

          <div className="space-y-4">
            {/* Mock Timeline Item 1 */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-primary">
                  <span className="size-2 rounded-full bg-primary" />
                  Projeto Alpha
                </span>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Clock className="size-3" /> há 15 min
                </span>
              </div>
              <p className="text-foreground text-sm leading-relaxed">
                <span className="font-semibold text-foreground">Sarah Jenkins</span> atualizou o status da tarefa <span className="font-mono bg-muted px-1 py-0.5 rounded text-xs">AL-102</span> para <span className="text-primary font-medium">Em Revisão</span>.
              </p>
            </div>

            {/* Mock Timeline Item 2 */}
            <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-secondary-foreground">
                  <span className="size-2 rounded-full bg-secondary-foreground" />
                  Marketing Q3
                </span>
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                  <Clock className="size-3" /> há 45 min
                </span>
              </div>
              <p className="text-foreground text-sm leading-relaxed">
                <span className="font-semibold text-foreground">Mike T.</span> salvou um novo aprendizado sobre conversão de landing pages que pode ser útil.
              </p>
              <div className="pt-2">
                <Button variant="secondary" size="sm" className="h-8 gap-2">
                  <FileText className="size-3" />
                  Ler Aprendizado
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar/Context Column */}
        <div className="md:col-span-3 space-y-8">
          {/* Spaces Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-mono font-semibold">Meus Spaces</h3>
              <Button variant="ghost" size="sm" className="h-8 text-xs underline underline-offset-4">
                Ver todos
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Inovação", type: "Core", initial: "In" },
                { name: "Operações", type: "Hub", initial: "Op" },
              ].map((space) => (
                <div key={space.name} className="p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors cursor-pointer group">
                  <div className="size-8 rounded bg-primary/10 flex items-center justify-center text-primary mb-3 font-mono font-bold">
                    {space.initial}
                  </div>
                  <h4 className="text-sm font-medium">{space.name}</h4>
                  <p className="text-xs text-muted-foreground">{space.type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-mono font-semibold">Projetos Ativos</h3>
            <div className="space-y-3">
              {[
                { name: "Projeto Alpha", status: "No Prazo", color: "bg-primary" },
                { name: "Integração SSO", status: "Risco", color: "bg-destructive" },
                { name: "Marketing Q3", status: "No Prazo", color: "bg-primary" },
              ].map((project) => (
                <div key={project.name} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-md ${project.color}/10 flex items-center justify-center`}>
                      <div className={`size-2.5 rounded-full ${project.color}`} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-foreground">{project.name}</h4>
                      <p className="text-xs text-muted-foreground">{project.status}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
