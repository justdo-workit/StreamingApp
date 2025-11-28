"use client";

import { useState, useRef, useEffect } from 'react';
import { Card } from "../ui/card";
import { Maximize, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type VideoPlayerProps = {
  url: string;
  isHd: boolean;
  onFirstFullscreenClick: () => void;
  curved?: boolean;
  showLoading?: boolean;
  onLoaded?: () => void;
};

export default function VideoPlayer({ url, isHd, onFirstFullscreenClick, curved = false, showLoading = false, onLoaded }: VideoPlayerProps) {
  const [isFirstFullscreen, setIsFirstFullscreen] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHls = /\.m3u8(\?|$)/i.test(url);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleFullscreen = () => {
    if (isFirstFullscreen) {
      onFirstFullscreenClick();
      setIsFirstFullscreen(false);
    }
    if (isHls) {
      videoRef.current?.requestFullscreen();
    } else {
      iframeRef.current?.requestFullscreen();
    }
  };

  useEffect(() => {
    if (!isHls) return;
    const video = videoRef.current;
    if (!video) return;
    const canNative = video.canPlayType('application/vnd.apple.mpegurl');
    let hls: any;
    let scriptEl: HTMLScriptElement | null = null;
    const setup = async () => {
      if (canNative) {
        video.src = url;
        video.onloadeddata = () => { onLoaded && onLoaded(); };
        return;
      }
      if (!(window as any).Hls) {
        scriptEl = document.createElement('script');
        scriptEl.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        scriptEl.async = true;
        document.body.appendChild(scriptEl);
        await new Promise((res) => { scriptEl!.onload = res; });
      }
      const HlsCtor = (window as any).Hls;
      if (HlsCtor && HlsCtor.isSupported()) {
        hls = new HlsCtor();
        hls.loadSource(url);
        hls.attachMedia(video);
      }
    };
    setup();
    return () => {
      if (hls) {
        try { hls.destroy(); } catch {}
      }
      if (video) {
        video.onloadeddata = null;
      }
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [isHls, url, onLoaded]);

  // Bind basic playback events for custom controls
  useEffect(() => {
    if (!isHls) return;
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setTime(video.currentTime || 0);
    const onLoadedMeta = () => {
      setDuration(video.duration || 0);
      if (onLoaded) onLoaded();
    };
    const onVol = () => { setMuted(video.muted); setVolume(video.volume); };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('loadedmetadata', onLoadedMeta);
    video.addEventListener('volumechange', onVol);
    // init
    onLoadedMeta(); onVol(); setPlaying(!video.paused);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('loadedmetadata', onLoadedMeta);
      video.removeEventListener('volumechange', onVol);
    };
  }, [isHls, onLoaded]);

  const togglePlay = () => {
    if (!isHls) return;
    const v = videoRef.current; if (!v) return;
    if (v.paused) v.play().catch(() => {}); else v.pause();
  };
  const toggleMute = () => {
    if (!isHls) return;
    const v = videoRef.current; if (!v) return;
    v.muted = !v.muted;
  };
  const setVol = (val: number) => {
    if (!isHls) return;
    const v = videoRef.current; if (!v) return;
    v.volume = Math.max(0, Math.min(1, val));
    if (v.volume > 0 && v.muted) v.muted = false;
  };
  const seekTo = (sec: number) => {
    if (!isHls) return;
    const v = videoRef.current; if (!v || !isFinite(duration) || duration <= 0) return;
    v.currentTime = Math.max(0, Math.min(duration, sec));
  };
  const fmt = (s: number) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60); const ss = Math.floor(s % 60);
    return `${m}:${String(ss).padStart(2,'0')}`;
  };

  return (
    <Card className={cn("relative aspect-video w-full overflow-hidden bg-black group", curved && "rounded-[28px] p-1")}> 
      <div
        className={cn(
          "relative h-full w-full overflow-hidden",
          curved && "rounded-[24px] shadow-[inset_0_20px_40px_rgba(0,0,0,0.6),inset_0_-20px_40px_rgba(0,0,0,0.6)] [transform:perspective(1200px)_rotateX(2deg)]"
        )}
      >
        {isHls ? (
          <video
            ref={videoRef}
            className="h-full w-full"
            controls={false}
            playsInline
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            onLoad={() => { if (onLoaded) onLoaded(); }}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
            title="F1 Stream"
          />
        )}
      </div>
      {showLoading && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 text-white text-sm font-medium">
          Loading stream...
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-transparent transition-opacity opacity-0 group-hover:opacity-100 flex items-start justify-end p-2">
         <div className="pointer-events-auto absolute top-2 left-2 flex items-center gap-2">
            <span className={cn("px-2 py-1 rounded-md text-xs font-bold text-white", isHd ? "bg-yellow-500" : "bg-primary")}>
                {isHd ? "HD" : "SD"}
            </span>
         </div>
        <Button variant="secondary" size="icon" onClick={handleFullscreen} className="pointer-events-auto">
            <Maximize className="h-5 w-5" />
            <span className="sr-only">Fullscreen</span>
        </Button>
      </div>

      {/* Custom Controls (HLS only) */}
      {isHls && (
        <div className="absolute inset-x-0 bottom-0 z-20 px-3 pb-2 pt-1 bg-gradient-to-t from-black/70 to-transparent">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white p-1 rounded hover:bg-white/10" aria-label={playing ? 'Pause' : 'Play'}>
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button onClick={toggleMute} className="text-white p-1 rounded hover:bg-white/10" aria-label={muted ? 'Unmute' : 'Mute'}>
              {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={muted ? 0 : volume}
              onChange={(e) => setVol(parseFloat(e.target.value))}
              className="h-1 w-24 accent-white"
            />
            <div className="ml-2 font-mono text-xs text-white/90 tabular-nums">{fmt(time)} / {fmt(duration)}</div>
            {/* Seek bar */}
            <div
              className="ml-3 relative h-2 flex-1 cursor-pointer rounded bg-white/20"
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                if (isFinite(duration)) seekTo(duration * Math.max(0, Math.min(1, ratio)));
              }}
              title="Seek"
            >
              <div className="absolute inset-y-0 left-0 rounded bg-white" style={{ width: `${duration > 0 ? (time / duration) * 100 : 0}%` }} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
