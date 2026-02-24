# AGENT.md

오디오 개인 웹매거진(HomePage) 재시작/인수인계를 위한 단일 운영 문서.

## 1) 프로젝트 정체성
- 목적: 오디오 리뷰/기사 중심의 개인 웹매거진 운영
- 스택: Next.js(App Router) + Markdown 콘텐츠 + 정적 이미지 자산
- 기준 저장소 경로: `/Users/ykkim/Desktop/Homepage`
- 프로덕션 도메인: `https://audiolife.kr`

## 2) 지금까지 작업 흐름 요약
1. 초기 웹매거진 구조 구축 (카테고리/태그/리뷰/기사 라우트, 마크다운 로더)
2. SEO/배포 기반 추가 (robots, sitemap, OG 이미지, 아이콘, 도메인 리다이렉트)
3. 메인/헤더/네비게이션을 매거진형 UI로 개편
4. 포스트 상세 UX 강화 (커버 이미지, 썸네일, 유튜브 임베드, 본문 미디어 대응)
5. Giscus 댓글 박스 연동 및 환경값 디버그 메시지 보강
6. 검색 기능 추가 (헤더 검색 + `/search` 결과 페이지)
7. 링크 프리뷰 한글 깨짐(mojibake) 처리 개선 (charset 인식 디코딩)
8. 최신 기사/리뷰 콘텐츠 및 이미지 자산 지속 추가

## 3) 실행/운영 커맨드
- 의존성 설치: `npm install`
- 로컬 실행: `npm run dev`
- 빌드: `npm run build`
- 프로덕션 실행: `npm run start`
- 린트: `npm run lint`

## 4) 핵심 구조 맵
- 앱 라우트(실제 파일 기준):
- app/about/page.tsx
- app/admin/comments/page.tsx
- app/admin/email/page.tsx
- app/admin/layout.tsx
- app/admin/members/page.tsx
- app/admin/page.tsx
- app/api/admin/comments/route.ts
- app/api/admin/emails/send/route.ts
- app/api/admin/members/route.ts
- app/api/auth/[...nextauth]/route.ts
- app/api/comments/route.ts
- app/api/me/settings/route.ts
- app/api/me/subscription/route.ts
- app/articles/[slug]/page.tsx
- app/articles/page.tsx
- app/calendar/page.tsx
- app/categories/[category]/page.tsx
- app/columns/[slug]/page.tsx
- app/columns/page.tsx
- app/globals.css
- app/icon.tsx
- app/layout.tsx
- app/logo/route.tsx
- app/ms-briefing-7f3a/page.tsx
- app/ms-policy-31x9/page.tsx
- app/not-found.tsx
- app/opengraph-image.tsx
- app/page.tsx
- app/reviews/[slug]/page.tsx
- app/reviews/page.tsx
- app/robots.ts
- app/search/page.tsx
- app/settings/page.tsx
- app/sitemap.ts
- app/tags/[tag]/page.tsx
- 콘텐츠 디렉토리:
  - `content/articles/*.md`
  - `content/reviews/*.md`
- 이미지 자산:
  - 배너: `public/banners/*`
  - 기사 이미지: `public/posts/articles/<slug>/*`
  - 리뷰 이미지: `public/posts/reviews/<slug>/*`
- 콘텐츠 파서 핵심: `lib/content.ts`

## 5) 콘텐츠 작성 규격(재시작 시 필수)
- 프론트매터 필수 키: `title`, `date`, `excerpt`, `category`, `tags`
- 선택 키: `coverImage`, `heroTextColor`
- 파일명 규칙: `slug.md` (URL slug로 그대로 사용)
- 본문 규칙:
  - 첫 이미지가 있으면 커버 후보로 자동 추출
  - 본문의 단독 YouTube URL은 iframe 임베드로 변환
  - 본문의 단독 일반 URL은 링크카드(미리보기)로 변환 시도

## 6) 기능/동작 포인트
- 홈(`app/page.tsx`): 최신 게시물 Hero + 리뷰/기사 섹션
- 상세(`app/articles/[slug]/page.tsx`, `app/reviews/[slug]/page.tsx`): 커버 오버레이 + 본문 + 댓글
- 검색(`app/search/page.tsx` + `components/HeaderSearch.tsx`): 제목/요약/태그 기반 검색 UX
- 댓글(`components/GiscusComments.tsx`):
  - 필요 env:
    - `NEXT_PUBLIC_GISCUS_REPO`
    - `NEXT_PUBLIC_GISCUS_REPO_ID`
    - `NEXT_PUBLIC_GISCUS_CATEGORY`
    - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
- 도메인 정책(`middleware.ts`): `www.audiolife.kr` -> `audiolife.kr` 308 리다이렉트

