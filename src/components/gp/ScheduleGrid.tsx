import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Flag } from "lucide-react";
import SessionStatusButton from "./SessionStatusButton";

type Schedule = {
  id: number;
  name: string;
  time: string;
};

type ScheduleGridProps = {
  schedule: Schedule[];
  grandPrixSlug: string;
};

export default function ScheduleGrid({ schedule, grandPrixSlug }: ScheduleGridProps) {
  return (
    <section>
      <h2 className="mb-6 text-center font-headline text-4xl font-bold">
        Weekend Schedule
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {schedule.map((session) => (
          <Card key={session.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{session.name}</span>
                {session.name === 'Race' ? <Flag className="h-6 w-6 text-primary" /> : <Clock className="h-6 w-6 text-primary" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow flex-col justify-between">
              <p className="text-muted-foreground">
                {new Date(session.time).toLocaleString(undefined, {
                  weekday: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
              <SessionStatusButton sessionTime={session.time} grandPrixSlug={grandPrixSlug} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
