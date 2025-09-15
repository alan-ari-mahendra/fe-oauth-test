"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"
import api from "@/lib/axios"
import { useBackendToken } from "@/hooks/useBackendToken"

interface DashboardData {
    message: string
    user: {
        id: string
        email: string
        name: string
    }
}

export default function Dashboard() {
    const { token, isLoading, isAuthenticated, session } = useBackendToken()
    const router = useRouter()

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login")
        }
    }, [isLoading, isAuthenticated, router])

    const handleLogout = async () => {
        try {
            await signOut({
                callbackUrl: "/login",
                redirect: true,
            })
        } catch (err) {
            console.error("Logout error:", err)
        }
    }

    const fetchDashboardData = async () => {
        if (!token) return

        try {
            setLoading(true)
            setError("")

            const response = await api.get("/api/dashboard", {
                headers: { Authorization: `Bearer ${token}` },
            })

            setDashboardData(response.data)
        } catch (err: any) {
            console.error("Dashboard API error:", err)
            setError("Failed to fetch dashboard data")
        } finally {
            setLoading(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) return null

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session?.user?.name}
              </span>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* User Profile Card */}
                <div className="bg-white rounded-lg shadow-sm border mb-8">
                    <div className="px-6 py-8 flex items-center">
                        {session?.user?.image ? (
                            <img
                                className="h-16 w-16 rounded-full border-2 border-gray-200"
                                src={session.user.image}
                                alt="Profile"
                            />
                        ) : (
                            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-medium text-lg">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </span>
                            </div>
                        )}
                        <div className="ml-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {session?.user?.name}
                            </h2>
                            <p className="text-gray-600">{session?.user?.email}</p>
                            <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Authenticated
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow-sm border mb-8 px-6 py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Dashboard Actions
                    </h3>
                    <div className="flex space-x-4">
                        <button
                            onClick={fetchDashboardData}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Test Backend API
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {dashboardData && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 font-medium">API Response:</p>
                            <pre className="mt-2 text-xs text-green-700 bg-green-100 p-2 rounded overflow-auto">
                {JSON.stringify(dashboardData, null, 2)}
              </pre>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="bg-white rounded-lg shadow-sm border px-6 py-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Protected Content
                    </h3>
                    <p className="text-gray-600">
                        This is your protected dashboard content. Only authenticated users
                        can access this page.
                    </p>
                </div>
            </div>
        </div>
    )
}
