"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Driver = {
  position: number;
  driver: string;
  time: string;
  points: number;
};

type DriverStandingsProps = {
  drivers: Driver[];
};

export default function DriverStandings({ drivers: initialDrivers }: DriverStandingsProps) {
    const [drivers, setDrivers] = useState(initialDrivers);

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setDrivers(prevDrivers => {
                const newDrivers = [...prevDrivers];
                const randomIndex = Math.floor(Math.random() * newDrivers.length);
                const randomTimeOffset = (Math.random() * 0.1).toFixed(3);
                
                // Don't update the leader
                if (randomIndex > 0) {
                    const originalTime = parseFloat(newDrivers[randomIndex].time.replace('+', ''));
                    const newTime = (originalTime + parseFloat(randomTimeOffset)).toFixed(3);
                    newDrivers[randomIndex] = {
                        ...newDrivers[randomIndex],
                        time: `+${newTime}`
                    };
                }
                
                return newDrivers;
            });
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Live Standings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto">
            <div className="grid grid-cols-[30px_1fr_auto] gap-x-4 gap-y-2 text-sm">
                {/* Header */}
                <div className="font-bold text-muted-foreground">#</div>
                <div className="font-bold text-muted-foreground">Driver</div>
                <div className="font-bold text-muted-foreground text-right">Interval</div>

                {/* Rows */}
                {drivers.map((driver) => (
                <div key={driver.position} className="contents">
                    <div className="font-mono font-semibold">{driver.position}</div>
                    <div className="font-bold">{driver.driver}</div>
                    <div className="font-mono text-right text-muted-foreground">{driver.time}</div>
                </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
