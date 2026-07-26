import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 65% 25%, #263a66, #050505 55%)",
          color: "#ffffff",
          fontSize: 78,
          fontWeight: 900,
          fontFamily: "Arial",
          letterSpacing: "-6px",
        }}
      >
        A
      </div>
    ),
    size
  );
}