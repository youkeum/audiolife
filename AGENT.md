# AGENT.md

오디오 개인 웹매거진(HomePage) 재시작/인수인계를 위한 단일 운영 문서.

## 1) 프로젝트 정체성
- 목적: 오디오 리뷰/기사/컬럼 + 멤버 커뮤니티 운영
- 스택: Next.js(App Router) + Markdown 콘텐츠 + 정적 이미지 자산
- 기준 저장소 경로: `/Users/ykkim/Desktop/Homepage`
- 프로덕션 도메인: `https://audiolife.kr`

## 2) 지금까지 작업 흐름 요약
1. 매거진 기본 구조 구축 (리뷰/기사/카테고리/태그 라우트 + 마크다운 로더)
2. SEO/배포 기반 정비 (robots, sitemap, OG, 아이콘, 도메인 리다이렉트)
3. 홈/헤더/상세 페이지 매거진형 UI 개선
4. 본문 미디어 처리 강화 (커버 추출, YouTube 임베드, 링크카드)
5. 컬럼 섹션 추가 (`/columns` + 컬럼 상세 라우트)
6. 검색 고도화 (헤더 검색 + 통합 검색 페이지)
7. 멤버 인증/댓글 시스템 도입 + 관리자 페이지(`/admin`) 구축
8. 콘텐츠/이미지 자산 지속 업데이트

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
  - `content/columns/posts/*.md`
  - 컬럼 운영 문서: `content/columns/AGENT.MD`, `content/columns/WRITING_GUIDE.MD`, `content/columns/hifi-headfi-100days-curriculum.md`
- 이미지 자산:
  - 배너: `public/banners/*`
  - 기사 이미지: `public/posts/articles/<slug>/*`
  - 리뷰 이미지: `public/posts/reviews/<slug>/*`
  - 컬럼 이미지: `public/posts/columns/*`
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
- 홈(`app/page.tsx`): 최신 포스트 Hero + 리뷰/기사 + 최신 컬럼 스트립
- 상세(`app/articles/[slug]/page.tsx`, `app/reviews/[slug]/page.tsx`, `app/columns/[slug]/page.tsx`): 본문 + 멤버 댓글 + 최근 글
- 검색(`app/search/page.tsx` + `components/HeaderSearch.tsx`): 리뷰/기사/컬럼 통합 검색
- 댓글(`components/MemberComments.tsx`): 로그인 사용자 댓글 작성 + 관리자 검수 플로우
- 인증/권한(`lib/auth.ts`, `app/api/auth/[...nextauth]/route.ts`): 멤버 인증 + 관리자 권한
- 관리자(`app/admin/*`, `app/api/admin/*`): 댓글/이메일/회원 관리
- 도메인 정책(`middleware.ts`): `www.audiolife.kr` -> `audiolife.kr` 308 리다이렉트

