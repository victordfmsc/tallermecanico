import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).isSuperAdmin = token.isSuperAdmin;
        (session.user as any).shopId = token.shopId;
        (session.user as any).subscriptionStatus = token.subscriptionStatus;
        (session.user as any).trialEndsAt = token.trialEndsAt;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // On sign-in, fetch fresh user+shop data from DB
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            shop: {
              select: { subscriptionStatus: true, trialEndsAt: true },
            },
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isSuperAdmin = dbUser.isSuperAdmin;
          token.shopId = dbUser.shopId;
          token.subscriptionStatus = dbUser.shop?.subscriptionStatus ?? null;
          token.trialEndsAt = dbUser.shop?.trialEndsAt?.toISOString() ?? null;
        }
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  // NextAuth v5 uses AUTH_SECRET (not NEXTAUTH_SECRET)
  secret: process.env.AUTH_SECRET,
});
