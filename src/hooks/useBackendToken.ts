"use client"

import { useSession } from "next-auth/react"
import { useMemo } from "react"

export function useBackendToken() {
    const { data: session, status } = useSession()

    const token = useMemo(() => {
        return session?.backendToken ?? null
    }, [session])

    return {
        token,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        session,
    }
}
