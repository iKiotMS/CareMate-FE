"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

export function CinematicIntro() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  const play = () => {
    setStarted(true);
    // Đợi state cập nhật rồi phát
    requestAnimationFrame(() => {
      videoRef.current?.play();
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] bg-black aspect-video">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster="/videos/intro-poster.jpg"
        controls={started}
        playsInline
        preload="metadata"
        onEnded={() => setStarted(false)}
      >
        <source src="/videos/intro.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ phát video.
      </video>

      {/* Lớp phủ poster + nút phát */}
      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label="Phát video giới thiệu CareMate"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
        >
          <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/30" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-white/90 text-[var(--color-primary)] shadow-xl transition-transform duration-300 group-hover:scale-110">
            <Play className="w-9 h-9 translate-x-0.5 fill-current" />
          </span>
          <span className="relative text-lg font-semibold text-white drop-shadow">
            Video giới thiệu CareMate
          </span>
        </button>
      )}
    </div>
  );
}
