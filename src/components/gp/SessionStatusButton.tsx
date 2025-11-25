"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";

type SessionStatusButtonProps = {
  sessionTime: string;
  grandPrixSlug: string;
};

const getStatus = (sessionTime: string) => {
    const now = new Date().getTime();
    const sessionStart = new Date(sessionTime).getTime();
    const preOpenMs = 10 * 60 * 1000;
    const postCloseMs = 30 * 60 * 1000;
    const sessionEnd = sessionStart + postCloseMs;
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

export default function SessionStatusButton({ sessionTime, grandPrixSlug }: SessionStatusButtonProps) {
    const [statusInfo, setStatusInfo] = useState(getStatus(sessionTime));
    const forceOpenTest = process.env.NODE_ENV !== 'production';
    
    useEffect(() => {
        const interval = setInterval(() => {
            setStatusInfo(getStatus(sessionTime));
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [sessionTime]);

    if (statusInfo.status === 'live' || statusInfo.status === 'prelive' || forceOpenTest) {
        return (
            <Button asChild size="sm" className="mt-2 w-full">
                <Link prefetch href={`/stream/${grandPrixSlug}`}>
                    <PlayCircle className="mr-2 h-4 w-4 animate-pulse" /> {statusInfo.text}
                </Link>
            </Button>
        )
    }

    return (
        <Button 
            size="sm"
            variant={statusInfo.status === 'completed' ? 'secondary' : 'outline'} 
            disabled={statusInfo.disabled} 
            className="mt-2 w-full"
        >
            {statusInfo.text}
        </Button>
    );
}
