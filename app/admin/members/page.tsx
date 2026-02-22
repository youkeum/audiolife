import AdminMembersManager from "@/components/AdminMembersManager";

export const metadata = {
  title: "회원 관리"
};

export default function AdminMembersPage() {
  return (
    <section>
      <h2 className="admin-section-title">회원관리</h2>
      <p className="description">회원의 권한/상태를 관리합니다.</p>
      <AdminMembersManager />
    </section>
  );
}
