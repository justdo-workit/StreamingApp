import { NextRequest, NextResponse } from "next/server";
import { grandPrixes } from "@/lib/data";

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const gp = grandPrixes.find((g) => g.slug === slug);

  if (!gp) {
    return new NextResponse("Grand Prix not found", { status: 404 });
  }

  const lines: string[] = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//Slipstreams.live//F1 Weekend//EN");

  const now = new Date();
  const dtStamp = formatIcsDate(now);

  gp.schedule.forEach((s) => {
    const start = new Date(s.time);
    const durationMinutes = s.name.toLowerCase().includes("race") ? 120 : 60;
    const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

    const uid = `${slug}-${s.id}@slipstreams.live`;
    const dtStart = formatIcsDate(start);
    const dtEnd = formatIcsDate(end);

    const title = `${gp.name} – ${s.name}`;
    const description = [
      `Slipstreams.live session for ${gp.name} – ${s.name}.`,
      "",
      "Watch on slipstreams.live or go directly:",
      `https://slipstreams.app/stream/${gp.slug}?session=${encodeURIComponent(s.name)}`,
    ].join("\\n");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dtStamp}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${title.replace(/,/g, "\\,")}`);
    lines.push(`DESCRIPTION:${description.replace(/\\n/g, "\\n").replace(/,/g, "\\,")}`);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");

  const body = lines.join("\r\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename=slipstreams-${slug}-weekend.ics`,
    },
  });
}
