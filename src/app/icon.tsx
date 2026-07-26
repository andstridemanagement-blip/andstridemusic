import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
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
          background: "#000000",
          color: "#ffffff",
          border: "1px solid rgba(255,255,255,0.2)",
          fontSize: 30,
          fontWeight: 900,
          fontFamily: "Arial",
        }}
      >
        A
      </div>
    ),
    size
  );
}