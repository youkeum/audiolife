"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HeaderSearch from "@/components/HeaderSearch";
import TopAuthMenu from "@/components/TopAuthMenu";
import { SITE_NAVIGATION } from "@/lib/site";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`topbar ${styles.header}`} onKeyDown={(event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    }}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link className="brand" href="/" aria-label="audiolife 홈">
            <img className={styles.wordmark} src="/brand/audiolife-wordmark-v3.webp" alt="audiolife" width={960} height={320} />
          </Link>
        </div>
        <nav className={styles.desktop} aria-label="주요 메뉴">
          {SITE_NAVIGATION.map((item) => (
            <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={styles.actions}>
          <div className={styles.desktopAuth}><TopAuthMenu /></div>
          <HeaderSearch />
          <button ref={trigger} type="button" className={styles.toggle} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>
            {open ? "닫기" : "메뉴"}
          </button>
        </div>
        <nav id="mobile-navigation" className={styles.mobile} hidden={!open} aria-label="모바일 메뉴">
          {SITE_NAVIGATION.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>
              <strong>{item.label}</strong><span>{item.description}</span>
            </Link>
          ))}
          <div className={styles.mobileAuth}><TopAuthMenu /></div>
        </nav>
      </div>
    </header>
  );
}
