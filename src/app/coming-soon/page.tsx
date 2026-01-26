import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 text-white">
            {/* Background Gradient & Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black opacity-80" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 space-y-8">

                    {/* Icon/Logo Placeholder */}
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shadow-2xl shadow-primary/20 ring-1 ring-primary/40 backdrop-blur-xl">
                        <Flag className="h-10 w-10 text-primary animate-pulse" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 sm:text-7xl">
                            Slipstreams
                        </h1>
                        <p className="mx-auto max-w-lg text-lg text-neutral-400 font-light tracking-wide sm:text-xl">
                            <span className="text-primary font-semibold">Coming Soon</span>. The ultimate F1 experience is just around the corner.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        <Button asChild size="lg" className="rounded-full px-8 text-base font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                            <Link href="/">
                                Return to Pit Lane
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-12 flex justify-center gap-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-1.5 w-1.5 rounded-full bg-neutral-800 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
}
