"use client";

import Image from "next/image";

type LiveTrackMapProps = {
  backgroundUrl?: string;
  backgroundAlt?: string;
  // normalized points [0..1]
  points: Array<{ num: number; x: number; y: number; colour?: string }>;
  trails?: Array<{ num: number; pts: Array<{ x: number; y: number }>; colour?: string }>;
  heightClass?: string; // e.g. "h-[280px]" or use aspect container
};

export default function LiveTrackMap({ backgroundUrl, backgroundAlt = "Track map", points, trails = [], heightClass = "aspect-video" }: LiveTrackMapProps) {
  return (
    <div className={`relative w-full ${heightClass}`}>
      {backgroundUrl ? (
        <Image src={backgroundUrl} alt={backgroundAlt} fill className="object-contain" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded" />
      )}
      {/* Trails + Markers overlay using absolute SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet">
        <g>
          {trails.map((t) => {
            if (!t.pts || t.pts.length < 2) return null;
            const path = t.pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x * 1000} ${p.y * 1000}`).join(' ');
            return (
              <path key={t.num}
                d={path}
                fill="none"
                stroke={`#${t.colour ?? '777'}`}
                strokeWidth={2}
                strokeOpacity={0.5}
              />
            );
          })}
        </g>
      </svg>
      <div className="absolute inset-0">
        {points.map((p) => (
          <div
            key={p.num}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
            title={`#${p.num}`}
          >
            <div className="relative">
              <span
                className="block h-2.5 w-2.5 rounded-full ring-1 ring-white/60 shadow"
                style={{ backgroundColor: `#${p.colour ?? "888"}` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
