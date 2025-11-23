import Image from "next/image";
import { notFound } from "next/navigation";
import { grandPrixes, placeholderImages } from "@/lib/data";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import CountdownTimer from "@/components/gp/CountdownTimer";
import ScheduleGrid from "@/components/gp/ScheduleGrid";
import RaceFacts from "@/components/gp/RaceFacts";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";

type GrandPrixPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return grandPrixes.map((g) => ({ slug: g.slug }));
}

export default function GrandPrixPage({ params }: GrandPrixPageProps) {
  const gp = grandPrixes.find((g) => g.slug === params.slug);

  if (!gp) {
    notFound();
  }

  const heroImage = placeholderImages.find((img) => img.id === 'gp-hero');
  const raceSession = gp.schedule.find(s => s.name === 'Race');

  return (
    <div className="flex min-h-screen flex-col">
       <Header grandPrixName={gp.name} showBack a_href="/" />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[300px] w-full text-white">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                priority
                quality={70}
                data-ai-hint={heroImage.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <h1 className="font-headline text-4xl font-bold md:text-6xl">{gp.name}</h1>
                <p className="mt-2 text-lg font-normal text-gray-300">{gp.date}</p>
                {raceSession && <CountdownTimer targetDate={raceSession.time} />}
            </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Ad Placeholder below Countdown */}
            <AdPlaceholder label="Banner Ad (970x90)" className="my-8 h-[90px] w-full" />

            {/* Schedule Grid */}
            <ScheduleGrid schedule={gp.schedule} grandPrixSlug={gp.slug} />

            {/* Ad Placeholder between schedule and facts */}
            <AdPlaceholder label="Inline Display Ad (728x90)" className="my-12 h-[90px] w-full max-w-4xl mx-auto" />

            {/* Race Facts */}
            <RaceFacts circuit={gp.circuit} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
