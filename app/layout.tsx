import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import HeaderSearch from "@/components/HeaderSearch";
import TopAuthMenu from "@/components/TopAuthMenu";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://audiolife.kr"),
  title: {
    default: "AudioLife",
    template: "%s | AudioLife"
  },
  description: "AudioLife는 하이파이·헤드파이 리뷰, 오디오 업계 기사, 입문부터 심화까지의 오디오 컬럼을 제공하는 한국어 오디오 웹매거진입니다.",
  alternates: {
    canonical: "https://audiolife.kr"
  },
  keywords: ["오디오", "헤드폰", "스피커", "DAC", "앰프", "오디오 리뷰", "오디오 기사", "오디오 컬럼"],
  openGraph: {
    title: "AudioLife",
    description: "AudioLife는 하이파이·헤드파이 리뷰, 오디오 업계 기사, 입문부터 심화까지의 오디오 컬럼을 제공하는 한국어 오디오 웹매거진입니다.",
    url: "https://audiolife.kr",
    siteName: "AudioLife",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AudioLife - 오디오 경험을 기록하는 아카이브"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AudioLife",
    description: "AudioLife는 하이파이·헤드파이 리뷰, 오디오 업계 기사, 입문부터 심화까지의 오디오 컬럼을 제공하는 한국어 오디오 웹매거진입니다.",
    images: ["/opengraph-image"]
  },
  verification: {
    other: {
      "naver-site-verification": "f95dab4e0cff64d9ef52c1d71323f7496e867ef8"
    }
  },
  icons: {
    icon: [{ url: "/logo?v=2" }],
    shortcut: [{ url: "/logo?v=2" }],
    apple: [{ url: "/logo?v=2" }]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;700&family=Noto+Sans+KR:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <header className="topbar">
            <div className="container topbar-container topbar-wrap">
              <div className="brand-wrap">
                <a className="brand" href="/">
                  <img className="brand-logo" src="/logo" alt="AudioLife logo" />
                  AudioLife
                </a>
                <p className="brand-subcopy">
                  하이파이·헤드파이 리뷰, 오디오 업계 기사, 오디오 컬럼을 제공하는 한국어 오디오 웹매거진
                </p>
              </div>
              <nav className="nav" aria-label="주요 메뉴">
                <div className="nav-links">
                  <a href="/reviews">REVIEWS</a>
                  <a href="/articles">ARTICLES</a>
                  <a href="/columns">COLUMNS</a>
                  <a href="/calendar">CALENDAR</a>
                  <a href="/about">ABOUT</a>
                </div>
                <div className="nav-utilities">
                  <TopAuthMenu />
                  <HeaderSearch />
                </div>
              </nav>
            </div>
          </header>
          <main className="container">{children}</main>
          <footer>
            <div className="container">© {new Date().getFullYear()} AudioLife. Built for audiolife.kr</div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
