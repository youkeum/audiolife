import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://audiolife.kr"),
  title: {
    default: "AudioLife",
    template: "%s | AudioLife"
  },
  description: "오디오 리뷰와 기사 아카이브",
  alternates: {
    canonical: "https://audiolife.kr"
  },
  keywords: ["오디오", "헤드폰", "스피커", "DAC", "앰프", "오디오 리뷰", "오디오 기사"],
  openGraph: {
    title: "AudioLife",
    description: "오디오 리뷰와 기사 아카이브",
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
    description: "오디오 리뷰와 기사 아카이브",
    images: ["/opengraph-image"]
  },
  icons: {
    icon: "/icon"
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
        <header className="topbar">
          <div className="container topbar-wrap">
            <a className="brand" href="/">
              AUDIO LIFE
            </a>
            <nav className="nav" aria-label="주요 메뉴">
              <a href="/reviews">오디오 리뷰</a>
              <a href="/articles">기사</a>
              <a href="/categories/speaker">카테고리</a>
              <a href="/tags/입문">태그</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer>
          <div className="container">© {new Date().getFullYear()} AudioLife. Built for audiolife.kr</div>
        </footer>
      </body>
    </html>
  );
}
