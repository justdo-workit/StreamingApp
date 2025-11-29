'use client';

import { useEffect } from 'react';

export default function HomeAfterIntroAd() {
  useEffect(() => {
    const src = '//pl28151163.effectivegatecpm.com/e743572c2957a48ebf63faa5bb820382/invoke.js';
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = src;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center my-8">
      <div id="container-e743572c2957a48ebf63faa5bb820382" />
    </div>
  );
}
