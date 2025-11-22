import { cn } from "@/lib/utils";
import { Megaphone } from "lucide-react";

type AdPlaceholderProps = {
  label: string;
  className?: string;
};

export default function AdPlaceholder({
  label,
  className,
}: AdPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border-2 border-dashed border-destructive bg-destructive/10 text-destructive",
        className
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <Megaphone className="h-6 w-6" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
    </div>
  );
}
