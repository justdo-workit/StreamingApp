import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Flag, CalendarPlus } from "lucide-react";
import SessionStatusButton from "./SessionStatusButton";

type Schedule = {
  id: number;
  name: string;
  time: string;
};

type ScheduleGridProps = {
  schedule: Schedule[];
  grandPrixSlug: string;
  grandPrixName: string;
};

export default function ScheduleGrid({ schedule, grandPrixSlug, grandPrixName }: ScheduleGridProps) {
  // group sessions by weekday name
  const groups = schedule.reduce<Record<string, Schedule[]>>((acc, s) => {
    const d = new Date(s.time);
    const weekday = d.toLocaleDateString(undefined, { weekday: 'long' });
    acc[weekday] = acc[weekday] || [];
    acc[weekday].push(s);
    return acc;
  }, {});

  const orderedDays = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const entries = Object.entries(groups).sort(
    (a,b) => orderedDays.indexOf(a[0]) - orderedDays.indexOf(b[0])
  );

  const formatRange = (iso: string, name: string) => {
    const start = new Date(iso);
    const end = new Date(start.getTime() + (name.toLowerCase().includes('race') ? 120 : 60) * 60 * 1000);
    const fmt = (d: Date) => d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    return `${fmt(start)} - ${fmt(end)}`;
  };

  const isSessionCompleted = (iso: string, name: string) => {
    const now = Date.now();
    const start = new Date(iso).getTime();
    const baseMinutes = name.toLowerCase().includes('race') ? 120 : 60;
    const completedDelayMinutes = 30;
    const end = start + (baseMinutes + completedDelayMinutes) * 60 * 1000;
    return now > end;
  };

  return (
    <section>
      <h2 className="mb-8 text-center font-headline text-4xl font-bold">
        Schedule
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {entries.map(([day, sessions]) => (
          <div key={day} className="flex flex-col">
            <div className="text-2xl font-bold text-white">{day}</div>
            <div className="my-3 h-px w-full bg-white/15" />
            <div className="space-y-5">
              {sessions.map((s) => (
                <div key={s.id} className="flex flex-col">
                  <div className="text-base font-semibold text-white">{s.name}</div>
                  <div className="text-sm text-white/60">{formatRange(s.time, s.name)}</div>
                  <div className="mt-3 max-w-xs space-y-2">
                    <SessionStatusButton sessionTime={s.time} sessionName={s.name} grandPrixSlug={grandPrixSlug} />
                    {!isSessionCompleted(s.time, s.name) && (
                      <Button
                      asChild
                      variant="outline"
                      size="xs"
                      className="h-7 px-2 bg-[#CA0500] hover:bg-[#CA0500]/80 text-[11px]"
                    >
                      <a
                        href={(() => {
                          const start = new Date(s.time);
                          const durationMinutes = s.name.toLowerCase().includes('race') ? 120 : 60;
                          const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

                          const formatForGCal = (d: Date) =>
                            d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

                          const title = `${grandPrixName}  ${s.name}`;
                          const details = `Slipstreams.live session for ${grandPrixName}  ${s.name}. Watch on: https://slipstreams.live`;

                          const params = new URLSearchParams({
                            action: 'TEMPLATE',
                            text: title,
                            dates: `${formatForGCal(start)}/${formatForGCal(end)}`,
                            details,
                          });

                          return `https://calendar.google.com/calendar/render?${params.toString()}`;
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="inline-flex justify-center items-center gap-1">
                          <CalendarPlus className="h-3 w-3" />
                          <span>Add to Calendar</span>
                        </span>
                      </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
