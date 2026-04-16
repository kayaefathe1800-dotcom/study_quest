import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
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
          background: "linear-gradient(135deg, #1e3a5f 0%, #0d1b2a 100%)",
          borderRadius: "80px",
        }}
      >
        <div style={{ fontSize: 320 }}>📚</div>
      </div>
    ),
    { ...size }
  );
}
