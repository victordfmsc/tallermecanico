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
    async session({ session, user, token }) {
      if (session.user) {
        // Find user in DB to get role and shopId
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
        });
        if (dbUser) {
          (session.user as any).id = dbUser.id;
          (session.user as any).role = dbUser.role;
          (session.user as any).isSuperAdmin = dbUser.isSuperAdmin;
          (session.user as any).shopId = dbUser.shopId;

          // Add subscription info
          const shop = await prisma.shop.findUnique({
            where: { id: dbUser.shopId || "" },
            select: { subscriptionStatus: true, trialEndsAt: true }
          });
          if (shop) {
            (session.user as any).subscriptionStatus = shop.subscriptionStatus;
            (session.user as any).trialEndsAt = shop.trialEndsAt;
          }
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.isSuperAdmin = (user as any).isSuperAdmin;
        token.shopId = (user as any).shopId;
        token.subscriptionStatus = (user as any).subscriptionStatus;
        token.trialEndsAt = (user as any).trialEndsAt;
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
});
