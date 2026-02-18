# AudioLife Homepage

오디오 리뷰 및 기사 작성을 위한 개인 홈페이지 템플릿입니다.

## Local run

```bash
npm install
npm run dev
```

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
