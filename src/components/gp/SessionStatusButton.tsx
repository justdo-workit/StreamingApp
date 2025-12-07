"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

type SessionStatusButtonProps = {
  sessionTime: string;
  sessionName?: string;
  grandPrixSlug: string;
};

const getStatus = (sessionTime: string, sessionName?: string) => {
  const now = new Date().getTime();
  const sessionStart = new Date(sessionTime).getTime();
  const baseMinutes = (sessionName || '').toLowerCase().includes('race') ? 120 : 60;
  const completedDelayMinutes = 30; // show Completed 30 minutes after expected end
  const sessionEnd = sessionStart + (baseMinutes + completedDelayMinutes) * 60 * 1000;
  const diff = sessionStart - now;
  const preOpenMs = 60 * 60 * 1000; // last 60 minutes before start

  if (now > sessionEnd) {
    return { text: "Completed", status: "completed", disabled: true };
  }
  if (now >= sessionStart && now <= sessionEnd) {
    return { text: "LIVE", status: "live", disabled: false };
  }
  if (diff > 0 && diff <= preOpenMs) {
    // Within 30 minutes before start -> green "Open"
    return { text: "Open", status: "prelive", disabled: false };
  }
  if (diff > 0) {
    return { text: "Upcoming", status: "upcoming", disabled: false };
  }
  return { text: "View Details", status: "scheduled", disabled: false };
};

export default function SessionStatusButton({ sessionTime, sessionName, grandPrixSlug }: SessionStatusButtonProps) {
  const [statusInfo, setStatusInfo] = useState(getStatus(sessionTime, sessionName));

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusInfo(getStatus(sessionTime, sessionName));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionTime, sessionName]);

  if (statusInfo.status === 'live' || statusInfo.status === 'prelive') {
    return (
      <div className="relative mt-2 w-full">
        <Button asChild size="sm" className={`w-full ${statusInfo.status === 'live' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
          <Link
            prefetch
            href={`/stream/${grandPrixSlug}?session=${encodeURIComponent(sessionName || '')}`}
          >
            <PlayCircle className="mr-2 h-4 w-4 animate-pulse" />
            {statusInfo.status === 'live' ? 'LIVE' : 'Open'}
          </Link>
        </Button>
      </div>
    )
  }

  if (statusInfo.status === 'completed') {
    return (
      <Button
        size="sm"
        disabled
        className="mt-2 w-full bg-gray-500 text-white disabled:opacity-100 cursor-not-allowed"
      >
        Completed
      </Button>
    );
  }

  // For non-completed sessions (upcoming or scheduled), allow navigation to stream page
  return (
    <Button
      asChild
      size="sm"
      className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white"
    >
      <Link
        prefetch
        href={`/stream/${grandPrixSlug}?session=${encodeURIComponent(sessionName || '')}`}
      >
        <PlayCircle className="mr-2 h-4 w-4" />
        {statusInfo.text}
      </Link>
    </Button>
  );
}
