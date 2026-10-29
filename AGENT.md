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
- app/categories/[category]/page.tsx
- app/columns/[slug]/page.tsx
- app/columns/page.tsx
- app/globals.css
- app/home.module.css
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
- Articles (82):
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
- broen.md | 2026-07-09 | NETWORK | 페럼(Ferrum)의 네트워크 트랜스포트, 브로엔(Broen)
- buds4pro.md | 2026-02-26 | IEM | 삼성 갤럭시 버즈4 프로
- buf.md | 2026-04-30 | ACC | Schiit Buf
- cadentia3.md | 2026-04-15 | SPEAKER | Audio First Designs Cadentia 3
- chimera.md | 2026-05-12 | EARPHONE | 캠프파이어 오디오 키메라(Chimera)
- designone.md | 2026-05-20 | CDP | YBA 디자인 원(Design One)
- dragonflycopper.md | 2026-06-05 | USB DAC | 오디오퀘스트 드래곤플라이 코퍼(Dragonfly Copper)
- elegan.md | 2026-07-25 | SPEAKER | 쿼드(QUAD) Elegan1 & 2
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
- naver-224363090008.md | 2026-07-30 | SPEAKER | 소리를 형상으로, KEF LS LUXE
- naver-224367863183.md | 2026-08-04 | DAP | 아스텔앤컨 PD5 발표
- naver-224372804331.md | 2026-08-09 | DAP | 홍콩 AV쇼에 등장한 PD5 실물 사진
- naver-224374834566.md | 2026-08-11 | HEADPHONE | 보스 QC 2세대, 보급형인데? 응, 가격이 깡패야.
- naver-224374902431.md | 2026-08-11 | DAP | 아스텔앤컨 가격 인상 예정(10월 1일부터)
- naver-224374981970.md | 2026-08-11 | AMP | 출시 일주일 만에 2000대가 넘게 팔린 모노 앰프
- naver-224378620276.md | 2026-08-14 | AMP | 피오가 슬슬 하이파이 시장도 넘보고 있습니다. EA13 진공관 앰프 출시
- naver-224379375769.md | 2026-08-15 | DAC | 라이브(LAiV) 하모니 DAC2가 나왔습니다.
- naver-224381436762.md | 2026-08-17 | TURNTABLE | 과연 무슨 제품일까요? 에소테릭 티저 이미지
- naver-224383199490.md | 2026-08-19 | EVENT | 11월에 올해 첫 국내 하이파이 오디오쇼가 열립니다.
- naver-224385283258.md | 2026-08-21 | EARPHONE | 젠하이저 MTW5, 드디어 무선 이어폰도 배터리 교체가 가능합니다.
- naver-224386373319.md | 2026-08-22 | TURNTABLE | 에소테릭 티저는 역시나 턴테이블이었습니다.
- naver-224402934753.md | 2026-09-06 | DAP | SP4000 1.04 펌웨어 업데이트
- naver-224403581476.md | 2026-09-07 | MUSIC | CD의 조용한 진격
- naver-224407747173.md | 2026-09-11 | EVENT | 캔잼 서울 일정 공개..?
- naver-224408823238.md | 2026-09-11 | DAC | iFi는 버브라운을 참 좋아해요. iDSD GR2
- naver-224412176280.md | 2026-09-15 | ACC | 이런 케이블이 나올 때가 됐지, iFi GO 케이블
- naver-224420912986.md | 2026-09-23 | DAC | YBA에서 만든 포터블 DAC/AMP, VIBE P1
- naver-224426969963.md | 2026-09-30 | ACC | 스피커의 좌우 진동과 전후 진동, IsoAcoustics 가이아 네오
- naver-224430981622.md | 2026-10-04 | DAC | 아니, 일반판 출시한 지 얼마나 됐다고.. iDSD GR2 MT
- naver-224440431483.md | 2026-10-13 | DAP | 잘 만든 폼팩터는 언제 봐도 질리지 않는다. 포시 오디오 네오(Neo)
- naver-224441374375.md | 2026-10-14 | TURNTABLE | 레가(rega)의 새로운 엔트리 턴테이블, 리플레이(Replay)
- naver-224442777680.md | 2026-10-15 | TURNTABLE | 캠브리지 오디오에서도 턴테이블이 나왔습니다. 스피라(Spira)
- naver-224443570659.md | 2026-10-16 | DAP | 소니 신형 워크맨 NW-WM1ZM3·WM1AM3·ZX900 발표
- naver-224446425962.md | 2026-10-19 | SOFTWARE | 구형 안드로이드 스마트폰을 플레이어로, 리톤(reTONE)
- naver-224447583798.md | 2026-10-20 | EVENT | 2026 로이코 레코드페어
- naver-224448842071.md | 2026-10-21 | BLUETOOTH | 드디어 블루투스에도 고음질, 무손실 '표준'이 생기네요
- naver-224449849005.md | 2026-10-22 | STREAMING | BluOS에 애플 뮤직이 들어왔습니다만, 기대와는 다릅니다.
- naver-224450036679.md | 2026-10-22 | HEADPHONE | 보스(BOSE), 이번엔 스컬캔디를 인수했습니다.
- naver-224452121364.md | 2026-10-24 | EARPHONE | 베릴륨에서 마그네슘으로, 다시 돌아온 파이널 A8000 DC
- naver-224457219933.md | 2026-10-29 | HEADPHONE | 아담 오디오에서 만든 오픈형 플래그십 헤드폰, H715 레퍼런스
- naver-224457988317.md | 2026-10-29 | HEADPHONE | 헤드파이에서의 클래식이란, 오디오테크니카 ATH-AWX7000
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
- Reviews (31):
- RS275.md | 2026-03-03 | HEADPHONE | 젠하이저 RS275
- ap80promax.md | 2026-07-28 | DAP | 하이디즈 AP80 PRO MAX
- arranger.md | 2026-05-06 | HEADPHONE | 오스트리안 오디오 어레인저(Arranger)
- cadentia3.md | 2026-04-30 | SPEAKER | Audio First Designs Cadentia3
- cambridgelr.md | 2026-03-06 | SPEAKER | 캠브리지오디오 L/R 북셸프 스피커
- glv.md | 2026-02-01 | TURNTABLE | 턴테이블과 관련한 재미있는 경험들
- hc5.md | 2026-02-18 | DAC | 이게... 되네? 아스텔앤컨 HC5
- naver-224366993184.md | 2026-08-03 | SOFTWARE | 윈앰프(WINAMP)가 아직 살아 있었군요.
- naver-224373356270.md | 2026-08-09 | SOFTWARE | amoenus externus, 쓸 만한 가상 음장 프로그램
- naver-224376399580.md | 2026-08-12 | HEADPHONE | 저는 마크레빈슨에 한 표요. 무선 헤드폰의 블루투스 코덱 지원 문제
- naver-224378988107.md | 2026-08-14 | DAP | 플래그십의 바탕 위에 더해진 세 가지 진공관의 질감, 아스텔앤컨 SP4000T & 클라루스
- naver-224384249293.md | 2026-08-20 | STREAMING | 프레스토 뮤직 스트리밍 서비스만의 장점은 무엇일까
- naver-224394610014.md | 2026-08-30 | DAC | 램피제이터의 새로운 플래그십 DAC, 아프로디테 DAC를 듣고 왔습니다.
- naver-224397859686.md | 2026-09-01 | ACC | 이어팁은 소리를 얼마나 바꿀까, 엘로이트 벨벳 3종 비교
- naver-224398517959.md | 2026-09-02 | SOFTWARE | 라이소닉(Lysoniq) 사용기: 애플뮤직 원격 조작
- naver-224412887902.md | 2026-09-15 | EARPHONE | 유저가 노력할수록 보답하는 이어폰, 브리즈 오디오 이부키
- naver-224415413435.md | 2026-09-17 | HEADPHONE | 프로와 컨슈머의 경계를 허물다 - 오디지 MM-520
- naver-224429208802.md | 2026-10-02 | DAC | 편리함과 음질의 접점, 타임이어 BTE-9 & ODA 이오스(AEOS)
- naver-224433470187.md | 2026-10-06 | EARPHONE | 화려함보다는 정교함을, 캠프파이어 오디오 키메라
- naver-224437065078.md | 2026-10-10 | LISTENING SPACE | 고양 천변풍경 청음실 방문기: LP와 아날로그 시스템
- naver-224441108934.md | 2026-10-14 | DAP | 익숙한 아스텔앤컨을 더 작게, 아스텔앤컨 PD5
- naver-224452622193.md | 2026-10-24 | SPEAKER | ATC EL50 애니버서리, 프로와 컨슈머의 공통적인 지향점
- naver-224457085970.md | 2026-10-28 | SPEAKER | 보다 젊어진 캠브리지오디오, L/R M, X & 스파이라(Spira)
- naver-224458368816.md | 2026-10-29 | EARPHONE | 1DD로 끌어올린 음악적 쾌감, 페이스 오디오 E1000
- pd20.md | 2026-04-10 | DAP | 조작하는 맛이 있다. 아스텔앤컨 PD20
- pinkfaun.md | 2026-03-07 | DIGITAL TRANSPORT | 핑크펀(Pink Faun) 듀얼 울트라 2.16
- r10arrete.md | 2026-03-15 | SPEAKER | 오디오벡터 R10 Arrete
- sonusfaber.md | 2026-05-24 | SPEAKER | 소너스파베르 아이다2 & 아마티 수프림
- stella.md | 2026-03-11 | IEM | 아스텔앤컨 & 볼크오디오 스텔라
- taoc.md | 2026-03-01 | AUDIO RACK | 타옥 ASR III & CSR
- yena.md | 2026-07-23 | AV | 돌비 애트모스와 다른 오로3D의 매력
- Columns (32):
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
- luminate.md | 2026-07-20 | COLUMN | CD 판매량으로 확인 가능한 BTS의 위상
- naver-224448855807.md | 2026-10-21 | COLUMN | 피오의 '클래스 A'라는 이름표 - 마케팅 표현, 어디까지 허용할 수 있을까
- naver-224451745572.md | 2026-10-24 | COLUMN | 액티보 BR01 리모컨 키매퍼 앱(안드로이드)

