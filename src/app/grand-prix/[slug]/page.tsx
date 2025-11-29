import Image from "next/image";
import { notFound } from "next/navigation";
import { grandPrixes, placeholderImages } from "@/lib/data";
import AdPlaceholder from "@/components/shared/AdPlaceholder";
import GpHeroAd from "@/components/shared/GpHeroAd";
import CountdownTimer from "@/components/gp/CountdownTimer";
import ScheduleGrid from "@/components/gp/ScheduleGrid";
import RaceFacts from "@/components/gp/RaceFacts";
import Footer from "@/components/layout/Footer";
import GpBottomAd from "@/components/shared/GpBottomAd";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";

type GrandPrixPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return grandPrixes.map((g) => ({ slug: g.slug }));
}

export default async function GrandPrixPage({ params }: GrandPrixPageProps) {
  const { slug } = await params;
  const gp = grandPrixes.find((g) => g.slug === slug);

  if (!gp) {
    notFound();
  }

  const heroImage = placeholderImages.find((img) => img.id === 'gp-hero');
  const heroBySlug: Record<string, string> = {
    qatar: "https://media.formula1.com/image/upload/t_16by9Centre/c_lfill,w_3392/q_auto/v1740000000/fom-website/campaign/GettyImages-1443333888.webp",
    "abu-dhabi": "https://media.formula1.com/image/upload/c_lfill,w_3392/q_auto/v1740000000/content/dam/fom-website/manual/XPB_Images/XPB_1025166_HiRes.webp",
  };
  const heroUrlOverride = heroBySlug[gp.slug as keyof typeof heroBySlug];
  const raceSession = gp.schedule.find(s => s.name === 'Race');

  return (
    <div className="flex min-h-screen flex-col">
       <Header grandPrixName="Slipstreams" showBack a_href="/" />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[300px] w-full text-white">
            {(heroUrlOverride || heroImage) && (
              <Image
                src={heroUrlOverride || heroImage!.imageUrl}
                alt={heroImage ? heroImage.description : gp.name}
                fill
                className="object-cover object-bottom  "
                priority
                quality={70}
                data-ai-hint={heroImage?.imageHint}
              />
            )}
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <h1 className="font-headline text-4xl font-bold md:text-6xl">{gp.name}</h1>
                <p className="mt-2 text-lg font-normal text-gray-300"> {gp.date}</p>
                {raceSession && <CountdownTimer targetDate={raceSession.time} />}
            </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Ad below Countdown */}
            <GpHeroAd />

            {/* Schedule Grid */}
            <ScheduleGrid schedule={gp.schedule} grandPrixSlug={gp.slug} />
            {/* Race Facts */}
            <RaceFacts circuit={gp.circuit} />
        </div>
        {/* Bottom page ad */}
        <GpBottomAd />
      </main>
      <Footer />
    </div>
  );
}
