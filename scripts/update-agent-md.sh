#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

NOW="$(date '+%Y-%m-%d %H:%M:%S %Z')"
BRANCH="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '-')"
LAST_COMMIT="$(git log -1 --date=short --pretty=format:'%ad | %h | %s' 2>/dev/null || echo '-')"

count_md_files() {
  local dir="$1"
  if [[ -d "$dir" ]]; then
    find "$dir" -maxdepth 1 -type f -name '*.md' ! -name '_template.md' | wc -l | tr -d ' '
  else
    echo "0"
  fi
}

ARTICLE_COUNT="$(count_md_files "content/articles")"
REVIEW_COUNT="$(count_md_files "content/reviews")"
COLUMN_COUNT="$(count_md_files "content/columns/posts")"

if git diff --quiet && git diff --cached --quiet; then
  WORKTREE_STATUS="- clean"
else
  WORKTREE_STATUS="$(git status --short | sed 's/^/- /')"
fi

RECENT_COMMITS="$(git log --date=short --pretty=format:'- %ad | %h | %s' -n 30)"
ROUTE_FILES="$(rg --files app | sort | sed 's/^/- /')"

collect_content_index() {
  local dir="$1"
  local out=""
  shopt -s nullglob
  for file in "$dir"/*.md; do
    local name
    name="$(basename "$file")"
    if [[ "$name" == "_template.md" ]]; then
      continue
    fi
    local title date category
    title="$(awk '
      BEGIN { in_fm = 0 }
      /^---$/ { if (in_fm == 0) { in_fm = 1; next } else { exit } }
      in_fm == 1 && /^title:/ { sub(/^title:[[:space:]]*/, ""); print; exit }
    ' "$file" | sed 's/^"//; s/"$//')"
    date="$(awk '
      BEGIN { in_fm = 0 }
      /^---$/ { if (in_fm == 0) { in_fm = 1; next } else { exit } }
      in_fm == 1 && /^date:/ { sub(/^date:[[:space:]]*/, ""); print; exit }
    ' "$file" | sed 's/^"//; s/"$//')"
    category="$(awk '
      BEGIN { in_fm = 0 }
      /^---$/ { if (in_fm == 0) { in_fm = 1; next } else { exit } }
      in_fm == 1 && /^category:/ { sub(/^category:[[:space:]]*/, ""); print; exit }
    ' "$file" | sed 's/^"//; s/"$//')"

    title="${title:-N/A}"
    date="${date:-N/A}"
    category="${category:-N/A}"
    out+="- ${name} | ${date} | ${category} | ${title}"$'\n'
  done
  shopt -u nullglob
  if [[ -z "$out" ]]; then
    echo "- (none)"
  else
    printf "%s" "$out"
  fi
}

ARTICLE_INDEX="$(collect_content_index "content/articles")"
REVIEW_INDEX="$(collect_content_index "content/reviews")"
COLUMN_INDEX="$(collect_content_index "content/columns/posts")"

cat > AGENT.md <<EOF
# AGENT.md

오디오 개인 웹매거진(HomePage) 재시작/인수인계를 위한 단일 운영 문서.

