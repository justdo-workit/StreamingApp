'use client';

import { useEffect, useRef } from 'react';

export default function HomeUpNextAd() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.referrerPolicy = 'no-referrer-when-downgrade';
    script.src = '//dead-hour.com/bYXlV/sMd.G/lt0oYfWZcA/neQmC9Bu/ZuUclPkZPdT/YV3/Mcj/E/2tNtDzUltaNkjHcrygMUTnYr0LNdg_';

    container.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} />
    </div>
  );
}
