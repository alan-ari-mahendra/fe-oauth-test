import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import type { JWT } from 'next-auth/jwt'

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, account }): Promise<JWT & { backendToken?: string; user?: unknown }> {
            if (account?.access_token) {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ accessToken: account.access_token }),
                    })

                    const data = await res.json()
                    if (res.ok) {
                        token.backendToken = data.token
                        token.user = data.user
                    } else {
                        console.error("Backend auth error:", data)
                    }
                } catch (err) {
                    console.error("JWT callback error:", err)
                }
            }

            return token
        },

        async session({ session, token }) {
            if (session.user) {
                return {
                    ...session,
                    id: (token.user as { id?: string })?.id,
                    backendToken: token.backendToken,
                }
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}
