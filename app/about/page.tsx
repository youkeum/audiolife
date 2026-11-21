import type { Metadata } from "next";
import Link from "next/link";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "ABOUT",
  alternates: { canonical: "https://audiolife.kr/about" },
  description: "하이파이와 헤드파이를 다루는 오디오 전문 웹진 오디오라이프의 소개, 리뷰 원칙과 협업 문의 안내입니다."
};

export default function AboutPage() {
  return (
    <article className={styles.page}>
      <header className={styles.introduction}>
        <p className={styles.eyebrow}>ABOUT AUDIOLIFE</p>
        <h1 className={styles.title}>
          <span>음악을 듣는 조건까지</span>{" "}
          <span>기록합니다</span>
        </h1>
        <p className={styles.lead}>
          오디오라이프는 하이파이와 헤드파이를 다루는 오디오 전문 웹진입니다.
          제품을 직접 들어 보고 어떤 음악과 기기를 조합했는지, 그 조건에서 무엇이 다르게 들렸는지 기록합니다.
          신제품과 오디오 행사 소식을 전하고 음악과 오디오를 즐기는 방식에 관한 칼럼을 씁니다.
        </p>
      </header>

      <nav className={styles.categories} aria-label="콘텐츠 둘러보기">
        <Link href="/reviews" className={styles.category}>
          <span className={styles.categoryTitle}>REVIEWS <span aria-hidden="true">↗</span></span>
          <span className={styles.categoryDescription}>제품과 청음 공간 리뷰</span>
        </Link>
        <Link href="/articles" className={styles.category}>
          <span className={styles.categoryTitle}>ARTICLES <span aria-hidden="true">↗</span></span>
          <span className={styles.categoryDescription}>신제품과 오디오 행사 소식</span>
        </Link>
        <Link href="/columns" className={styles.category}>
          <span className={styles.categoryTitle}>COLUMNS <span aria-hidden="true">↗</span></span>
          <span className={styles.categoryDescription}>음악과 오디오를 즐기는 방식</span>
        </Link>
      </nav>

      <section className={styles.section} aria-labelledby="review-principles">
        <h2 id="review-principles" className={styles.sectionTitle}>리뷰 원칙</h2>
        <ul className={styles.principles}>
          <li>
            <p><strong>리뷰에 사용한 기기와 청음 환경을 밝힙니다.</strong> 제조사 사양과 측정 자료는 필자의 청음 소감과 구분합니다.</p>
          </li>
          <li>
            <p><strong>제품의 장점과 아쉬운 점을 함께 다룹니다.</strong> 제품이 대여품인지, 제공받은 것인지, 직접 구매한 것인지 본문에 밝힙니다.</p>
          </li>
          <li>
            <p><strong>협업 여부와 관계없이 리뷰의 평가는 필자가 결정합니다.</strong></p>
          </li>
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="collaboration-contact">
        <h2 id="collaboration-contact" className={styles.sectionTitle}>협업 문의</h2>
        <div className={styles.contact}>
          <p>리뷰, 광고 등의 문의는 아래 메일로 연락해 주십시오.</p>
          <dl className={styles.contactDetails}>
            <div>
              <dt>이메일</dt>
              <dd><a href="mailto:youkeum@gmail.com">youkeum@gmail.com</a></dd>
            </div>
            <div>
              <dt>응답 시간</dt>
              <dd>영업일 기준 2~3일</dd>
            </div>
            <div>
              <dt>의뢰 시 제공 정보</dt>
              <dd>제품명, 목적, 희망 일정, 참고 링크</dd>
            </div>
          </dl>
        </div>
      </section>
    </article>
  );
}
