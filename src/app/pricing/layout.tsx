'use client';

import { AuthProvider } from "@/lib/auth";

export default function PricingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
}


