import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        user?: {
            id?: string
            email?: string | null
            name?: string | null
            image?: string | null
        } & DefaultSession["user"]
    }

    interface User {
        id?: string
        email?: string | null
        name?: string | null
        image?: string | null
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string
        accessToken?: string
    }
}
