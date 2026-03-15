// Server Component — exports generateStaticParams for static export compatibility
import ProjectPageClient from "./project-client";

// Apenas os params retornados aqui serão válidos em produção (output: "export")
export const dynamicParams = false;

// Pre-generates all known project routes at build time for Cloudflare Pages
export function generateStaticParams() {
    return [
        { id: "proj_01" },
        { id: "proj_02" },
        { id: "proj_03" },
        { id: "p4" },
        { id: "p5" },
        { id: "p6" },
        { id: "p7" },
        { id: "p8" },
        { id: "p9" },
        { id: "p10" },
        { id: "p11" },
        { id: "p12" },
    ];
}

export default function ProjectPage() {
    return <ProjectPageClient />;
}
