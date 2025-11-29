'use client';

import { useEffect, useRef } from 'react';

export default function GpHeroAd() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    (window as any).atOptions = {
      key: '3ff3fb1f818fe806eddec9e76ce0c4d6',
      format: 'iframe',
      height: 60,
      width: 468,
      params: {},
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/3ff3fb1f818fe806eddec9e76ce0c4d6/invoke.js';
    script.async = true;

    container.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-8">
      <div ref={containerRef} style={{ width: 468, height: 60 }} />
    </div>
  );
}
