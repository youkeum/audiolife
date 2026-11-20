import { postImageSources } from "@/lib/images";
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
      <img {...postImageSources(src, sizes)} alt={alt} className={styles.image}
        loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined}
        decoding="async" style={{ objectFit: contain ? "contain" : "cover" }} />
    </span>
  );
}
