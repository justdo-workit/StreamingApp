'use client';

import { useEffect, useRef } from 'react';

export default function HomeTopBannerAd() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    (window as any).atOptions = {
      key: '912074aa3de30a2f3cb2b3432d994606',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/912074aa3de30a2f3cb2b3432d994606/invoke.js';
    script.async = true;

    container.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} style={{ width: 728, height: 90 }} />
    </div>
  );
}
