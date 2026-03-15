import { CommunitiesList } from "@/features/communities/components/communities-list";

export default function CommunitiesPage() {
    return (
        <div className="h-full overflow-y-auto bg-background/50">
            <div className="max-w-[1440px] mx-auto px-8 py-8">
                <CommunitiesList />
            </div>
        </div>
    );
}
