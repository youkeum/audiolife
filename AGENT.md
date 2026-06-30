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
- Articles (48):
- 1000x.md | 2026-05-14 | HEADPHONE | 소니 1000X 콜렉션(The ColleXion)
- 1000xm6.md | 2026-02-17 | IEM | 소니 WF-1000XM6 등장
- Ecoute_th2.md | 2026-02-12 | HEADPHONE | Écoute TH2
- SL1500CS.md | 2026-02-24 | TURNTABLE | 테크닉스 SL-1500CS
- a550.md | 2026-04-25 | HEADPHONE | 코스(KOSS) A/550
- ab92.md | 2026-03-13 | HEADPHONE | ARCTEC AB92
- aimusic.md | 2026-06-30 | MUSIC | AI 시대의 스트리밍과 저작권 정책
- airpodmax2.md | 2026-03-17 | HEADPHONE | 에어팟 맥스2
- applebluetooth.md | 2026-05-01 | BLUETOOTH | 블루투스 코덱에 대한 애플의 입장
- arnika.md | 2026-02-20 | HEADPHONE | 헤드폰에 들어 있는 유해 물질들
- arta.md | 2026-06-04 | HEADPHONE | 메제(MEZE) 아르타(ARTA)
- autobiography.md | 2026-04-24 | SPEAKER | 윌슨 오디오 오토바이오그라피(Autobiography)
- autoeq.md | 2026-06-02 | HIFI | SVS AUTO EQ
- buds4pro.md | 2026-02-26 | IEM | 삼성 갤럭시 버즈4 프로
- buf.md | 2026-04-30 | ACC | Schiit Buf
- cadentia3.md | 2026-04-15 | SPEAKER | Audio First Designs Cadentia 3
- chimera.md | 2026-05-12 | EARPHONE | 캠프파이어 오디오 키메라(Chimera)
- designone.md | 2026-05-20 | CDP | YBA 디자인 원(Design One)
- dragonflycopper.md | 2026-06-05 | USB DAC | 오디오퀘스트 드래곤플라이 코퍼(Dragonfly Copper)
- evoone.md | 2026-05-15 | DAP | 에보아리아(EvoAria) 에보원(Evo One)
- final_dx10000cl.md | 2026-02-12 | HEADPHONE | final DX10000CL
- fosi_s3.md | 2026-03-28 | STREAMER | 포시 오디오 S3
- golink2max.md | 2026-06-06 | USB DAC | iFi 고 링크2 맥스(GO Link 2 Max)
- hiplay.md | 2026-05-06 | NETWORK | 무선 전송에 대한 화웨이의 대답, 하이플레이(HiPlay)
- ibuki.md | 2026-04-23 | EARPHONE | 브리즈 오디오 이부키(IBUKI)
- k1k.md | 2026-04-20 | HEADPHONE | APOS K1K
- liberty5pro.md | 2026-05-28 | EARPHONE | 앤커 사운드코어 리버티5 시리즈
- lunisse.md | 2026-05-20 | EARPHONE | 미아톤 루니스(Lunisse)
- ma2375.md | 2026-06-04 | HIFI | 매킨토시 진공관 인티앰프, MA2375
- meze_astru.md | 2026-03-07 | IEM | Meze Astru
- mg200.md | 2026-05-16 | EARPHONE | 샨링 다크스페이스 MG200
- michiprestige.md | 2026-03-19 | HIFI | 로텔 미치 프레스티지
- momentum5.md | 2026-05-26 | HEADPHONE | 젠하이저 모멘텀5 와이어리스
- neoidsd3.md | 2026-02-19 | DAC | ifi NEO iDSD3
- noble_luban.md | 2026-04-14 | EARPHONE | 노블 오디오 루반(Lu Ban)
- nodeaudioatom.md | 2026-03-21 | SPEAKER | Node Audio Atom
- oae2.md | 2026-03-06 | HEADPHONE | 그렐 오디오 OAE2 출격 준비
- pd20.md | 2026-02-27 | IEM | 아스텔앤컨 PD20
- quartet.md | 2026-05-22 | HIFI | 코드 쿼르텟 업스케일러(Quartet Upscaler)
- reskin.md | 2026-05-07 | HEADPHONE | 오디지 멕스웰2 리스킨(ReSkin)
- roon.md | 2026-05-15 | NETWORK | roon 11주 이용권 $1
- s400mk3.md | 2026-03-16 | SPEAKER | Buchardt Audio S400 MK3
- s550.md | 2026-03-04 | HEADPHONE | 그라도 S550
- sonova.md | 2026-03-24 | HEADPHONE | 소노바, 젠하이저 매각 발표
- sp4000t.md | 2026-06-01 | DAP | 아스텔앤컨 SP4000T
- trailliiultra.md | 2026-06-14 | EARPHONE | 오리올루스 트라일리 울트라 IEM 시스템
- vcemini.md | 2026-03-25 | VINYL | 프로젝트 오디오 VC-E mini
- wiimbar.md | 2026-06-04 | SOUNDBAR | 윔(WiiM) 바(Bar)
- Reviews (12):
- RS275.md | 2026-03-03 | HEADPHONE | 젠하이저 RS275
- arranger.md | 2026-05-06 | HEADPHONE | 오스트리안 오디오 어레인저(Arranger)
- cadentia3.md | 2026-04-30 | SPEAKER | Audio First Designs Cadentia3
- cambridgelr.md | 2026-03-06 | SPEAKER | 캠브리지오디오 L/R 북셸프 스피커
- glv.md | 2026-02-01 | TURNTABLE | 턴테이블과 관련한 재미있는 경험들
- hc5.md | 2026-02-18 | DAC | 이게... 되네? 아스텔앤컨 HC5
- pd20.md | 2026-04-10 | DAP | 조작하는 맛이 있다. 아스텔앤컨 PD20
- pinkfaun.md | 2026-03-07 | DIGITAL TRANSPORT | 핑크펀(Pink Faun) 듀얼 울트라 2.16
- r10arrete.md | 2026-03-15 | SPEAKER | 오디오벡터 R10 Arrete
- sonusfaber.md | 2026-05-24 | SPEAKER | 소너스파베르 아이다2 & 아마티 수프림
- stella.md | 2026-03-11 | IEM | 아스텔앤컨 & 볼크오디오 스텔라
- taoc.md | 2026-03-01 | AUDIO RACK | 타옥 ASR III & CSR
- Columns (29):
- headphonestycolumn1.md | 2026-03-31 | COLUMN | 당연한 듯, 당연하지 않은 오디오파일을 위한 조언들(1)
- headphonestycolumn2.md | 2026-04-06 | COLUMN | 당연한 듯, 당연하지 않은 오디오파일을 위한 조언들(2)
- headphonestycolumn3.md | 2026-04-08 | COLUMN | 당연한 듯, 당연하지 않은 오디오파일을 위한 조언들(3)
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
- hifi-headfi-100days-day21.md | 2026-03-18 | COLUMN | [100일 프로젝트] Day 21 - 헤드폰 타입: 오픈백, 클로즈드, 세미오픈
- hifi-headfi-100days-day22.md | 2026-03-20 | COLUMN | [100일 프로젝트] Day 22 - IEM 착용과 실링: 최고의 소리를 위한 맞춤
- hifi-headfi-100days-day23.md | 2026-03-22 | COLUMN | [100일 프로젝트] Day 23 - 헤드폰 드라이버 1: 다이내믹 드라이버
- hifi-headfi-100days-day24.md | 2026-03-24 | COLUMN | [100일 프로젝트] Day 24 - 헤드폰 드라이버 2: 플래너 마그네틱 드라이버
- hifi-headfi-100days-day25.md | 2026-03-27 | COLUMN | [100일 프로젝트] Day 25 - 헤드폰 드라이버 3: 정전형 드라이버
- hifi-headfi-100days-day26.md | 2026-03-30 | COLUMN | [100일 프로젝트] Day 26 - IEM 드라이버 종류: 다이내믹, 밸런스드 아마추어, 그리고 하이브리드
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
- 업데이트 시각: 2026-06-30 13:28:26 KST
- 현재 브랜치: main
- 마지막 커밋: 2026-06-30 | d6dcff3 | Add AI music streaming article
- 콘텐츠 개수: articles=48, reviews=12, columns=29

