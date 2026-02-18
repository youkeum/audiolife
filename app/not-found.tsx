import Link from "next/link";

export default function NotFound() {
  return (
    <div className="article">
      <h1 className="page-title">페이지를 찾을 수 없습니다</h1>
      <p className="description">주소를 확인하거나 홈으로 이동해 주세요.</p>
      <p>
        <Link href="/">홈으로 이동</Link>
      </p>
    </div>
  );
}
