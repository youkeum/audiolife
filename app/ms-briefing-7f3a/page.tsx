import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MyScheduler Briefing",
  robots: {
    index: false,
    follow: false
  }
};

export default function MsBriefingPage() {
  return (
    <section className="private-sheet private-grid">
      <div className="private-overview">
        <div>
          <h1>MyScheduler</h1>
          <p>
            MyScheduler는 캘린더, 메모, 포스트잇 할 일을 하나로 묶어 하루를 정리하고 실행까지 이어주는 앱입니다.
            일정은 캘린더에서 확인하고, 생각은 메모로 남기고, 실행할 일은 포스트잇 체크리스트로 관리하세요.
          </p>

          <h2>[주요 기능]</h2>

          <h3>1) 캘린더 관리</h3>
          <ul>
            <li>월/주/목록 보기 지원</li>
            <li>일정 흐름을 한눈에 확인</li>
            <li>필요한 시점에 빠르게 추가/수정</li>
          </ul>

          <h3>2) 메모 + 할 일 통합</h3>
          <ul>
            <li>메모와 체크리스트를 함께 관리</li>
            <li>포스트잇처럼 가볍게 항목 추가/완료</li>
            <li>중요한 일은 항목 단위로 집중 관리</li>
          </ul>

          <h3>3) 개별 할 일 알림</h3>
          <ul>
            <li>할 일 관리에서 항목별 알림 설정</li>
            <li>원하는 날짜/시간 지정 가능</li>
            <li>설정된 알림 정보(일시)를 앱 내에서 바로 확인</li>
          </ul>

          <h3>4) 보관함(Archive) 정리</h3>
          <ul>
            <li>폴더 단위로 기록 보관</li>
            <li>그리드/리스트 보기 모드 전환</li>
            <li>폴더별 커버 이미지, 테마 색상 적용</li>
          </ul>

          <p className="private-closing">
            MyScheduler는 기록 -&gt; 계획 -&gt; 실행 -&gt; 보관의 흐름을 끊기 않게 연결하는 데 집중했습니다.
            <br />
            복잡한 기능보다, 매일 실제로 쓰기 쉬운 정리 경험을 원한다면 MyScheduler로 시작해보세요.
          </p>
        </div>

        <aside className="private-phone-wrap" aria-label="MyScheduler App Preview">
          <div className="private-phone">
            <img src="/posts/common/myscheduler.png?v=ms-briefing-2" alt="MyScheduler app preview" />
          </div>
        </aside>
      </div>

      <p className="private-footer-note">Privacy Policy | youkeum@gmail.com</p>
    </section>
  );
}