### 워킹트리 상태
-  M AGENT.md
- A  content/articles/ma2375.md
- A  public/posts/articles/ma2375/1.jpg
- A  public/posts/articles/ma2375/2.jpg
- A  public/posts/articles/ma2375/3.jpg

### 최근 커밋 (최신 30개)
- 2026-06-30 | d6dcff3 | Add AI music streaming article
- 2026-06-14 | 35700f2 | Add Traillii Ultra article and images
- 2026-06-06 | 931f6f7 | Add DragonFly Copper and GO Link 2 Max articles
- 2026-06-04 | fb5635a | Add Meze Arta article and images
- 2026-06-04 | 402e003 | Add WiiM Bar article and images
- 2026-06-02 | 2f7206d | Add SVS Auto EQ article and images
- 2026-06-01 | 7684be1 | Add SP4000T article and images
- 2026-05-28 | f7efbd3 | Add Liberty 5 Pro article and images
- 2026-05-26 | db5d507 | Add Momentum 5 article and images
- 2026-05-24 | d5203b8 | Add Quartet Upscaler article and images
- 2026-05-24 | 33ebfa9 | Add Sonus Faber review and images
- 2026-05-20 | 7538444 | Add Design One article and images
- 2026-05-20 | 64d4af8 | Add Lunisse article and images
- 2026-05-16 | bdd674e | Add Shanling MG200 article and images
- 2026-05-15 | ce02e1d | Add Evo One article and images
- 2026-05-15 | bfd284f | Add Roon anniversary article and image
- 2026-05-14 | e867fd7 | Add Sony 1000X article and images
- 2026-05-14 | d87c2af | Add Royco listening event and calendar image
- 2026-05-12 | 9fb8812 | Add Chimera article and images
- 2026-05-07 | 4aec380 | Add Maxwell 2 ReSkin article and images
- 2026-05-06 | da96d8e | Add HiPlay article and Arranger review
- 2026-05-01 | 9679dde | Add Apple Bluetooth article and images
- 2026-04-30 | cc7bbf4 | Add May audio event and calendar image
- 2026-04-30 | 4090a46 | Add Cadentia3 review and images
- 2026-04-30 | 5a8ccae | Add Schiit Buf article and images
- 2026-04-25 | e6fac4b | Add KOSS A/550 article and images
- 2026-04-24 | ca319a7 | Add Wilson Audio Autobiography article and images
- 2026-04-23 | 385ea33 | Add Brise Audio Ibuki article and images
- 2026-04-20 | 8eb75a4 | Add APOS K1K article and images
- 2026-04-15 | 7083930 | Add Cadentia 3 article and images
