import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "audiolife — 하이파이·헤드파이 리뷰와 오디오 소식";

export default async function OpenGraphImage() {
  const wordmark = await readFile(path.join(process.cwd(), "public/brand/audiolife-wordmark-v3.png"));
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", background: "#f6f6f6", color: "#111", borderBottom: "8px solid #b51e30" }}>
      <img src={`data:image/png;base64,${wordmark.toString("base64")}`} width={1000} height={333} alt="audiolife" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ fontSize: 36, fontWeight: 700 }}>Audio Review &amp; Editorial Archive</div>
        <div style={{ fontSize: 25, color: "#555" }}>Headphones, Speakers, DACs, Amps — Real-world listening notes</div>
      </div>
    </div>,
    size
  );
}
