'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  width: number;
  height: number;
  zoneKey: string;
  scriptSrc: string;
}

export default function AdBanner({ width, height, zoneKey, scriptSrc }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    (window as any).atOptions = {
      key: zoneKey,
      format: 'iframe',
      height,
      width,
      params: {},
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = scriptSrc;
    script.async = true;

    container.appendChild(script);
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
    />
  );
}
