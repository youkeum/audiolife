import AdminEmailForm from "@/components/AdminEmailForm";

export const metadata = {
  title: "회원 이메일 발송"
};

export default function AdminEmailPage() {
  return (
    <section>
      <h2 className="admin-section-title">이메일관리</h2>
      <p className="description">회원 설정에 따라 공지 메일을 발송합니다.</p>
      <AdminEmailForm />
    </section>
  );
}
