import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type DriverInfo = {
  driver_number: number;
  name_acronym?: string;
  broadcast_name?: string;
  team_colour?: string;
};

async function fetchJson<T>(url: string) : Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

function sseInit(headers?: Record<string,string>) {
  return {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      ...(headers || {}),
    },
  };
}

function encoder() {
  const enc = new TextEncoder();
  return (event: string, data: any) => enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const country = url.searchParams.get("country") || "";
  const sessionName = url.searchParams.get("session") || "Race";
  const year = url.searchParams.get("year") || "latest";
  const sessionKeyParam = url.searchParams.get("session_key");

  let sessionKey: number | null = null;
  if (sessionKeyParam) {
    const n = Number(sessionKeyParam);
    if (!Number.isFinite(n)) {
      return new NextResponse("Invalid session_key", { status: 400 });
    }
    sessionKey = n;
  }

  if (!sessionKey) {
    try {
      const qs: string[] = [];
      if (country) qs.push(`country_name=${encodeURIComponent(country)}`);
      if (sessionName) qs.push(`session_name=${encodeURIComponent(sessionName)}`);
      if (year) qs.push(`year=${encodeURIComponent(year)}`);
      const sessions = await fetchJson<any[]>(`https://api.openf1.org/v1/sessions${qs.length ? `?${qs.join("&")}` : ""}`);
      if (sessions && sessions.length > 0) {
        // Use the first returned; OpenF1 typically returns recent first.
        sessionKey = sessions[0].session_key;
      }
    } catch (e) {}
  }

  if (!sessionKey) {
    return new NextResponse("Session not found", { status: 404 });
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const write = encoder();
      const send = (event: string, data: any) => controller.enqueue(write(event, data));

      let closed = false;
      const abort = () => {
        closed = true;
        clearInterval(loopFast);
        clearInterval(loopSlow);
        clearInterval(loopLocation);
        clearInterval(heartbeat);
        controller.close();
      };

      const signal = (req as any).signal as AbortSignal | undefined;
      signal?.addEventListener("abort", abort);

      const base = `https://api.openf1.org/v1`;

      let lastPos = new Date(Date.now() - 5000).toISOString();
      let lastInt = new Date(Date.now() - 5000).toISOString();
      let lastLoc = new Date(Date.now() - 2000).toISOString();
      let lastLap = new Date(Date.now() - 10000).toISOString();
      let driversMap: Record<number, DriverInfo> = {};

      const bootstrap = async () => {
        try {
          const drivers = await fetchJson<any[]>(`${base}/drivers?session_key=${sessionKey}`);
          for (const d of drivers) {
            driversMap[d.driver_number] = {
              driver_number: d.driver_number,
              name_acronym: d.name_acronym,
              broadcast_name: d.broadcast_name,
              team_colour: d.team_colour,
            };
          }
          send("init", { session_key: sessionKey, drivers: driversMap });
          try {
            const sessions = await fetchJson<any[]>(`${base}/sessions?session_key=${sessionKey}`);
            if (sessions && sessions.length) {
              const s = sessions[0];
              send("session", { session_key: sessionKey, date_start: s.date_start, date_end: s.date_end, meeting_key: s.meeting_key, session_name: s.session_name });
            }
          } catch {}
        } catch {}
      };

      bootstrap();

      const pollFast = async () => {
        if (closed) return;
        try {
          const [positions, intervals] = await Promise.all([
            fetchJson<any[]>(`${base}/position?session_key=${sessionKey}&date>=${encodeURIComponent(lastPos)}`),
            fetchJson<any[]>(`${base}/intervals?session_key=${sessionKey}&date>=${encodeURIComponent(lastInt)}`),
          ]);
          if (positions.length) {
            lastPos = positions[positions.length - 1].date;
            send("positions", positions);
          }
          if (intervals.length) {
            lastInt = intervals[intervals.length - 1].date;
            send("intervals", intervals);
          }
        } catch {}
      };

      const pollLocation = async () => {
        if (closed) return;
        try {
          const locations = await fetchJson<any[]>(`${base}/location?session_key=${sessionKey}&date>=${encodeURIComponent(lastLoc)}`);
          if (locations.length) {
            lastLoc = locations[locations.length - 1].date;
            send("locations", locations);
          }
        } catch {}
      };

      const pollSlow = async () => {
        if (closed) return;
        try {
          const laps = await fetchJson<any[]>(`${base}/laps?session_key=${sessionKey}&date_start>=${encodeURIComponent(lastLap)}`);
          if (laps.length) {
            lastLap = laps[laps.length - 1].date_start;
            send("laps", laps);
          }
        } catch {}
      };

      const loopFast = setInterval(pollFast, 4000);
      const loopLocation = setInterval(pollLocation, 1000);
      const loopSlow = setInterval(pollSlow, 10000);
      const heartbeat = setInterval(() => {
        if (!closed) controller.enqueue(new TextEncoder().encode(`: ping\n\n`));
      }, 15000);

      send("ready", { ok: true });
    },
  });

  return new Response(stream, sseInit());
}
