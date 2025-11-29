'use client';

import { useEffect, useRef } from 'react';

export default function StreamingBannerAd() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    (window as any).atOptions = {
      key: '9b55b82dfa1e69f2170125824c19fd15',
      format: 'iframe',
      height: 50,
      width: 320,
      params: {},
    };

    const script = document.createElement('script');
    script.type = 'text/javascript';

    // Base64-encoded: "//www.highperformanceformat.com/9b55b82dfa1e69f2170125824c19fd15/invoke.js"
    const encodedSrc =
      'Ly93d3cuaGlnaHBlcmZvcm1hbmNlZm9ybWF0LmNvbS85YjU1YjgyZGZhMWU2OWYyMTcwMTI1ODI0YzE5ZmQxNS9pbnZva2UuanM=';

    script.src = window.atob(encodedSrc);
    script.async = true;

    container.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} style={{ width: 320, height: 50 }} />
    </div>
  );
}
