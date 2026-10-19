import Image from "next/image";
import styles from "./PostImage.module.css";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  contain?: boolean;
};

export default function PostImage({ src, alt, className = "", sizes = "(max-width: 640px) 94vw, (max-width: 980px) 46vw, 380px", priority = false, contain = false }: Props) {
  return (
    <span className={`${styles.frame} ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={75}
        unoptimized={!src.startsWith("/") || src.startsWith("//")}
        style={{ objectFit: contain ? "contain" : "cover" }} />
    </span>
  );
}
