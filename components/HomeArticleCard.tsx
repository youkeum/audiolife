"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, type ReactNode } from "react";

export default function HomeArticleCard({ href, className, children }: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  const link = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const card = link.current;
    const text = card?.firstElementChild;
    const image = card?.querySelector("img");
    if (!card || !text || !image) return;

    const desktop = window.matchMedia("(min-width: 801px)");
    let measuredWidth = 0;

    const fitPhoto = () => {
      const width = Number(image.getAttribute("width")) || image.naturalWidth;
      const height = Number(image.getAttribute("height")) || image.naturalHeight;
      if (!desktop.matches || !width || !height) {
        card.style.removeProperty("--article-photo-width");
        return;
      }

      const ratio = width / height;
      card.style.setProperty("--article-photo-ratio", String(ratio));
      const gap = parseFloat(getComputedStyle(card).columnGap);
      const maxPhotoWidth = card.getBoundingClientRect().width - gap - 175;
      let photoWidth = 0;
      // Giving the photo width can add lines to the text, so measure again until both fit.
      for (let attempt = 0; attempt < 16; attempt++) {
        card.style.setProperty("--article-photo-width", `${photoWidth}px`);
        const nextWidth = text.getBoundingClientRect().height * ratio;
        if (Math.abs(nextWidth - photoWidth) < 0.1) return;
        if (nextWidth > maxPhotoWidth) break;
        photoWidth = nextWidth;
      }
      card.style.removeProperty("--article-photo-width");
    };

    const observer = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width === measuredWidth) return;
      measuredWidth = entry.contentRect.width;
      fitPhoto();
    });
    observer.observe(card);
    desktop.addEventListener("change", fitPhoto);
    document.fonts.addEventListener("loadingdone", fitPhoto);
    image.addEventListener("load", fitPhoto);

    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", fitPhoto);
      document.fonts.removeEventListener("loadingdone", fitPhoto);
      image.removeEventListener("load", fitPhoto);
    };
  }, []);

  return <Link ref={link} href={href} className={className}>{children}</Link>;
}
