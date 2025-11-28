'use client';

import { useEffect } from 'react';

export default function BottomPageAd() {
  useEffect(() => {
    // Avoid injecting the script multiple times
    const existingScript = document.querySelector(
      'script[src="//pl28151163.effectivegatecpm.com/e743572c2957a48ebf63faa5bb820382/invoke.js"]'
    );
    if (existingScript) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = '//pl28151163.effectivegatecpm.com/e743572c2957a48ebf63faa5bb820382/invoke.js';

    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full flex justify-center py-8">
      <div id="container-e743572c2957a48ebf63faa5bb820382" />
    </div>
  );
}
