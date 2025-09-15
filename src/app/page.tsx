'use client';
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "next-auth/react"

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        getSession().then(session => {
            if (session) {
                router.replace("/dashboard")
            } else {
                router.replace("/login")
            }
        })
    }, [router])
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Redirecting...</p>
            </div>
        </div>
    );
}