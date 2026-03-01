import type { Metadata } from "next";
import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "관리자",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/");
  }

  return (
    <section className="page-stack admin-page-stack">
      <div className="meta">ADMIN</div>
      <h1 className="page-title">관리자</h1>
      <AdminNav />
      {children}
    </section>
  );
}
