import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session extends DefaultSession {
        id?: string
        backendToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        backendToken?: string
        user?: { id?: string } & Record<string, unknown>
    }
}
