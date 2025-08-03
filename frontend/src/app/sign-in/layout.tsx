
'use client';

import { AuthProvider } from "@/lib/auth";

export default function SignInLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AuthProvider>{children}</AuthProvider>;
}
