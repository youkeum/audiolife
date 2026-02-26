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
          background: "#f5f5f5"
        }}
      >
        <div
          style={{
            width: 192,
            height: 192,
            borderRadius: 999,
            border: "5px solid #3b3c44",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial",
            fontSize: 98,
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
