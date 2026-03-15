import { Suspense } from "react";
import { UserTaskCenter } from "@/features/projects/components/user-task-center";

export default function TasksPage() {
    return (
        <Suspense>
            <UserTaskCenter />
        </Suspense>
    );
}
