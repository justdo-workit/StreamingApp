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

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <p className="text-gray-400">For race alerts, join discord.</p>
                        <Link href="https://discord.gg/BwwumjNQT9" target="_blank">
                            <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                                <span className="mr-2">
                                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current"><title>Discord</title><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041-.001-.09-.045-.106a12.914 12.914 0 0 1-1.873-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.047.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.955 2.419-2.176 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.176 2.419 0 1.334-.955 2.419-2.176 2.419z" /></svg>
                                </span>
                                Join Discord
                            </Button>
                        </Link>
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