## 8) 재시작 체크리스트
1. `npm install` 후 `npm run dev` 실행
2. `git status --short`와 `git log -1 --oneline`으로 마지막 작업 지점 확인
3. 컬럼 작성 시 `content/columns/AGENT.MD` -> `.../WRITING_GUIDE.MD` -> `.../hifi-headfi-100days-curriculum.md` 순으로 확인
4. 새 글 작성 시 `content/articles/*.md` / `content/reviews/*.md` / `content/columns/posts/*.md` + `public/posts/.../` 이미지 동시 반영
5. 인증/댓글 기능 수정 시 `app/api/*`, `lib/auth.ts`, `prisma/schema.prisma` 영향 범위 확인
6. UI 변경 시 `app/globals.css`와 해당 페이지 컴포넌트 동시 확인
7. 배포 전 `npm run build`로 라우팅/마크다운/타입 오류 확인

## 9) 자동 반영(실시간 운영)
- 자동 갱신 스크립트: `scripts/update-agent-md.sh`
- Git 훅 연동:
  - `pre-commit`: 커밋 전에 AGENT.md 갱신 후 자동 스테이징
  - `post-commit`: 커밋 직후 AGENT.md 다시 갱신
  - `post-merge`: 머지 직후 AGENT.md 갱신
  - `post-checkout`: 브랜치 이동/체크아웃 후 AGENT.md 갱신
- 훅 경로 설정: `git config core.hooksPath .githooks`
- 수동 갱신: `bash scripts/update-agent-md.sh`

---

## 10) 현재 상태 확인
- 콘텐츠 개수: articles=82, reviews=31, columns=32
- 현재 브랜치: `git branch --show-current`
- 마지막 커밋: `git log -1 --oneline`
- 워킹트리 상태: `git status --short`
