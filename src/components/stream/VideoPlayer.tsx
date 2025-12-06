"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "../ui/card";
import { Maximize } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type VideoPlayerProps = {
	url: string;
	isHd: boolean;
	onFirstFullscreenClick: () => void;
	curved?: boolean;
	showLoading?: boolean;
	onLoaded?: () => void;
};

export default function VideoPlayer({
	url,
	isHd,
	onFirstFullscreenClick,
	curved = false,
	showLoading = false,
	onLoaded,
}: VideoPlayerProps) {
	const [isFirstFullscreen, setIsFirstFullscreen] = useState(true);
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const isHls = (() => {
		const pattern = /\.m3u8(\?|$)/i;
		if (pattern.test(url)) return true;
		try {
			const parsed = new URL(
				url,
				typeof window !== "undefined"
					? window.location.origin
					: "http://localhost"
			);
			const inner = parsed.searchParams.get("url");
			if (inner && pattern.test(inner)) return true;
		} catch {
			// ignore
		}
		return false;
	})();

	const handleFullscreen = () => {
		if (isFirstFullscreen) {
			onFirstFullscreenClick();
			setIsFirstFullscreen(false);
		}
		if (isHls) {
			videoRef.current?.requestFullscreen().catch(() => {});
		} else {
			iframeRef.current?.requestFullscreen().catch(() => {});
		}
	};

	// HLS setup: dynamic import of hls.js, set crossorigin early, autoplay muted
	useEffect(() => {
		if (!isHls) return;
		const video = videoRef.current;
		if (!video) return;

		// Ensure crossorigin attribute exists before loading playlist
		try {
			video.setAttribute("crossorigin", "anonymous");
			video.setAttribute("playsinline", "true");
		} catch {}

		// Reset src so we force a fresh playlist fetch
		video.src = "";
		video.crossOrigin = "anonymous";

		let hls: any = null;
		let mounted = true;

		const autoplay = async () => {
			if (!mounted) return;
			if (onLoaded) onLoaded();
			// autoplay muted to avoid user-gesture restrictions
			video.muted = true;
			try {
				video.load();
			} catch {}
			try {
				await video.play();
			} catch (err) {
				// ignore but log
				console.debug("Autoplay rejected:", err);
			}
		};

		const useNative = () => {
			console.debug("Using native HLS (browser)");
			video.onerror = () => {
				console.error("Native video error", video.error);
				if (onLoaded) onLoaded();
			};
			video.onloadeddata = autoplay;
			video.src = url;
		};

		const setup = async () => {
			const canNative = video.canPlayType("application/vnd.apple.mpegurl");
			if (canNative) {
				useNative();
				return;
			}

			try {
				// dynamic import to avoid CSP/script-injection issues
				const HlsModule = await import("hls.js");
				const HlsCtor = (HlsModule as any).default ?? HlsModule;
				if (HlsCtor && HlsCtor.isSupported()) {
					hls = new HlsCtor({
						enableWorker: true,
						lowLatencyMode: true,
					});

					hls.on(HlsCtor.Events.ERROR, (_event: any, data: any) => {
						console.error("Hls.js error", data);
						if (data && data.fatal) {
							try {
								hls?.destroy();
							} catch {}
							// fallback to native if possible
							useNative();
						}
					});

					hls.on(HlsCtor.Events.MANIFEST_PARSED, () => {
						console.debug("HLS manifest parsed, attempting autoplay");
						autoplay();
					});

					hls.loadSource(url);
					hls.attachMedia(video);
				} else {
					console.debug("Hls ctor not supported - falling back to native");
					useNative();
				}
			} catch (err) {
				console.error("Failed to load hls.js dynamically:", err);
				useNative();
			}
		};

		setup();

		return () => {
			mounted = false;
			try {
				if (hls) {
					hls.destroy();
				}
			} catch (e) {
				console.warn("Error destroying HLS instance", e);
			}
			if (video) {
				video.onloadeddata = null;
				video.onerror = null;
			}
		};
	}, [isHls, url, onLoaded]);

	return (
		<Card
			className={cn(
				"relative aspect-video w-full overflow-hidden bg-black group",
				curved && "rounded-[28px] p-1"
			)}
		>
			<div
				className={cn(
					"relative h-full w-full overflow-hidden",
					curved &&
						"rounded-[24px] shadow-[inset_0_20px_40px_rgba(0,0,0,0.6),inset_0_-20px_40px_rgba(0,0,0,0.6)] [transform:perspective(1200px)_rotateX(2deg)]"
				)}
			>
				{isHls ? (
					// HLS: no custom controls rendered (per your request)
					<video
						ref={videoRef}
						className="h-full w-full"
						controls={false} // explicitly no controls
						playsInline
						autoPlay
						muted
						preload="auto"
					/>
				) : (
					<iframe
						ref={iframeRef}
						src={url}
						onLoad={() => {
							if (onLoaded) onLoaded();
						}}
						allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
						className="h-full w-full border-0"
						title="Stream"
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
					<span
						className={cn(
							"px-2 py-1 rounded-md text-xs font-bold text-white",
							isHd ? "bg-yellow-500" : "bg-primary"
						)}
					>
						{isHd ? "HD" : "SD"}
					</span>
				</div>
				<Button
					variant="secondary"
					size="icon"
					onClick={handleFullscreen}
					className="pointer-events-auto"
				>
					<Maximize className="h-5 w-5" />
					<span className="sr-only">Fullscreen</span>
				</Button>
			</div>
		</Card>
	);
}
