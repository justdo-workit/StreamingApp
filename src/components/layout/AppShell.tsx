"use client";

import { useEffect, useState } from "react";
import TrafficLightLoader from "../shared/TrafficLightLoader";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Show loader only on initial mount (page load/refresh)
    // Traffic light sequence: ~5 steps * 600ms ≈ 3s. Add a short buffer
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 3400);

    return () => clearTimeout(timer);
  }, []);

  if (showLoader) {
    return <TrafficLightLoader />;
  }

  return <>{children}</>;
}
