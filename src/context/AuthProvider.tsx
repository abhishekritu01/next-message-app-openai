'use client'

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
// Compare this snippet from src/app/%28auth%29/sign-in/page.tsx:   

