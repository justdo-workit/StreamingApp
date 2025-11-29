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
    const preOpenMs = 10 * 60 * 1000;
    const baseMinutes = (sessionName || '').toLowerCase().includes('race') ? 120 : 60;
    const sessionEnd = sessionStart + (baseMinutes + 25) * 60 * 1000;
    const diff = sessionStart - now;

    if (now > sessionEnd) {
        return { text: "Completed", status: "completed", disabled: true };
    }
    if (now >= sessionStart && now <= sessionEnd) {
        return { text: "LIVE", status: "live", disabled: false };
    }
    if (diff <= preOpenMs && diff > 0) {
        return { text: "Starting soon", status: "prelive", disabled: false };
    }
    if (diff <= 60 * 60 * 1000 && diff > preOpenMs) {
        const minutes = Math.floor(diff / (1000 * 60));
        return { text: `Starts in ${minutes} min`, status: "soon", disabled: true };
    }
    return { text: "View Details", status: "scheduled", disabled: true };
};

export default function SessionStatusButton({ sessionTime, sessionName, grandPrixSlug }: SessionStatusButtonProps) {
    const [statusInfo, setStatusInfo] = useState(getStatus(sessionTime, sessionName));

    useEffect(() => {
        const interval = setInterval(() => {
            setStatusInfo(getStatus(sessionTime, sessionName));
        }, 1000);
        return () => clearInterval(interval);
    }, [sessionTime, sessionName]);

    const sessionStart = new Date(sessionTime).getTime();
    const now = Date.now();
    const preOpenMs = 10 * 60 * 1000;
    const diffMs = Math.max(0, sessionStart - now);
    const fmt = (ms: number) => {
        const total = Math.max(0, Math.floor(ms / 1000));
        const hours = Math.floor(total / 3600);
        const minutes = Math.floor((total % 3600) / 60);
        const seconds = total % 60;
        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');
        return `${hh}:${mm}:${ss}`;
    };
    const isPreOpen = diffMs > 0 && diffMs <= preOpenMs;

    if (statusInfo.status === 'live' || statusInfo.status === 'prelive') {
        return (
            <div className="relative mt-2 w-full">
                {isPreOpen && (
                    <span className="absolute -top-2 left-2 rounded bg-yellow-500 px-2 py-0.5 text-[10px] font-semibold text-black shadow">
                        Opens {fmt(diffMs)}
                    </span>
                )}
                <Button asChild size="sm" className={`w-full ${statusInfo.status === 'live' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                    <Link prefetch href={`/stream/${grandPrixSlug}`}>
                        <PlayCircle className="mr-2 h-4 w-4 animate-pulse" />
                        {statusInfo.status === 'live' ? 'LIVE' : 'Open'}
                    </Link>
                </Button>
            </div>
        )
    }

    return (
        <Button 
            size="sm"
            disabled
            className={`mt-2 w-full ${statusInfo.status === 'completed' ? 'bg-gray-500 text-white disabled:opacity-100' : 'bg-blue-600 text-white disabled:opacity-100'} cursor-not-allowed`}
        >
            {statusInfo.status === 'completed' ? 'Completed' : `Upcoming ${fmt(diffMs)}`}
        </Button>
    );
}
