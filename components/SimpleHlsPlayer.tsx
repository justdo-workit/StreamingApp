// components/SimpleHlsPlayer.tsx

"use client";

import { useEffect, useRef } from "react";

type Props = {
	src: string; // proxied URL or direct m3u8
	onLoaded?: () => void;
};

export default function SimpleHlsPlayer({ src, onLoaded }: Props) {
	const videoRef = useRef<HTMLVideoElement | null>(null);

	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;

		// Ensure crossorigin attribute exists early
		try {
			video.setAttribute("crossorigin", "anonymous");
			video.setAttribute("playsinline", "true");
		} catch {}

		let hls: any = null;
		let mounted = true;

		const isM3u8 = /\.m3u8(\?|$)/i.test(src);

		async function setup() {
			// Native HLS support (Safari)
			const canNative = video.canPlayType("application/vnd.apple.mpegurl");

			if (isM3u8 && !canNative) {
				try {
					const HlsModule = await import("hls.js");
					const HlsCtor = (HlsModule as any).default ?? HlsModule;

					if (HlsCtor && HlsCtor.isSupported()) {
						hls = new HlsCtor({
							enableWorker: true,
							lowLatencyMode: true,
						});

						hls.on(HlsCtor.Events.ERROR, (_ev: any, data: any) => {
							console.error("hls error", data);
							if (data && data.fatal) {
								try {
									hls?.destroy();
								} catch {}
								// fallback to native src
								video.src = src;
							}
						});

						hls.on(HlsCtor.Events.MANIFEST_PARSED, () => {
							// autoplay muted to satisfy browser policies
							video.muted = true;
							video.play().catch(() => {});
							if (onLoaded) onLoaded();
						});

						hls.loadSource(src);
						hls.attachMedia(video);
						return;
					}
				} catch (err) {
					console.error("Failed to import hls.js", err);
				}
			}

			// fallback (native / safari)
			video.src = src;
			video.muted = true;
			try {
				video.load();
			} catch {}
			video.play().catch(() => {});
			if (onLoaded) onLoaded();
		}

		setup();

		return () => {
			mounted = false;
			try {
				if (hls) hls.destroy();
			} catch (e) {
				console.warn("Error destroying hls", e);
			}
		};
	}, [src, onLoaded]);

	return (
		<video
			ref={videoRef}
			controls={false}
			playsInline
			autoPlay
			muted
			style={{ width: "100%", height: "100%", background: "black" }}
		/>
	);
}

