'use client';

import { useEffect, useRef } from 'react';

export default function RightSidePollAd() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const timeoutId = window.setTimeout(() => {
      const target = containerRef.current;
      if (!target) return;

      (window as any).atOptions = {
        key: '2ca695d250827a3fdcdadd8d2028c103',
        format: 'iframe',
        height: 300,
        width: 160,
        params: {},
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src =
        '//www.highperformanceformat.com/2ca695d250827a3fdcdadd8d2028c103/invoke.js';

      target.appendChild(script);
    }, 1500);

    return () => {
      window.clearTimeout(timeoutId);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} style={{ width: 160, height: 300 }} />
    </div>
  );
}
