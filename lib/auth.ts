import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { UserRole, UserStatus } from "@prisma/client";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import { prisma } from "@/lib/prisma";

const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

const providers: NextAuthOptions["providers"] = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  );
}

if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
  providers.push(
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET
    })
  );
}

if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
  providers.push(
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET
    })
  );
}

if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 60 * 10
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, email }) {
      if (email?.verificationRequest) {
        return true;
      }

      const normalizedEmail = user.email?.toLowerCase();
      if (!normalizedEmail) {
        return false;
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: { id: true, email: true, role: true, status: true }
      });

      if (dbUser && dbUser.status === UserStatus.BANNED) {
        return false;
      }

      if (dbUser && adminEmails.has(normalizedEmail) && dbUser.role !== UserRole.ADMIN) {
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { role: UserRole.ADMIN }
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      const userId = user?.id ?? token.sub;
      if (!userId) {
        return token;
      }

      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { role: true, status: true }
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.status = dbUser.status;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as UserRole | undefined) ?? UserRole.USER;
        session.user.status = (token.status as UserStatus | undefined) ?? UserStatus.ACTIVE;
      }

      return session;
    }
  },
  events: {
    async createUser({ user }) {
      const normalizedEmail = user.email?.toLowerCase();
      if (normalizedEmail && adminEmails.has(normalizedEmail)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: UserRole.ADMIN }
        });
      }

      await prisma.emailSubscription.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          enabled: false
        }
      });
    }
  }
};
