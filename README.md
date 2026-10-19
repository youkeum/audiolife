# AudioLife Homepage

오디오 리뷰 및 기사 작성을 위한 개인 홈페이지 템플릿입니다.

## Local run

```bash
npm install
npx prisma generate
npm run dev
```

## Database setup

1. `.env`에 `DATABASE_URL`을 설정합니다.
2. DB 반영:

```bash
npx prisma migrate dev --name init_member_auth_comments
```

## Auth/Comment env

필수:

- `DATABASE_URL`
- `NEXTAUTH_URL` (예: `http://localhost:3000`)
- `NEXTAUTH_SECRET`

소셜 로그인(선택):

- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `KAKAO_CLIENT_ID`, `KAKAO_CLIENT_SECRET`
- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET`

이메일 매직링크 로그인(선택):

- `EMAIL_SERVER` (SMTP URL)
- `EMAIL_FROM` (예: `AudioLife <no-reply@audiolife.kr>`)

관리자/회원 메일 발송:

- `ADMIN_EMAILS` (쉼표 구분, 예: `admin@audiolife.kr`)
- `RESEND_API_KEY`
- `RESEND_FROM`

## Features

- 회원 인증: 구글/카카오/네이버 + 이메일 매직링크
- 댓글: 회원 전용 작성, DB 저장
- 회원 이메일 수신 동의 저장
- 관리자 페이지: `/admin/email` 에서 동의 회원 대상 메일 발송

## Content authoring

- 리뷰: `content/reviews/*.md`
- 기사: `content/articles/*.md`
- Frontmatter 필수값: `title`, `date`, `excerpt`, `category`, `tags`

## Deployment (Vercel 권장)

1. GitHub에 푸시
2. Vercel에서 저장소 Import
3. 도메인 `audiolife.kr` 연결

## DNS (Cafe24)

- apex(`@`): Vercel Domain Settings 화면에서 제시하는 A 레코드 IP를 사용
- www: CNAME `cname.vercel-dns.com` (또는 Vercel이 제시한 값)

DNS 전파는 수 분~수 시간 소요될 수 있습니다.

## Layout and image maintenance (2026-10)

- 메뉴, 소개 문구, 목록당 글 수, 메인 노출 수: `lib/site.ts`
- 메인: `app/page.tsx`, `app/home.module.css`
- 리뷰/기사/컬럼/태그/카테고리/검색 목록: `components/PostArchive.tsx`, `lib/archive.ts`
- 상세 화면: `components/PostDetail.tsx`. 리뷰어 YK, 관련 글 3개, 태그 링크가 자동 표시됩니다.
- 썸네일: `components/PostImage.tsx`. 화면 크기에 맞는 이미지와 지연 로딩을 자동 적용합니다.
- 본문 이미지: `lib/images.ts`. 로컬 JPG/PNG/WebP/AVIF는 치수를 읽고 반응형 이미지로 출력합니다. 원본 파일과 Markdown은 변경하지 않습니다. GIF/외부 이미지는 원본 주소와 지연 로딩을 유지합니다.
- 이미지 변환 설정: `next.config.mjs`. Next.js 서버/Vercel의 Image Optimization이 필요하며 단순 정적 파일 호스팅만으로는 동작하지 않습니다.
- 원본 이미지를 교체할 때는 새 파일명을 사용하세요. 동일 경로는 변환 캐시가 남을 수 있습니다(최소 TTL 24시간).
- `coverImage`가 없으면 첫 Markdown 이미지를 대표 이미지로 씁니다. 명시한 `coverImage`가 첫 이미지와 다르면 본문의 첫 이미지를 삭제하지 않습니다.
- `excerpt`가 본문 첫 부분을 그대로 발췌한 경우 상세 화면에서 중복 소개 문단을 생략합니다. 검색용 설명은 유지합니다.
- 목록은 기본 12개씩, GET 검색/분류와 실제 페이지 링크를 제공합니다. 검색·필터 결과와 글 3개 미만의 태그/카테고리 페이지는 `noindex, follow`입니다. 개별 원고의 색인 설정은 바뀌지 않습니다.
- 캘린더는 삭제되었습니다. 이전 `/calendar`는 404이며 무관한 홈으로 강제 이동시키지 않습니다.
- 컬럼 원고 경로: `content/columns/posts/*.md`

### Verification

```bash
npm test
npm run build
npm run start -- -p 3010
node scripts/check-site.mjs http://localhost:3010
```

다음 단계 및 배포 전 점검은 `docs/site-improvement-plan.md`를 참고하세요.

## Manuscript checks

작성 기준과 제품/공간/기사 템플릿은 `docs/content-authoring.md`를 참고하세요.
`npm run content:check`는 모든 원고의 필수 값, 날짜, 이미지/영상 경로와 내부 글 링크를 점검합니다.
잘못된 경로와 필수 값은 빌드 전에 오류로 차단하고, 요약·소제목·태그 개선 사항은 권고로 안내합니다.
기존 글 수정 시 `date`를 바꾸지 말고 실제 수정일을 `updated`로 추가합니다.
