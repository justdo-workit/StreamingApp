"use client";

import { MessageCircle, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">Slipstreams</p>
          <div className="flex items-center gap-4">
            <a
              href="https://discord.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Discord</span>
            </a>
            <a
              href="https://t.me/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Send className="h-4 w-4" />
              <span>Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
