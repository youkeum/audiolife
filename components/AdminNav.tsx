import Link from "next/link";

export default function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="관리자 메뉴">
      <Link href="/admin/comments">댓글관리</Link>
      <Link href="/admin/email">이메일관리</Link>
      <Link href="/admin/members">회원관리</Link>
    </nav>
  );
}
