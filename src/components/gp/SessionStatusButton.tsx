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
    const sessionEnd = sessionStart + 2 * 60 * 60 * 1000; // Assume 2 hour duration
    const diff = sessionStart - now;

    if (now > sessionEnd) {
        return { text: "Completed", status: "completed", disabled: true };
    }
    if (now >= sessionStart && now <= sessionEnd) {
        return { text: "LIVE", status: "live", disabled: false };
    }
    if (diff <= 60 * 60 * 1000 && diff > 0) { // Less than 1 hour away
        const minutes = Math.floor(diff / (1000 * 60));
        return { text: `Starts in ${minutes} min`, status: "soon", disabled: true };
    }
    return { text: "View Details", status: "scheduled", disabled: true };
};

export default function SessionStatusButton({ sessionTime, grandPrixSlug }: SessionStatusButtonProps) {
    const [statusInfo, setStatusInfo] = useState(getStatus(sessionTime));
    
    useEffect(() => {
        const interval = setInterval(() => {
            setStatusInfo(getStatus(sessionTime));
        }, 30000); // Update every 30 seconds

        return () => clearInterval(interval);
    }, [sessionTime]);

    if (statusInfo.status === 'live') {
        return (
            <Button asChild className="mt-4 w-full">
                <Link href={`/stream/${grandPrixSlug}`}>
                    <PlayCircle className="mr-2 h-4 w-4 animate-pulse" /> {statusInfo.text}
                </Link>
            </Button>
        )
    }

    return (
        <Button 
            variant={statusInfo.status === 'completed' ? 'secondary' : 'outline'} 
            disabled={statusInfo.disabled} 
            className="mt-4 w-full"
        >
            {statusInfo.text}
        </Button>
    );
}
