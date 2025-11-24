"use client";

import React from "react";

type CurvedFrameProps = {
  url: string;
  frameSrc?: string; // optional PNG with transparent center
};

export default function CurvedFrame({ url, frameSrc = "/images/curved-frame.png" }: CurvedFrameProps) {
  return (
    <div className="relative w-full mx-auto aspect-video">
      {/* Video */}
      <iframe
        src={url}
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
        title="Curved TV"
      />
      {/* Curved PNG overlay (transparent center) */}
      <img
        src={frameSrc}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full select-none object-fill"
      />
    </div>
  );
}
