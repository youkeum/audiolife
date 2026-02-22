import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AdminCommentsManager from "@/components/AdminCommentsManager";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "댓글 관리"
};

export default async function AdminCommentsPage() {
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
    <section className="page-stack">
      <div className="meta">COMMENT MODERATION</div>
      <h1 className="page-title">댓글 관리</h1>
      <p className="description">회원 댓글을 확인하고 삭제할 수 있습니다.</p>
      <AdminCommentsManager />
    </section>
  );
}