## 7) 현재 콘텐츠 인덱스
- Articles (13):
- 1000xm6.md | 2026-02-17 | IEM | 소니 WF-1000XM6 등장
- Ecoute_th2.md | 2026-02-12 | HEADPHONE | Écoute TH2
- SL1500CS.md | 2026-02-24 | TURNTABLE | 테크닉스 SL-1500CS
- ab92.md | 2026-03-13 | HEADPHONE | ARCTEC AB92
- arnika.md | 2026-02-20 | HEADPHONE | 헤드폰에 들어 있는 유해 물질들
- buds4pro.md | 2026-02-26 | IEM | 삼성 갤럭시 버즈4 프로
- final_dx10000cl.md | 2026-02-12 | HEADPHONE | final DX10000CL
- meze_astru.md | 2026-03-07 | IEM | Meze Astru
- neoidsd3.md | 2026-02-19 | DAC | ifi NEO iDSD3
- oae2.md | 2026-03-06 | HEADPHONE | 그렐 오디오 OAE2 출격 준비
- pd20.md | 2026-02-27 | IEM | 아스텔앤컨 PD20
- s400mk3.md | 2026-03-16 | SPEAKER | Buchardt Audio S400 MK3
- s550.md | 2026-03-04 | HEADPHONE | 그라도 S550
- Reviews (8):
- RS275.md | 2026-03-03 | HEADPHONE | 젠하이저 RS275
- cambridgelr.md | 2026-03-06 | SPEAKER | 캠브리지오디오 L/R 북셸프 스피커
- glv.md | 2026-02-01 | TURNTABLE | 턴테이블과 관련한 재미있는 경험들
- hc5.md | 2026-02-18 | DAC | 이게... 되네? 아스텔앤컨 HC5
- pinkfaun.md | 2026-03-07 | DIGITAL TRANSPORT | 핑크펀(Pink Faun) 듀얼 울트라 2.16
- r10arrete.md | 2026-03-15 | SPEAKER | 오디오벡터 R10 Arrete
- stella.md | 2026-03-11 | IEM | 아스텔앤컨 & 볼크오디오 스텔라
- taoc.md | 2026-03-01 | AUDIO RACK | 타옥 ASR III & CSR
- Columns (20):
- hifi-headfi-100days-day1.md | 2026-02-21 | COLUMN | [100일 프로젝트] Day 1 - Hi-Fi와 Head-Fi는 무엇이 다를까
- hifi-headfi-100days-day10.md | 2026-03-03 | COLUMN | [100일 프로젝트] Day 10 - PCM 오디오가 소리를 담는 방식
- hifi-headfi-100days-day11.md | 2026-03-04 | COLUMN | [100일 프로젝트] Day 11 - 손실압축(MP3/AAC) 원리와 한계
- hifi-headfi-100days-day12.md | 2026-03-05 | COLUMN | [100일 프로젝트] Day 12 - 무손실(FLAC/ALAC)과 하이레졸루션의 실제 의미
- hifi-headfi-100days-day13.md | 2026-03-06 | COLUMN | [100일 프로젝트] Day 13 - 인간 청각의 특성: 가청대역, 마스킹, 적응
- hifi-headfi-100days-day14.md | 2026-03-08 | COLUMN | [100일 프로젝트] Day 14 - 등청감곡선과 볼륨 착시
- hifi-headfi-100days-day15.md | 2026-03-09 | COLUMN | [100일 프로젝트] Day 15 - 라우드니스 워: 왜 음원은 점점 더 커졌는가
- hifi-headfi-100days-day16.md | 2026-03-10 | COLUMN | [100일 프로젝트] Day 16 - 스트리밍 라우드니스 노멀라이제이션(LUFS)과 실제 청감 차이
- hifi-headfi-100days-day17.md | 2026-03-12 | COLUMN | [100일 프로젝트] Day 17 - 오디오 표현 용어 1: 밝음, 따뜻함, 선명함
- hifi-headfi-100days-day18.md | 2026-03-13 | COLUMN | [100일 프로젝트] Day 18 - 오디오 표현 용어 2: 해상도, 분리도, 밀도, 공간감
- hifi-headfi-100days-day19.md | 2026-03-15 | COLUMN | [100일 프로젝트] Day 19 - 스테레오 이미지와 사운드스테이지 입문
- hifi-headfi-100days-day2.md | 2026-02-22 | COLUMN | [100일 프로젝트] Day 2 - 좋은 소리란 무엇인가 (공학 vs 취향)
- hifi-headfi-100days-day20.md | 2026-03-16 | COLUMN | [100일 프로젝트] Day 20 - 다양한 장르별 감상 포인트
- hifi-headfi-100days-day3.md | 2026-02-23 | COLUMN | [100일 프로젝트] Day 3 - 오디오 신호 체인 한눈에 보기
- hifi-headfi-100days-day4.md | 2026-02-24 | COLUMN | [100일 프로젝트] Day 4 - 소리의 세 가지 축: 주파수, 크기, 시간
- hifi-headfi-100days-day5.md | 2026-02-25 | COLUMN | [100일 프로젝트] Day 5 - 주파수와 음높이, 배음의 기초
- hifi-headfi-100days-day6.md | 2026-02-26 | COLUMN | [100일 프로젝트] Day 6 - 음압과 체감 크기(라우드니스)의 차이
- hifi-headfi-100days-day7.md | 2026-02-27 | COLUMN | [100일 프로젝트] Day 7 - 데시벨(dB) 완전 기초
- hifi-headfi-100days-day8.md | 2026-02-28 | COLUMN | [100일 프로젝트] Day 8 - 샘플링레이트가 의미하는 것
- hifi-headfi-100days-day9.md | 2026-03-02 | COLUMN | [100일 프로젝트] Day 9 - 비트뎁스와 다이내믹레인지의 관계

