import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";
import { SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://audiolife.kr"),
  title: {
    default: "AudioLife",
    template: "%s | AudioLife"
  },
  description: SITE_DESCRIPTION,
  keywords: ["오디오", "헤드폰", "스피커", "DAC", "앰프", "오디오 리뷰", "오디오 기사", "오디오 컬럼"],
  openGraph: {
    title: "AudioLife",
    description: SITE_DESCRIPTION,
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
    description: SITE_DESCRIPTION,
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
          <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
          <SiteHeader />
          <main id="main-content" className="container">{children}</main>
          <footer>
            <div className="container site-footer"><span>© {new Date().getFullYear()} AudioLife</span><nav aria-label="하단 메뉴"><a href="/about">소개·문의</a><a href="https://blog.naver.com/audiolife-" target="_blank" rel="noreferrer">네이버 블로그</a><a href="https://www.youtube.com/@portablewave" target="_blank" rel="noreferrer">YouTube</a></nav></div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
