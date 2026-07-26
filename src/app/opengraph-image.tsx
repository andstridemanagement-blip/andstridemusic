import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "Andstride — Beats & Instrumentals";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          background: "#030303",
          color: "#ffffff",
          fontFamily: "Arial",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 700,
            height: 700,
            left: -280,
            top: -170,
            borderRadius: "50%",
            background:
              "rgba(65, 105, 180, 0.28)",
            filter: "blur(100px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 580,
            height: 580,
            right: -250,
            bottom: -280,
            borderRadius: "50%",
            background:
              "rgba(105, 60, 170, 0.18)",
            filter: "blur(100px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "70px 80px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 18,
              letterSpacing: 10,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.42)",
            }}
          >
            <span>ANDSTRIDE</span>
            <span>INDEPENDENT PRODUCER</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                fontSize: 118,
                lineHeight: 0.9,
                fontWeight: 900,
                letterSpacing: 10,
                textTransform: "uppercase",
              }}
            >
              Beats &
            </div>

            <div
              style={{
                marginTop: 12,
                fontSize: 118,
                lineHeight: 0.9,
                fontWeight: 900,
                letterSpacing: 10,
                textTransform: "uppercase",
              }}
            >
              Instrumentals
            </div>

            <div
              style={{
                marginTop: 38,
                fontSize: 20,
                letterSpacing: 8,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.38)",
              }}
            >
              DARK TEXTURES • CINEMATIC SOUND • LATE-NIGHT ENERGY
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 16,
              letterSpacing: 7,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            <span>LISTEN • LICENSE • CREATE</span>
            <span>ANDSTRIDE</span>
          </div>
        </div>
      </div>
    ),
    size
  );
}