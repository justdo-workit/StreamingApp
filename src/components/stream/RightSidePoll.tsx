'use client';

import { useEffect, useRef } from 'react';

export default function RightSidePoll() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "<a href='https://poll-maker.com/poll5659981xe0b44D9F-166' data-poll='5659981xe0b44D9F-166' style='width:100%; display:block; text-align:right;'>.</a>";

    const inline = document.createElement('script');
    inline.type = 'text/javascript';
    inline.innerHTML = "(function(i,s,o,g,r,a,m){i['QP']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//scripts.poll-maker.com/3012/pollembed.js','qp');";
    container.appendChild(inline);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-full overflow-hidden">
      
      {/* Poll Maker will replace the anchor inside this container */}
    </div>
  );
}
