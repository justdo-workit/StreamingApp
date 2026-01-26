import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";

export default function ComingSoonPage() {
    return (
        <div className="relative flex min-h-screen coming-soon flex-col items-center justify-center overflow-hidden bg-neutral-950 text-white">
            {/* Background Gradient & Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-black opacity-80" />
            <div className="absolute inset-0 bg-[url('https://cdn-5.motorsport.com/images/amp/Y9lLa7A2/s6/f1-2026-car-renders.jpg')] opacity-10 brightness-100 contrast-150" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-1000 space-y-8">

        
                    <div className="space-y-4">
                        <h1 className="text-5xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400 sm:text-7xl">
                            Slipstreams
                        </h1>
                        <p className="mx-auto max-w-4xl text-lg text-neutral-400 font-light tracking-wide sm:text-xl">
                            <span className="text-primary mb-10 md:text-7xl font-bold">Coming Soon</span>. 
                        </p>
                         <p className="mx-auto max-w-4xl text-lg text-neutral-400 font-light tracking-wide sm:text-xl">
                             Getting ready for 2026, The ultimate F1 experience is just around the corner.
                        </p>
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
