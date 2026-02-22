import AdminCommentsManager from "@/components/AdminCommentsManager";

export const metadata = {
  title: "댓글 관리"
};

export default function AdminCommentsPage() {
  return (
    <section>
      <h2 className="admin-section-title">댓글관리</h2>
      <p className="description">회원 댓글을 확인하고 삭제할 수 있습니다.</p>
      <AdminCommentsManager />
    </section>
  );
}