## 8) 재시작 체크리스트
1. `npm install` 후 `npm run dev` 실행
2. `AGENT.md`의 "현재 상태"와 "최근 커밋"으로 마지막 작업 지점 확인
3. 컬럼 작성 시 `content/columns/AGENT.MD` -> `.../WRITING_GUIDE.MD` -> `.../hifi-headfi-100days-curriculum.md` 순으로 확인
4. 새 글 작성 시 `content/articles/*.md` / `content/reviews/*.md` / `content/columns/posts/*.md` + `public/posts/.../` 이미지 동시 반영
5. 인증/댓글 기능 수정 시 `app/api/*`, `lib/auth.ts`, `prisma/schema.prisma` 영향 범위 확인
6. UI 변경 시 `app/globals.css`와 해당 페이지 컴포넌트 동시 확인
7. 배포 전 `npm run build`로 라우팅/마크다운/타입 오류 확인

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
- 업데이트 시각: 2026-03-16 22:26:23 KST
- 현재 브랜치: main
- 마지막 커밋: 2026-03-16 | 3c0ca6e | Add S400 MK3 article and images
- 콘텐츠 개수: articles=13, reviews=8, columns=20

### 워킹트리 상태
-  M AGENT.md
- A  content/columns/image-prompts/hifi-headfi-100days-day20-image-prompts.md
- A  content/columns/posts/hifi-headfi-100days-day20.md
- A  public/posts/columns/76.png
- A  public/posts/columns/77.png
- A  public/posts/columns/78.png
- A  public/posts/columns/79.png

### 최근 커밋 (최신 30개)
- 2026-03-16 | 3c0ca6e | Add S400 MK3 article and images
- 2026-03-15 | a34ba71 | Add finalized Day 19 column and images
- 2026-03-15 | 7a7cdab | Add R10 Arrete review post and images
- 2026-03-13 | 3dcb8f4 | Add AB92 article and media assets
- 2026-03-13 | b64c8d4 | Add finalized Day 18 column and images
- 2026-03-12 | bb49fb6 | Add finalized Day 17 column and images
- 2026-03-12 | 799f0b7 | Add STELLA review draft and renamed images
- 2026-03-10 | e24d109 | Add finalized Day 16 column and images
- 2026-03-09 | 9c40023 | Add finalized Day 15 column and images
- 2026-03-08 | bd044e0 | Refine home article list layout and spacing
- 2026-03-08 | bfb08ff | Add finalized Day 14 column and images
- 2026-03-07 | 4114e1e | Revise Pink Faun review content
- 2026-03-07 | f04aeca | Add Pink Faun review post and images
- 2026-03-07 | e1bbaa3 | Add Meze Astru article and images
- 2026-03-07 | 8224489 | Update tags for Day 2-13 columns
- 2026-03-07 | 469fd7f | Refine Day 13 column final manuscript
- 2026-03-07 | dd0f953 | Apply pending content and asset updates
- 2026-03-07 | f764b81 | Add Day 13 column updates and image prompts
- 2026-03-06 | 003e911 | Add Cambridge Audio L/R review post and media
- 2026-03-06 | a42f895 | Add pending articles, QA tooling, and curriculum updates
- 2026-03-06 | 9b71c65 | Add finalized Day 12 column and image prompts
- 2026-03-04 | 9300fff | Add finalized Day 11 column and image prompts
- 2026-03-04 | 29d947a | Add RS275 review post and assets
- 2026-03-03 | bc531e8 | Add finalized Day 10 column and image prompts
- 2026-03-02 | 527ff08 | Adjust Day 9 column line breaks
- 2026-03-02 | ff97f5a | Add finalized Day 9 column, assets, and image prompts
- 2026-03-01 | 13688c9 | Enhance SEO metadata and structured data
- 2026-03-01 | 0ea31e8 | Add TAOC review post and media assets
- 2026-03-01 | c367e06 | Adjust review schema to embed Product review data
- 2026-02-28 | 4a165cb | Update AGENT status after Day 8 commit
