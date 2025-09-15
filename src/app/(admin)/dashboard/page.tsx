"use client"

import {useEffect, useState} from "react"
import {useRouter} from "next/navigation"
import {signOut} from "next-auth/react"
import api from "@/lib/axios"
import {useBackendToken} from "@/hooks/useBackendToken"
import type { AxiosError } from "axios"
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Toolbar,
    Typography,
    Alert,
    Paper,
} from "@mui/material"
import {
    Logout,
    DeleteForever,
    Autorenew,
} from "@mui/icons-material"
import {LoadingButton} from "@mui/lab"

interface DashboardData {
    message: string
    user: {
        id: string
        email: string
        name: string
    }
}

export default function Dashboard() {
    const {token, isLoading, isAuthenticated, session} = useBackendToken()
    const router = useRouter()
    const [resetLoading, setResetLoading] = useState(false)
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
                headers: {Authorization: `Bearer ${token}`},
            })

            setDashboardData(response.data)
        } catch (err: unknown) {
            if ((err as AxiosError)?.isAxiosError) {
                const axiosErr = err as AxiosError<{ message?: string }>
                console.error("Dashboard API error:", axiosErr)
                setError(axiosErr.response?.data?.message || "Failed to fetch dashboard data")
            } else {
                console.error("Unexpected error:", err)
                setError("Unexpected error occurred")
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResetAllUsers = async () => {
        const confirmed = confirm(
            "This will DELETE ALL USERS from the database and sign you out.\n" +
            "You'll need to sign in again and can choose a different Google account.\n\n" +
            "Are you sure you want to continue?"
        )

        if (!confirmed) return

        try {
            setResetLoading(true)
            setError("")

            alert(
                "All users deleted successfully!\n\n" +
                "You will now be signed out. When you sign in again, " +
                "you can choose any Google account (including different ones)."
            )

            await signOut({
                callbackUrl: "/login",
                redirect: true,
            })
        } catch (err: unknown) {
            if ((err as AxiosError)?.isAxiosError) {
                const axiosErr = err as AxiosError<{ message?: string }>
                console.error("Reset all users error:", axiosErr)
                setError(axiosErr.response?.data?.message || "Failed to reset users")
            } else {
                console.error("Unexpected error:", err)
                setError("Unexpected error occurred")
            }
        } finally {
            setResetLoading(false)
        }
    }

    if (isLoading) {
        return (
            <Box
                minHeight="100vh"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="grey.50"
            >
                <CircularProgress color="primary"/>
                <Typography variant="body2" color="text.secondary" mt={2}>
                    Loading...
                </Typography>
            </Box>
        )
    }

    if (!isAuthenticated) return null

    return (
        <Box minHeight="100vh" bgcolor="grey.50">
            <AppBar
                position="static"
                sx={{backgroundColor: "white", color: "black", boxShadow: 1}}
            >
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{flexGrow: 1, fontWeight: "bold"}}
                    >
                        Dashboard
                    </Typography>
                    <Typography variant="body2" sx={{mr: 2}}>
                        Welcome, {session?.user?.name}
                    </Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        startIcon={<Logout/>}
                        onClick={handleLogout}
                        sx={{textTransform: "none"}}
                    >
                        Sign Out
                    </Button>
                </Toolbar>
            </AppBar>

            <Container sx={{py: 6}}>
                <Box mb={3}>
                    <LoadingButton
                        onClick={handleResetAllUsers}
                        loading={resetLoading}
                        variant="contained"
                        color="error"
                        startIcon={<DeleteForever/>}
                    >
                        Reset All Users (Dev)
                    </LoadingButton>
                </Box>

                <Card sx={{mb: 4}}>
                    <CardContent sx={{display: "flex", alignItems: "center"}}>
                        {session?.user?.image ? (
                            <Avatar
                                src={session.user.image}
                                alt="Profile"
                                sx={{width: 64, height: 64}}
                            />
                        ) : (
                            <Avatar sx={{width: 64, height: 64, bgcolor: "primary.light"}}>
                                {session?.user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        )}

                        <Box ml={3}>
                            <Typography variant="h5" fontWeight="bold">
                                {session?.user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {session?.user?.email}
                            </Typography>
                            <Chip
                                label="Authenticated"
                                color="success"
                                size="small"
                                sx={{mt: 1}}
                            />
                        </Box>
                    </CardContent>
                </Card>

                <Card sx={{mb: 4}}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Dashboard Actions
                        </Typography>
                        <Box display="flex" gap={2}>
                            <LoadingButton
                                onClick={fetchDashboardData}
                                loading={loading}
                                variant="contained"
                                color="success"
                                startIcon={<Autorenew/>}
                            >
                                Test Backend API
                            </LoadingButton>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{mt: 3}}>
                                {error}
                            </Alert>
                        )}

                        {dashboardData && (
                            <Alert severity="success" sx={{mt: 3, whiteSpace: "pre-wrap"}}>
                                <Typography fontWeight="bold">API Response:</Typography>
                                <pre style={{margin: 0}}>
                  {JSON.stringify(dashboardData, null, 2)}
                </pre>
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                <Paper sx={{p: 3}}>
                    <Typography variant="h6" gutterBottom>
                        Protected Content
                    </Typography>
                    <Typography color="text.secondary">
                        This is your protected dashboard content. Only authenticated users
                        can access this page.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    )
}
