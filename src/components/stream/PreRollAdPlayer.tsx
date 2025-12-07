'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  vastUrl: string;
  onComplete: () => void;
};

export default function PreRollAdPlayer({ vastUrl, onComplete }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [clickThrough, setClickThrough] = useState<string | null>(null);
  const [skipAfter, setSkipAfter] = useState<number>(10);
  const [canSkip, setCanSkip] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState<number>(10);
  const impressionsRef = useRef<string[]>([]);
  const startTrackersRef = useRef<string[]>([]);
  const completeTrackersRef = useRef<string[]>([]);

  useEffect(() => {
    let aborted = false;
    const fetchVast = async () => {
      try {
        const res = await fetch(vastUrl, { cache: 'no-store', mode: 'cors' });
        const txt = await res.text();
        if (aborted) return;
        const parser = new DOMParser();
        const xml = parser.parseFromString(txt, 'text/xml');

        const getText = (el: Element | null) => (el?.textContent || '').trim();

        const linear = xml.getElementsByTagName('Linear')[0];
        if (linear) {
          const attr = linear.getAttribute('skipoffset');
          if (attr) {
            const s = parseTimeToSeconds(attr);
            if (!isNaN(s)) {
              setSkipAfter(s);
              setSkipCountdown(s);
            }
          }
        }

        const mediaFiles = Array.from(xml.getElementsByTagName('MediaFile'));
        let chosen: string | null = null;
        const mp4s = mediaFiles.filter((m) => (m.getAttribute('type') || '').toLowerCase().includes('mp4'));
        const webs = mediaFiles.filter((m) => (m.getAttribute('type') || '').toLowerCase().includes('webm'));
        const pickFrom = mp4s.length ? mp4s : webs;
        if (pickFrom.length) {
          const byWidth = pickFrom
            .map((m) => ({
              url: getText(m),
              width: Number(m.getAttribute('width') || '0') || 0,
              bitrate: Number(m.getAttribute('bitrate') || '0') || 0,
            }))
            .sort((a, b) => (b.width || b.bitrate) - (a.width || a.bitrate));
          chosen = byWidth[0]?.url || null;
        }

        const click = xml.getElementsByTagName('ClickThrough')[0];
        const clickUrl = getText(click);

        const impr = Array.from(xml.getElementsByTagName('Impression')).map((i) => getText(i)).filter(Boolean);
        const trackers = Array.from(xml.getElementsByTagName('Tracking'));
        const start = trackers.filter((t) => (t.getAttribute('event') || '').toLowerCase() === 'start').map((t) => getText(t)).filter(Boolean);
        const complete = trackers.filter((t) => (t.getAttribute('event') || '').toLowerCase() === 'complete').map((t) => getText(t)).filter(Boolean);

        impressionsRef.current = impr;
        startTrackersRef.current = start;
        completeTrackersRef.current = complete;

        if (chosen) setMediaUrl(chosen);
        if (clickUrl) setClickThrough(clickUrl);

        if (impr.length) ping(impr);
      } catch {
        onComplete();
      }
    };
    fetchVast();
    return () => {
      aborted = true;
    };
  }, [vastUrl, onComplete]);

  useEffect(() => {
    if (skipAfter <= 0) {
      setCanSkip(true);
      return;
    }
    setCanSkip(false);
    setSkipCountdown(skipAfter);
    let left = skipAfter;
    const id = window.setInterval(() => {
      left -= 1;
      setSkipCountdown(left);
      if (left <= 0) {
        setCanSkip(true);
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [skipAfter]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !mediaUrl) return;
    const onLoaded = () => {
      v.muted = true;
      v.play().catch(() => {});
    };
    const onPlay = () => {
      if (startTrackersRef.current.length) ping(startTrackersRef.current);
    };
    const onEnded = () => {
      if (completeTrackersRef.current.length) ping(completeTrackersRef.current);
      onComplete();
    };
    v.addEventListener('loadeddata', onLoaded);
    v.addEventListener('play', onPlay);
    v.addEventListener('ended', onEnded);
    return () => {
      v.removeEventListener('loadeddata', onLoaded);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('ended', onEnded);
    };
  }, [mediaUrl, onComplete]);

  const handleSkip = () => {
    if (!canSkip) return;
    onComplete();
  };

  const handleClickThrough = () => {
    if (clickThrough) {
      window.open(clickThrough, '_blank', 'noopener,noreferrer');
    }
  };

  if (!mediaUrl) {
    return (
      <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/90 text-white text-xs">
        Loading ad...
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-40">
      <video
        ref={videoRef}
        src={mediaUrl}
        className="h-full w-full object-cover"
        playsInline
        autoPlay
        muted
        controls={false}
        onClick={handleClickThrough}
      />
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <div className="rounded-md bg-black/70 px-2 py-1 text-[11px] text-white">
          Ad
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className={`rounded px-2 py-1 text-[11px] font-semibold ${canSkip ? 'bg-white text-black hover:bg-white/90' : 'bg-white/40 text-black/60 cursor-not-allowed'}`}
        >
          {canSkip ? 'Skip Ad' : `Skip in ${Math.max(skipCountdown, 0)}s`}
        </button>
      </div>
    </div>
  );
}

function parseTimeToSeconds(t: string): number {
  const parts = t.split(':').map((p) => p.trim());
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    const s = Number(ss) || 0;
    const m = Number(mm) || 0;
    const h = Number(hh) || 0;
    return h * 3600 + m * 60 + s;
  }
  if (parts.length === 2) {
    const [mm, ss] = parts;
    return (Number(mm) || 0) * 60 + (Number(ss) || 0);
  }
  const n = Number(t);
  return isNaN(n) ? 0 : n;
}

function ping(urls: string[]) {
  urls.forEach((u) => {
    try {
      fetch(u, { mode: 'no-cors', keepalive: true }).catch(() => {});
    } catch {}
  });
}
