"use client";

import { useAppStore, UserRole } from "@/store/use-app-store";
import React from "react";

interface PermissionGuardProps {
    role: UserRole;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function PermissionGuard({ role, children, fallback = null }: PermissionGuardProps) {
    const { currentUser } = useAppStore();

    // Basic logic: ADMIN can do everything, MEMBER only matches 'MEMBER'
    const hasPermission = currentUser.role === "ADMIN" || currentUser.role === role;

    if (!hasPermission) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