## 1) 프로젝트 정체성
- 목적: 오디오 리뷰/기사/컬럼 + 멤버 커뮤니티 운영
- 스택: Next.js(App Router) + Markdown 콘텐츠 + 정적 이미지 자산
- 기준 저장소 경로: \`/Users/ykkim/Desktop/Homepage\`
- 프로덕션 도메인: \`https://audiolife.kr\`

## 2) 지금까지 작업 흐름 요약
1. 매거진 기본 구조 구축 (리뷰/기사/카테고리/태그 라우트 + 마크다운 로더)
2. SEO/배포 기반 정비 (robots, sitemap, OG, 아이콘, 도메인 리다이렉트)
3. 홈/헤더/상세 페이지 매거진형 UI 개선
4. 본문 미디어 처리 강화 (커버 추출, YouTube 임베드, 링크카드)
5. 컬럼 섹션 추가 (\`/columns\` + 컬럼 상세 라우트)
6. 검색 고도화 (헤더 검색 + 통합 검색 페이지)
7. 멤버 인증/댓글 시스템 도입 + 관리자 페이지(\`/admin\`) 구축
8. 콘텐츠/이미지 자산 지속 업데이트

## 3) 실행/운영 커맨드
- 의존성 설치: \`npm install\`
- 로컬 실행: \`npm run dev\`
- 빌드: \`npm run build\`
- 프로덕션 실행: \`npm run start\`
- 린트: \`npm run lint\`

## 4) 핵심 구조 맵
- 앱 라우트(실제 파일 기준):
${ROUTE_FILES}
- 콘텐츠 디렉토리:
  - \`content/articles/*.md\`
  - \`content/reviews/*.md\`
  - \`content/columns/posts/*.md\`
  - 컬럼 운영 문서: \`content/columns/AGENT.MD\`, \`content/columns/WRITING_GUIDE.MD\`, \`content/columns/hifi-headfi-100days-curriculum.md\`
- 이미지 자산:
  - 배너: \`public/banners/*\`
  - 기사 이미지: \`public/posts/articles/<slug>/*\`
  - 리뷰 이미지: \`public/posts/reviews/<slug>/*\`
  - 컬럼 이미지: \`public/posts/columns/*\`
- 콘텐츠 파서 핵심: \`lib/content.ts\`

## 5) 콘텐츠 작성 규격(재시작 시 필수)
- 프론트매터 필수 키: \`title\`, \`date\`, \`excerpt\`, \`category\`, \`tags\`
- 선택 키: \`coverImage\`, \`heroTextColor\`
- 파일명 규칙: \`slug.md\` (URL slug로 그대로 사용)
- 본문 규칙:
  - 첫 이미지가 있으면 커버 후보로 자동 추출
  - 본문의 단독 YouTube URL은 iframe 임베드로 변환
  - 본문의 단독 일반 URL은 링크카드(미리보기)로 변환 시도

## 6) 기능/동작 포인트
- 홈(\`app/page.tsx\`): 최신 포스트 Hero + 리뷰/기사 + 최신 컬럼 스트립
- 상세(\`app/articles/[slug]/page.tsx\`, \`app/reviews/[slug]/page.tsx\`, \`app/columns/[slug]/page.tsx\`): 본문 + 멤버 댓글 + 최근 글
- 검색(\`app/search/page.tsx\` + \`components/HeaderSearch.tsx\`): 리뷰/기사/컬럼 통합 검색
- 댓글(\`components/MemberComments.tsx\`): 로그인 사용자 댓글 작성 + 관리자 검수 플로우
- 인증/권한(\`lib/auth.ts\`, \`app/api/auth/[...nextauth]/route.ts\`): 멤버 인증 + 관리자 권한
- 관리자(\`app/admin/*\`, \`app/api/admin/*\`): 댓글/이메일/회원 관리
- 도메인 정책(\`middleware.ts\`): \`www.audiolife.kr\` -> \`audiolife.kr\` 308 리다이렉트

## 7) 현재 콘텐츠 인덱스
- Articles (${ARTICLE_COUNT}):
${ARTICLE_INDEX}
- Reviews (${REVIEW_COUNT}):
${REVIEW_INDEX}
- Columns (${COLUMN_COUNT}):
${COLUMN_INDEX}

## 8) 재시작 체크리스트
1. \`npm install\` 후 \`npm run dev\` 실행
2. \`AGENT.md\`의 "현재 상태"와 "최근 커밋"으로 마지막 작업 지점 확인
3. 컬럼 작성 시 \`content/columns/AGENT.MD\` -> \`.../WRITING_GUIDE.MD\` -> \`.../hifi-headfi-100days-curriculum.md\` 순으로 확인
4. 새 글 작성 시 \`content/articles/*.md\` / \`content/reviews/*.md\` / \`content/columns/posts/*.md\` + \`public/posts/.../\` 이미지 동시 반영
5. 인증/댓글 기능 수정 시 \`app/api/*\`, \`lib/auth.ts\`, \`prisma/schema.prisma\` 영향 범위 확인
6. UI 변경 시 \`app/globals.css\`와 해당 페이지 컴포넌트 동시 확인
7. 배포 전 \`npm run build\`로 라우팅/마크다운/타입 오류 확인

## 9) 자동 반영(실시간 운영)
- 자동 갱신 스크립트: \`scripts/update-agent-md.sh\`
- Git 훅 연동:
  - \`pre-commit\`: 커밋 전에 AGENT.md 갱신 후 자동 스테이징
  - \`post-commit\`: 커밋 직후 AGENT.md 다시 갱신(최신 HEAD 정보 반영)
  - \`post-merge\`: 머지 직후 AGENT.md 갱신
  - \`post-checkout\`: 브랜치 이동/체크아웃 후 AGENT.md 갱신
- 훅 경로 설정: \`git config core.hooksPath .githooks\`
- 수동 갱신: \`bash scripts/update-agent-md.sh\`

---

## 10) 현재 상태 (자동 갱신)
- 업데이트 시각: ${NOW}
- 현재 브랜치: ${BRANCH}
- 마지막 커밋: ${LAST_COMMIT}
- 콘텐츠 개수: articles=${ARTICLE_COUNT}, reviews=${REVIEW_COUNT}, columns=${COLUMN_COUNT}

### 워킹트리 상태
${WORKTREE_STATUS}

### 최근 커밋 (최신 30개)
${RECENT_COMMITS}
EOF
