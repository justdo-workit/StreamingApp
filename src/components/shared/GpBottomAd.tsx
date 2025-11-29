'use client';

import { useEffect, useRef } from 'react';

export default function GpBottomAd() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    (window as any).atOptions = {
      key: '9942bce170e25aead636127279479c68',
      format: 'iframe',
      height: 250,
      width: 300,
      params: {},
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//www.highperformanceformat.com/9942bce170e25aead636127279479c68/invoke.js';
    script.async = true;

    container.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-8">
      <div ref={containerRef} style={{ width: 300, height: 250 }} />
    </div>
  );
}
