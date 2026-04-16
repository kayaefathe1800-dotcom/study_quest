import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "STUDY QUEST - 勉強で強くなれ！",
    short_name: "STUDY QUEST",
    description: "中学生向け勉強ゲームアプリ。問題を解いてキャラを育てよう！",
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#facc15",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["education", "games"],
    lang: "ja",
  };
}
