import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Thanh-Loi Hoang — cloud-native infrastructure for AI/ML";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          color: "#ededed",
        }}
      >
        <div style={{ width: 96, height: 8, background: "#3b82f6", borderRadius: 4, marginBottom: 40 }} />
        <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: "-0.02em" }}>Thanh-Loi Hoang</div>
        <div style={{ fontSize: 34, color: "#a1a1aa", marginTop: 24, lineHeight: 1.4 }}>
          Cloud-native infrastructure for AI/ML — Kubernetes, MLOps, network performance
        </div>
        <div style={{ fontSize: 26, color: "#52525b", marginTop: 40 }}>DCNLab · Soongsil University · Seoul</div>
      </div>
    ),
    size
  );
}
