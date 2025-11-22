import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  grandPrixName: string;
  showBack?: boolean;
  a_href?: string;
};

export default function Header({ grandPrixName, showBack = false, a_href="/" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center">
          {showBack && (
            <Button asChild variant="ghost" size="icon" className="mr-4">
              <Link href={a_href}>
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
          )}
          <h2 className="text-lg font-semibold tracking-tight">{grandPrixName}</h2>
        </div>
      </div>
    </header>
  );
}
