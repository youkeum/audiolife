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
