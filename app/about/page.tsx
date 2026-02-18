import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABOUT",
  description: "AudioLife 소개 및 리뷰 의뢰 안내"
};

export default function AboutPage() {
  return (
    <article className="article">
      <h1 className="page-title">ABOUT</h1>
      <p className="description">
        AudioLife는 실사용 중심의 오디오 리뷰와 산업/문화 기사를 발행하는 개인 매거진입니다.
      </p>

      <div className="prose">
        <h2>운영자 소개</h2>
        <p>
          하이파이와 헤드파이를 모두 사랑하는 오디오 전문 리뷰어입니다.<br />
          객관적인 측정 수치만큼, 주관적인 실제 청음 소감도 중요시합니다.<br />
          제품 리뷰, 오디오 행사 취재, 신제품 소개, 오디오 칼럼 등 다양한 내용을 전달하려 합니다.
        </p>

        <h2>리뷰 의뢰</h2>
        <p>리뷰 의뢰/협업 문의는 아래 메일로 연락해 주세요.</p>
        <ul>
          <li>이메일: youkeum@gmail.com</li>
          <li>응답 시간: 영업일 기준 2~3일</li>
          <li>의뢰 시 제공 정보: 제품명, 목적, 희망 일정, 참고 링크</li>
        </ul>

        <h2>리뷰 원칙</h2>
        <ul>
          <li>대여/제공/직접 구매 여부를 본문에 명시합니다.</li>
          <li>리뷰 내용은 장점과 단점을 분리해 서술합니다.</li>
          <li>상업 협업 시에도 편집 독립성을 유지합니다.</li>
        </ul>
      </div>
    </article>
  );
}
