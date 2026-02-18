import { ImageResponse } from "next/og";

export const size = {
  width: 220,
  height: 220
};

export const contentType = "image/png";

export default function Logo() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5"
        }}
      >
        <div
          style={{
            width: 204,
            height: 204,
            borderRadius: 999,
            border: "4px solid #3b3c44",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial",
            fontWeight: 500,
            fontSize: 108,
            lineHeight: 1,
            color: "#3b3c44",
            background: "#f7f7f7"
          }}
        >
          <span style={{ color: "#d97536", marginRight: 2 }}>A</span>
          <span>L</span>
        </div>
      </div>
    ),
    size
  );
}
