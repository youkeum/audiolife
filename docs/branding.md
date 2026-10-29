# audiolife 브랜드 자산 — 2026-10-29

## 승인 원본과 파생 자산

- 사용자가 프로젝트 루트에 둔 `exec-0cdf404a-d297-44ac-8e51-e22fa8a5a78a.png`를 실제 픽셀로 확인했다. 첫 소문자 a만 빨강, 나머지는 검정 고대비 세리프, o 안에 음파가 있는 비교판이다.
- 원본 SHA256: `f1857bc2ca3ef58d518c858d5c12f5459de4233a871f01524ba328bb1d85cee1`. 원본과 생성 원본은 보존한다.
- built-in imagegen으로 상단 큰 워드마크의 투명 배경 자산과 첫 빨간 a 아이콘을 각각 만들었다. 다른 폰트로 재입력하지 않았다. 벡터 원본은 아니며 raster PNG/WebP 자산이다.
- 생성 원본: `generated_images/exec-a5e72594-74cd-4a68-9cbf-5a37cfaad4fd.png`, `generated_images/exec-4cf81120-08e8-4859-94ff-4a0982b6c65d.png`.

## 프로젝트에서 사용하는 파일

| 자산 | 용도 |
| --- | --- |
| `/brand/audiolife-wordmark-v3.png` | 2172×724 투명 워드마크, 조직 로고·공유 이미지·기존 /logo 응답 |
| `/brand/audiolife-wordmark-v3.webp` | 960×320 헤더용 lossless WebP, 34,516 bytes |
| `/brand/audiolife-mark-v3.png` | 투명 빨간 a 생성 원본 복사본 |
| `/brand/audiolife-icon-{16,32,48,180,256,512}-v3.png` | 밝은 배경 위 빨간 a, 크기별 아이콘 |
| `/brand/audiolife-favicon-v3.ico` | 16·32·48px PNG 프레임을 담은 ICO |

아이콘 크기 변환과 PNG/ICO/WebP 패키징에는 sharp를 사용한다. 로고나 글자를 새 폰트로 다시 그리지 않는다. 헤더에는 비교판 전체나 별도 AL 표식을 넣지 않는다. 현재 밝은 헤더를 유지하며 검정 워드마크를 사용한다.

## 연결 및 캐시

- 헤더는 명시된 크기와 대체 텍스트 `audiolife`를 가진 버전 파일을 사용한다.
- 데스크톱 표시 240×60, 모바일 190×48, 370px 이하 170×44. object-fit: cover가 상하 투명 여백만 숨기며 글자 경계는 보존하는지 자산 출력으로 확인했다.
- 16/32px 파비콘, ICO와 180px Apple 아이콘에 v3 파일명을 사용한다. Next가 생성하는 `/icon`도 새 256px 아이콘이다.
- `/logo` 호환 경로는 PNG 워드마크를 제공하고 cache max-age는 3600초다. 새 소비자는 버전 파일을 직접 참조한다.
- 공유 이미지 생성 코드는 새 워드마크를 포함한다. Next의 실제 출력 OG URL에는 새 콘텐츠 해시가 붙으며, 명시적 기본 URL에도 v=3을 사용한다.
- 페이지 제목의 브랜드 접미사, 홈 제목, OG site_name, WebSite/Organization/publisher 이름과 UI 브랜드를 `audiolife`로 맞춘다. 기존 한국어 SEO 설명과 원고 내용은 보존한다.

## 검증 범위

- npm test 13개 통과, npm run build 성공(170개 정적 페이지), 콘텐츠 오류 0개.
- 생성 공개 HTML 145개에서 제목·파비콘·Apple 아이콘·헤더 대체 텍스트 확인.
- 빌드 `/logo`와 `/icon`의 PNG 바이트가 해당 자산과 동일함을 확인.
- 16/32px 아이콘, 헤더 표시 크기의 자산, 실제 ImageResponse 공유 이미지 1200×630을 열어 확인했다.
- 검수판과 공유 이미지: `.muse-tasks/brand-preview/brand-assets-check.png`, `opengraph-v3.png`.
- 로컬 서버는 앞선 EPERM 제한을 우회하지 않았다. 브라우저의 file: HTML 열기도 URL 보안 정책으로 거절되어 실제 페이지 스크린샷과 상호작용은 미검증이다. 검수판은 웹페이지 스크린샷이 아닌 자산 출력물이다.
- 이 문서 작성 시점에는 로컬 변경이며 커밋·푸시·운영 배포는 하지 않았다.

## imagegen 추출 프롬프트

워드마크:

> Use case: background-extraction. Edit target: the supplied approved audiolife logo comparison board. Produce ONE production-ready transparent PNG containing ONLY the LARGE UPPER wordmark from the board, tightly cropped with modest transparent padding (around 2% of wordmark width). Preserve that exact original artwork and letter shapes: lowercase a u d i o l i f e, first a muted deep red, all remaining letters black, the three soundwave curves inside the o. Preserve exact high-contrast serif silhouettes, spacing, proportions and details; do not redraw it in a different typeface or redesign or add anything. Remove the white/paper background including inside letter counters and between the wave curves. Exclude BOTH lower miniature examples and the dark rectangle. Output a single wide horizontal logo with truly transparent alpha, clean edges and ample native resolution (at least 2000px wide if possible). The reference is an extraction target, not inspiration.

아이콘:

> Use case: background-extraction. Input is the approved audiolife wordmark comparison board. Produce a square 1024x1024 transparent PNG icon containing ONLY the FIRST RED LOWERCASE a taken from the LARGE UPPER approved wordmark. Extract and preserve its exact serif silhouette and deep red color, including thin stroke and curved terminal. Do not substitute a font, redraw, stylize, or include udiolife, o waves, lower samples, paper texture, borders, shadows or any other mark. Center the single red a in the square, with its visible shape occupying approximately 70% of square width and height, clean high-resolution edges. All background and the interior counter must be fully transparent. It should be recognizable as the same first a from the approved logo, for a browser favicon.
