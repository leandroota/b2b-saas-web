// Server Component — exports generateStaticParams for static export compatibility
import ProjectPageClient from "./project-client";


// Pre-generates all known project routes at build time for Cloudflare Pages
export function generateStaticParams() {
    return [
        { id: "proj_01" },
        { id: "proj_02" },
        { id: "proj_03" },
    ];
}

export default function ProjectPage() {
    return <ProjectPageClient />;
}
