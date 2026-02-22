import { UserRole, UserStatus } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      status: UserStatus;
    };
  }

  interface User {
    role: UserRole;
    status: UserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    status?: UserStatus;
  }
}
