"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";

type HeaderProps = {
  grandPrixName: string;
  showBack?: boolean;
  a_href?: string;
  showTimer?: boolean;
  sessionTitle?: string;
  flagUrl?: string;
  lapCount?: number;
};

export default function Header({ grandPrixName, showBack = false, a_href="/", showTimer = false, sessionTitle, flagUrl, lapCount }: HeaderProps) {
  const [elapsed, setElapsed] = useState(0);
  const [currentLap, setCurrentLap] = useState(1);

  useEffect(() => {
    if (!showTimer) return;
    const t = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [showTimer]);

  // Simulate lap progression similar to widgets when lapCount provided
  useEffect(() => {
    if (!lapCount) return;
    const lapInterval = setInterval(() => {
      setCurrentLap(prev => (prev < lapCount ? prev + 1 : lapCount));
    }, 90000);
    return () => clearInterval(lapInterval);
  }, [lapCount]);

  const hh = String(Math.floor(elapsed / 3600)).padStart(2, "0");
  const mm = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const timer = `${hh}:${mm}:${ss}`;
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between gap-2">
        {/* Left: Back */}
        <div className="flex items-center">
          {showBack && (
            <Button asChild variant="ghost" size="icon" className="mr-2">
              <Link href={a_href}>
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          )}
          {/* Mobile-only: stream name + GP name */}
          <div className="sm:hidden flex items-center gap-2 text-sm font-medium truncate">
            <span className="truncate">stream-name</span>
            <span className="text-muted-foreground">•</span>
            <span className="truncate">{grandPrixName}</span>
          </div>
        </div>

        {/* Center: Title or Timer chip */}
        <div className="flex-1 hidden sm:flex justify-center">
          {!showTimer ? (
            <h2 className="text-lg font-semibold tracking-tight truncate">{grandPrixName}</h2>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-card px-3 py-2 shadow-sm border">
              {flagUrl && (
                <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                  <Image src={flagUrl} alt="flag" fill className="object-cover" />
                </div>
              )}
              <div className="leading-tight">
                <div className="text-sm text-foreground/90 truncate max-w-[60vw]">
                  {grandPrixName}{sessionTitle ? `: ${sessionTitle}` : ""}
                </div>
                <div className="font-mono text-2xl font-extrabold">{timer}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Laps */}
        <div className="min-w-[64px] pr-4 text-right hidden sm:block">
          {lapCount && showTimer && (
            <div className=" text-2xl font-extrabold">{currentLap} / {lapCount}</div>
          )}
        </div>
      </div>
    </header>
  );
}
