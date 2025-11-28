"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { TowerEntry } from "@/hooks/useF1Stream";

type LiveTimingTowerProps = {
  title?: string;
  tower: TowerEntry[];
  connected?: boolean;
};

function formatLapTime(seconds?: number) {
  if (seconds == null || !isFinite(seconds)) return "-";
  const m = Math.floor(seconds / 60);
  const s = seconds - m * 60;
  const sStr = s.toFixed(3).padStart(6, "0"); // ss.mmm
  return `${m}:${sStr}`;
}

export default function LiveTimingTower({ title = "Live Standings", tower, connected = false }: LiveTimingTowerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}{!connected && <span className="ml-2 text-xs text-muted-foreground">(connecting...)</span>}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[600px] overflow-y-auto">
          <div className="grid grid-cols-[30px_1fr_auto_auto_auto_auto] gap-x-3 gap-y-2 text-sm">
            <div className="font-bold text-muted-foreground">#</div>
            <div className="font-bold text-muted-foreground">Driver</div>
            <div className="font-bold text-right text-muted-foreground">Int</div>
            <div className="font-bold text-right text-muted-foreground">Gap</div>
            <div className="font-bold text-right text-muted-foreground">Lap</div>
            <div className="font-bold text-right text-muted-foreground">Last</div>
            {tower.map((row) => (
              <div key={row.num} className="contents">
                <div className="font-mono font-semibold">{row.pos}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: `#${row.colour ?? "777"}` }} />
                  <span className="font-bold">{row.acr}</span>
                  <span className="text-xs text-muted-foreground">{row.num}</span>
                </div>
                <div className="font-mono text-right text-muted-foreground">{row.int != null ? `+${row.int.toFixed(3)}` : "-"}</div>
                <div className="font-mono text-right text-muted-foreground">{row.gap != null ? `+${row.gap.toFixed(3)}` : "-"}</div>
                <div className="font-mono text-right text-muted-foreground">{row.lap ?? "-"}</div>
                <div className={`font-mono text-right ${row.fl ? 'text-purple-400' : row.pb ? 'text-green-500' : 'text-muted-foreground'}`}>
                  {formatLapTime(row.last)}
                  {(row.fl || row.pb) && (
                    <sup className="ml-1 text-[10px] align-top">{row.fl ? 'FL' : 'PB'}</sup>
                  )}
                </div>
              </div>
            ))}
          </div>
          {tower.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">Waiting for timing data...</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
