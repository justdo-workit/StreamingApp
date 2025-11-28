"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type DriverInfo = {
  driver_number: number;
  name_acronym?: string;
  broadcast_name?: string;
  team_colour?: string;
};

export type IntervalRow = {
  driver_number: number;
  interval?: number; // to car ahead (s)
  gap_to_leader?: number; // to leader (s)
  date: string;
};

export type PositionRow = {
  driver_number: number;
  position: number;
  date: string;
};

export type LocationRow = {
  driver_number: number;
  x: number;
  y: number;
  z?: number;
  date: string;
};

export type LapRow = {
  driver_number: number;
  lap_number: number;
  date_start: string;
  lap_duration?: number;
};

export type TowerEntry = {
  pos: number;
  num: number;
  acr?: string;
  gap?: number;
  int?: number;
  colour?: string;
  lap?: number;
  last?: number; // seconds
  best?: number; // personal best seconds
  pb?: boolean; // was last lap personal best
  fl?: boolean; // was last lap overall session fastest
};

export type UseF1StreamParams = {
  country?: string; // e.g. "Singapore"
  year?: string | number; // e.g. 2023 or "latest"
  session?: string; // e.g. "Race", "Qualifying", "Sprint"
  session_key?: number; // optional override for direct historical session
};

export function useF1Stream(params: UseF1StreamParams) {
  const { country, year = "latest", session = "Race", session_key } = params || {};
  const [connected, setConnected] = useState(false);
  const [sessionKey, setSessionKey] = useState<number | null>(session_key ?? null);
  const [drivers, setDrivers] = useState<Record<number, DriverInfo>>({});
  const [sessionWindow, setSessionWindow] = useState<{ start?: string; end?: string } | null>(null);

  const positionsRef = useRef<Map<number, PositionRow>>(new Map());
  const intervalsRef = useRef<Map<number, IntervalRow>>(new Map());
  const locationsRef = useRef<Map<number, LocationRow>>(new Map());
  const locHistoryRef = useRef<Map<number, LocationRow[]>>(new Map());
  const lapsRef = useRef<Map<number, LapRow>>(new Map());
  const bestLapByDriverRef = useRef<Map<number, number>>(new Map());

  const [, force] = useState(0);
  const forceRerender = () => force((n) => n + 1);

  useEffect(() => {
    let es: EventSource | null = null;
    let url = "/api/f1/stream";
    const qs = new URLSearchParams();
    if (session_key) qs.set("session_key", String(session_key));
    if (country) qs.set("country", country);
    if (year !== undefined) qs.set("year", String(year));
    if (session) qs.set("session", session);
    const qsStr = qs.toString();
    if (qsStr) url += `?${qsStr}`;

    es = new EventSource(url);

    es.addEventListener("open", () => setConnected(true));
    es.addEventListener("error", () => setConnected(false));

    es.addEventListener("init", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data);
        // Reset caches when (re)initializing a session to avoid mixing events
        positionsRef.current.clear();
        intervalsRef.current.clear();
        locationsRef.current.clear();
        locHistoryRef.current.clear();
        lapsRef.current.clear();
        bestLapByDriverRef.current.clear();
        setSessionKey(data.session_key ?? null);
        setDrivers(data.drivers ?? {});
      } catch {}
    });

    es.addEventListener("session", (ev) => {
      try {
        const data = JSON.parse((ev as MessageEvent).data);
        setSessionWindow({ start: data.date_start, end: data.date_end });
      } catch {}
    });

    es.addEventListener("positions", (ev) => {
      try {
        const rows: any[] = JSON.parse((ev as MessageEvent).data) || [];
        for (const r of rows) {
          positionsRef.current.set(r.driver_number, r);
        }
        forceRerender();
      } catch {}
    });

    es.addEventListener("intervals", (ev) => {
      try {
        const rows: any[] = JSON.parse((ev as MessageEvent).data) || [];
        for (const r of rows) {
          intervalsRef.current.set(r.driver_number, r);
        }
        forceRerender();
      } catch {}
    });

    es.addEventListener("locations", (ev) => {
      try {
        const rows: any[] = JSON.parse((ev as MessageEvent).data) || [];
        for (const r of rows) {
          locationsRef.current.set(r.driver_number, r);
          const list = locHistoryRef.current.get(r.driver_number) ?? [];
          list.push(r);
          // Limit trail length per driver
          if (list.length > 200) list.splice(0, list.length - 200);
          locHistoryRef.current.set(r.driver_number, list);
        }
        forceRerender();
      } catch {}
    });

    es.addEventListener("laps", (ev) => {
      try {
        const rows: any[] = JSON.parse((ev as MessageEvent).data) || [];
        for (const r of rows) {
          lapsRef.current.set(r.driver_number, r);
          const v = typeof r.lap_duration === 'number' ? r.lap_duration : undefined;
          if (v && isFinite(v) && v > 0) {
            const prev = bestLapByDriverRef.current.get(r.driver_number);
            if (prev == null || v < prev - 1e-6) {
              bestLapByDriverRef.current.set(r.driver_number, v);
            }
          }
        }
        forceRerender();
      } catch {}
    });

    return () => {
      es?.close();
    };
  }, [country, year, session, session_key]);

  const tower: TowerEntry[] = useMemo(() => {
    const list: TowerEntry[] = [];
    // compute session-best among drivers' bests
    let sessionBest = Infinity;
    bestLapByDriverRef.current.forEach((t) => { if (t && t < sessionBest) sessionBest = t; });
    positionsRef.current.forEach((posRow) => {
      const d = drivers[posRow.driver_number];
      const intRow = intervalsRef.current.get(posRow.driver_number);
      const lapRow = lapsRef.current.get(posRow.driver_number);
      const best = bestLapByDriverRef.current.get(posRow.driver_number);
      const last = lapRow?.lap_duration;
      const pb = (last != null && best != null) ? Math.abs(last - best) < 1e-6 : false;
      const fl = pb && isFinite(sessionBest) && Math.abs(best! - sessionBest) < 1e-6;
      list.push({
        pos: posRow.position,
        num: posRow.driver_number,
        acr: d?.name_acronym || d?.broadcast_name?.split(" ")[0] || String(posRow.driver_number),
        gap: intRow?.gap_to_leader,
        int: intRow?.interval,
        colour: d?.team_colour,
        lap: lapRow?.lap_number,
        last,
        best,
        pb,
        fl,
      });
    });
    list.sort((a, b) => a.pos - b.pos);
    return list;
  }, [drivers, connected]);

  const trackPoints = useMemo(() => {
    // Use both latest points and recent history to estimate orientation
    const latest = Array.from(locationsRef.current.values());
    const allForBounds: LocationRow[] = [];
    locHistoryRef.current.forEach((arr) => allForBounds.push(...arr));
    if (allForBounds.length === 0 && latest.length === 0) {
      return { points: [] as Array<{ num: number; x: number; y: number; colour?: string; acr?: string }>, trails: [] as Array<{ num: number; pts: Array<{x:number;y:number}>, colour?: string }>, bbox: null as any, rotationRad: 0 };
    }

    const src = allForBounds.length ? allForBounds : latest;
    // Compute PCA-based orientation (major axis)
    let meanX = 0, meanY = 0;
    for (const p of src) { meanX += p.x; meanY += p.y; }
    meanX /= src.length; meanY /= src.length;
    let Sxx = 0, Syy = 0, Sxy = 0;
    for (const p of src) {
      const dx = p.x - meanX; const dy = p.y - meanY;
      Sxx += dx * dx; Syy += dy * dy; Sxy += dx * dy;
    }
    const theta = 0.5 * Math.atan2(2 * Sxy, Sxx - Syy); // angle of major axis vs x
    const c = Math.cos(-theta); // rotate by -theta to align major axis horizontally
    const s = Math.sin(-theta);

    // Rotate all points around mean, then normalize to [0,1]
    let rminX = Infinity, rmaxX = -Infinity, rminY = Infinity, rmaxY = -Infinity;
    const rotate = (x: number, y: number) => {
      const tx = x - meanX, ty = y - meanY;
      const rx = tx * c - ty * s;
      const ry = tx * s + ty * c;
      if (rx < rminX) rminX = rx; if (rx > rmaxX) rmaxX = rx;
      if (ry < rminY) rminY = ry; if (ry > rmaxY) rmaxY = ry;
      return { rx, ry };
    };
    // Pre-rotate for bounds
    const rotatedLatest = latest.map((p) => ({ num: p.driver_number, colour: drivers[p.driver_number]?.team_colour, acr: drivers[p.driver_number]?.name_acronym, ...rotate(p.x, p.y) }));
    const rotatedTrails: Array<{ num: number; arr: Array<{ rx: number; ry: number }> }> = [];
    locHistoryRef.current.forEach((arr, num) => {
      const out = arr.map((p) => rotate(p.x, p.y));
      rotatedTrails.push({ num, arr: out });
    });

    const w = Math.max(1e-6, rmaxX - rminX);
    const h = Math.max(1e-6, rmaxY - rminY);

    const points = rotatedLatest.map((p) => ({
      num: p.num,
      x: (p.rx - rminX) / w,
      y: (p.ry - rminY) / h,
      colour: p.colour,
      acr: p.acr,
    }));

    const trails: Array<{ num: number; pts: Array<{ x: number; y: number }>; colour?: string }> = rotatedTrails.map((t) => ({
      num: t.num,
      pts: t.arr.map((q) => ({ x: (q.rx - rminX) / w, y: (q.ry - rminY) / h })),
      colour: drivers[t.num]?.team_colour,
    }));

    return { points, trails, bbox: { minX: rminX, maxX: rmaxX, minY: rminY, maxY: rmaxY }, rotationRad: theta };
  }, [drivers, connected]);

  const currentLap = useMemo(() => {
    let m = 0;
    lapsRef.current.forEach((l) => { if (l.lap_number > m) m = l.lap_number; });
    return m;
  }, [connected]);

  const live = useMemo(() => {
    if (!sessionWindow?.start) return false;
    const now = Date.now();
    const start = Date.parse(sessionWindow.start);
    const end = sessionWindow.end ? Date.parse(sessionWindow.end) : start + 3 * 60 * 60 * 1000; // fallback 3h
    return now >= start - 60 * 1000 && now <= end + 2 * 60 * 1000; // small tolerance
  }, [sessionWindow]);

  // compute session best lap
  const sessionBestLap = useMemo(() => {
    let sb = Infinity;
    bestLapByDriverRef.current.forEach((t) => { if (t && t < sb) sb = t; });
    return isFinite(sb) ? sb : undefined;
  }, [connected]);

  return {
    connected,
    sessionKey,
    drivers,
    tower,
    trackPoints,
    currentLap,
    live,
    sessionBestLap,
  };
}
