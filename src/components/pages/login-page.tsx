"use client"

import { useEffect, useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"

import {
    Box,
    Button,
    CircularProgress,
    Container,
    Typography,
    Paper,
    Alert,
} from "@mui/material"
import {
    Google,
    AcUnit
} from "@mui/icons-material"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [error, setError] = useState<string>("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const checkSession = async () => {
            const session = await getSession()
            if (session) {
                router.push("/dashboard")
            }
        }

        checkSession()

        const errorParam = searchParams.get("error")
        if (errorParam) {
            switch (errorParam) {
                case "OAuthSignin":
                case "OAuthCallback":
                    setError("Error occurred during OAuth sign-in. Please try again.")
                    break
                case "OAuthCreateAccount":
                    setError("Could not create account. Please try again.")
                    break
                case "EmailCreateAccount":
                    setError("Could not create account with that email. Please try again.")
                    break
                case "Callback":
                    setError("Error in callback. Please try again.")
                    break
                default:
                    setError("An error occurred during login. Please try again.")
            }
        }
    }, [router, searchParams])

    const handleGoogleLogin = async () => {
        try {
            setLoading(true)
            setError("")

            const result = await signIn("google", {
                callbackUrl: "/dashboard",
                redirect: false,
            })

            if (result?.error) {
                setError("Failed to sign in with Google. Please try again.")
            } else if (result?.url) {
                router.push(result.url)
            }
        } catch (error) {
            console.error("Login error:", error)
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box
            minHeight="100vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
                background: "linear-gradient(to bottom right, #EFF6FF, #E0E7FF)",
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        borderRadius: 4,
                        p: 4,
                    }}
                >
                    <Box textAlign="center" mb={4}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                mx: "auto",
                                borderRadius: "50%",
                                background: "linear-gradient(to right, #3B82F6, #4F46E5)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 2,
                            }}
                        >
                            <AcUnit/>
                        </Box>
                        <Typography variant="h4" fontWeight="bold" color="text.primary">
                            Welcome Back
                        </Typography>
                        <Typography color="text.secondary" mt={1}>
                            Sign in to your account to continue
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        fullWidth
                        variant="outlined"
                        startIcon={
                            loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <Google />
                            )
                        }
                        sx={{
                            py: 1.5,
                            textTransform: "none",
                            fontWeight: 500,
                            fontSize: "0.95rem",
                            bgcolor: "white",
                            color: "text.primary",
                            borderColor: "grey.300",
                            "&:hover": { bgcolor: "grey.50" },
                        }}
                    >
                        {loading ? "Signing in..." : "Continue with Google"}
                    </Button>

                    <Box mt={4} textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            Secure authentication powered by Google OAuth 2.0
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}
