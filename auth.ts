// /auth.ts
import NextAuth, { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
}

import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { createSession } from "@/lib/auth"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ] as any[],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only apply custom logic for the Google provider
      if (account?.provider !== "google") return true;

      // Reject unverified Google emails as a security measure
      if (!(profile as Record<string, unknown>)?.email_verified) return false;

      const email = user.email;
      if (!email) return false; // Safety: Google always provides an email, but guard anyway

      try {
        let dbUser = await prisma.user.findUnique({ where: { email } });

        if (!dbUser) {
          // --- CASE 1: Brand new user. Create account via Google, already verified. ---
          dbUser = await prisma.user.create({
            data: {
              email,
              emailVerifid: true,
              name: user.name,
              image: user.image,
              googleId: account.providerAccountId,
            },
          });
        } else if (!dbUser.googleId) {
          // --- CASE 2: Existing email/password user signing in with Google for the first time.
          //     Link the Google provider to their existing account. ---
          dbUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              googleId: account.providerAccountId,
              // Only backfill name/image if they don't already have one
              name: dbUser.name ?? user.name,
              image: dbUser.image ?? user.image,
              // If they verified via Google, we can trust the email is verified
              emailVerifid: true,
            },
          });
        }
        // CASE 3: Account already linked (dbUser.googleId is set). Nothing to do.

        // Create the custom cookie-based session so the rest of the app works seamlessly
        await createSession(dbUser.id);
        return true;
      } catch (error) {
        console.error("Google sign-in callback failed:", error);
        return false; // Deny login on unexpected errors
      }
    },

    async jwt({ token, account, profile }) {
      // Only resolve the DB user ID on the initial sign-in (when account is present).
      if (account && profile && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
})
