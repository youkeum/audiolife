import { ImageResponse } from "next/og";

export const size = {
  width: 256,
  height: 256
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1f1b16 0%, #91522c 100%)",
          color: "#fff"
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 999,
            border: "10px solid rgba(255,255,255,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 88,
            fontWeight: 700
          }}
        >
          A
        </div>
      </div>
    ),
    size
  );
}
