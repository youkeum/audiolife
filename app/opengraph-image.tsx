import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          background: "linear-gradient(145deg, #fff4ea 0%, #f5f5f0 45%, #e8d5c8 100%)",
          color: "#1c1b18"
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, fontWeight: 700 }}>AUDIO LIFE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 68, lineHeight: 1.1, fontWeight: 800 }}>Audio Review & Editorial Archive</div>
          <div style={{ fontSize: 30, color: "#5f5a53" }}>Headphones, Speakers, DACs, Amps - Real-world listening notes</div>
        </div>
      </div>
    ),
    size
  );
}