## 7) 현재 콘텐츠 인덱스
- Articles (5):
- 1000xm6.md | 2026-02-17 | IEM | 소니 WF-1000XM6 등장
- Ecoute_th2.md | 2026-02-12 | HEADPHONE | Écoute TH2
- arnika.md | 2026-02-20 | HEADPHONE | 헤드폰에 들어 있는 유해 물질들
- final_dx10000cl.md | 2026-02-12 | HEADPHONE | final DX10000CL
- neoidsd3.md | 2026-02-19 | DAC | ifi NEO iDSD3
- Reviews (2):
- glv.md | 2026-02-01 | TURNTABLE | 턴테이블과 관련한 재미있는 경험들
- hc5.md | 2026-02-18 | DAC | 이게... 되네? 아스텔앤컨 HC5

## 8) 재시작 체크리스트
1. `npm install` 후 `npm run dev` 실행
2. `AGENT.md`의 "현재 상태"와 "최근 커밋"으로 마지막 작업 지점 확인
3. 새 글 작성 시 `content/*/*.md` + `public/posts/.../` 이미지 동시 반영
4. UI 변경 시 `app/globals.css`와 해당 페이지 컴포넌트 동시 확인
5. 댓글이 비정상일 경우 giscus env 누락 여부 먼저 점검
6. 배포 전 `npm run build`로 라우팅/마크다운 파싱 오류 확인

## 9) 자동 반영(실시간 운영)
- 자동 갱신 스크립트: `scripts/update-agent-md.sh`
- Git 훅 연동:
  - `pre-commit`: 커밋 전에 AGENT.md 갱신 후 자동 스테이징
  - `post-commit`: 커밋 직후 AGENT.md 다시 갱신(최신 HEAD 정보 반영)
  - `post-merge`: 머지 직후 AGENT.md 갱신
  - `post-checkout`: 브랜치 이동/체크아웃 후 AGENT.md 갱신
- 훅 경로 설정: `git config core.hooksPath .githooks`
- 수동 갱신: `bash scripts/update-agent-md.sh`

---

## 10) 현재 상태 (자동 갱신)
- 업데이트 시각: 2026-02-24 21:24:30 KST
- 현재 브랜치: main
- 마지막 커밋: 2026-02-23 | d2ba8ea | Add finalized Day 3 column and update writing guide
- 콘텐츠 개수: articles=5, reviews=2

### 워킹트리 상태
- M  AGENT.md
- M  content/columns/WRITING_GUIDE.MD
- A  content/columns/posts/hifi-headfi-100days-day4.md
- A  public/posts/columns/12.png
- A  public/posts/columns/13.png
- A  public/posts/columns/14.png
- A  public/posts/columns/15.png

### 최근 커밋 (최신 30개)
- 2026-02-23 | d2ba8ea | Add finalized Day 3 column and update writing guide
- 2026-02-23 | a4108f1 | feat: 회원 인증/관리자 대시보드 및 헤더-홈 레이아웃 개선
- 2026-02-22 | de68b20 | feat: add threaded comments and topbar auth modal
- 2026-02-22 | ed561d4 | fix: add nodemailer for email magic-link signin
- 2026-02-22 | cec8ee8 | feat: add comment deletion and admin moderation
- 2026-02-22 | 9a771c4 | feat: member auth comments and admin email sender
- 2026-02-22 | 1c351e8 | Add Day 2 column final draft and refine writing guide
- 2026-02-22 | 5d3151a | Add Naver site verification meta tag
- 2026-02-21 | aa867c8 | Document column workflow in AGENT
- 2026-02-21 | e69fc06 | Add link button fallback when link card preview fails
- 2026-02-20 | 5d4b0f7 | Remove duplicate phone frame styling on private page
- 2026-02-20 | f8a79a3 | Update private MyScheduler page image asset
- 2026-02-20 | 964b39f | Add private MyScheduler pages and refine calendar modal behavior
- 2026-02-19 | a0deb38 | Refresh AGENT snapshot after commit
- 2026-02-19 | 6e37b3f | Add calendar page and automate staged image optimization
- 2026-02-19 | a4c920b | Update Article
- 2026-02-19 | 9ff7201 | Fix link preview mojibake by adding charset-aware decoding
- 2026-02-19 | dcabfae | Enhance magazine sidebar and add header search with results page
- 2026-02-18 | b7bf163 | Add giscus missing env key debug message
- 2026-02-18 | 425059a | Update magazine UI, post media handling, hero overlay, link cards, and about page formatting
- 2026-02-18 | 190cdf5 | Update magazine UI, post media handling, hero overlay, link cards, and about page formatting
- 2026-02-18 | c20f134 | Overlay post title on cover image and add comment box UI
- 2026-02-18 | 4c8cd03 | Add cover image extraction, list thumbnails, YouTube embeds, responsive images
- 2026-02-18 | 49d1938 | Remove menu icon and replace brand logo
- 2026-02-18 | de027b9 | Update hero latest post logic and redesign dark magazine header/nav
- 2026-02-18 | f2d3dcd | Redesign home as magazine layout and add about page
- 2026-02-18 | 92740fc | Add domain redirect, SEO metadata, sitemap/robots, OG/icon routes
- 2026-02-18 | fc64243 | Initial AudioLife site
