import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      shopId?: string | null;
      isSuperAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    shopId?: string | null;
    isSuperAdmin?: boolean;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    shopId?: string | null;
    isSuperAdmin?: boolean;
    role?: string;
  }
}
