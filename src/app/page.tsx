import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag } from 'lucide-react';
import HomeTopBannerAd from '@/components/shared/HomeTopBannerAd';
import HomeAfterIntroAd from '@/components/shared/HomeAfterIntroAd';
import AdPlaceholder from '@/components/shared/AdPlaceholder';
import Footer from '@/components/layout/Footer';
import GpBottomAd from '@/components/shared/GpBottomAd';
import { grandPrixes, placeholderImages } from '@/lib/data';
import HomeBoxAd from '@/components/shared/HomeBoxAd';

export default function Home() {
  const currentGrandPrix =
    grandPrixes.find((gp) => gp.slug === 'abu-dhabi') ?? grandPrixes[0];
  const upcomingGPs = grandPrixes;
  const heroImage = placeholderImages.find((img) => img.id === 'home-hero');

  // very small helper to map GP name to ISO country code for flagcdn
  const getCountryCode = (name: string) => {
    const n = name.toLowerCase();
    const map: Record<string, string> = {
      qatar: 'qa',
      bahrain: 'bh',
      saudi: 'sa',
      'saudi arabia': 'sa',
      australia: 'au',
      japanese: 'jp',
      japan: 'jp',
      'abu dhabi': 'ae',
      'united arab emirates': 'ae',
    };
    for (const key of Object.keys(map)) {
      if (n.includes(key)) return map[key];
    }
    return '';
  };

  const heroFlagCode = getCountryCode(currentGrandPrix.name);

  return (
    <div className="flex min-h-screen flex-col overflow-hidden ">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[95vh] min-h-[400px] w-full text-white">
          {/* Mobile background */}
          <Image
            src="https://i.pinimg.com/736x/5d/17/4a/5d174a4702f1b343b4afc4db8e1f3ea6.jpg"
            alt="Slipstreams mobile hero background"
            fill
            className="object-cover md:hidden"
            priority
            quality={70}
          />

          {/* Desktop / larger screens background */}
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
       
              className="hidden md:block object-cover"
              priority
              quality={70}
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-headline font-bold tracking-tight md:text-5xl">
              Slipstreams
            </h1>
            <p className="mt-4 max-w-2xl font-normal text-gray-300 md:text-4xl">
              Your front-row seat to every Formula 1 race. Live, fast, and for the fans.
            </p>
            <Button asChild size="lg" className="mt-8">
              <Link prefetch href={`/grand-prix/${currentGrandPrix.slug}`}>
                {heroFlagCode && (
                  <span className="mr-2 inline-flex items-center">
                    <span className="relative h-5 w-7 overflow-hidden rounded-sm">
                      <Image
                        src={`https://flagcdn.com/48x36/${heroFlagCode}.png`}
                        alt={`${currentGrandPrix.name} flag`}
                        fill
                        className="object-cover"
                        sizes="28px"
                      />
                    </span>
                  </span>
                )}
                Abu Dhabi GP
              </Link>
            </Button>
            <p className="mt-4 text-sm font-normal text-gray-400">
              for quick updates and alerts, join our Discord channel
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Top banner ad (728x90) below Hero */}

          <HomeBoxAd/>
          <div className="my-8">
        
          </div>  

          {/* Up Next Section */}
          <section className="py-12">
            <h2 className="mb-6 text-start uppercase font-headline text-4xl font-bold">
              Up Next
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingGPs.map((gp) => (
                <Link key={gp.slug} prefetch href={`/grand-prix/${gp.slug}`}>
                  <Card className="relative aspect-[1/1] overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
                    {gp.cover && (
                      <>
                        <Image
                          src={gp.cover}
                          alt={`${gp.name} cover`}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          quality={60}
                        />
                        <div className="absolute inset-0 bg-black/50" />
                      </>
                    )}
                    {gp.slug === 'qatar' && (
                      <div className="absolute left-3 top-3 z-20 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                        Completed
                      </div>
                    )}
                    {(() => {
                      const code = getCountryCode(gp.name);
                      return (
                        <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-14   overflow-hidden">
                              {code ? (
                                <Image
                                  src={`https://flagcdn.com/48x36/${code}.png`}
                                  alt={`${gp.name} flag`}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-white/80">GP</div>
                              )}
                            </div>
                            <div className="leading-tight">
                              <div className="font-headline font-bold text-white">{gp.name.replace(' Grand Prix', ' GP')} 2025</div>
                              <div className="text-sm text-white/70">{gp.date}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </Card>
                </Link>
              ))}
            </div>
          </section>

       

          {/* Introduction Section */}
          <section className="py-12">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl font-bold">
                  Unrivaled F1 Action
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 font-normal text-muted-foreground">
                <p>
                  Slipstreams is built for F1 fans who want fast, simple access to live race weekends without the clutter.
                </p>
                <p>
                  Beyond live streams, we provide dynamic race data, including live driver standings, lap timings, and interactive track maps. Our goal is to enhance your viewing experience by bringing all the critical information directly to your screen, creating a comprehensive hub for every F1 fan.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Ad after Introduction (effectivegatecpm) */}
  

              <GpBottomAd />

          {/* Disclaimer and Policies */}
          <section className="">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold">
                  Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm font-normal text-muted-foreground">
                <p>
                  Slipstreams is an independent, unofficial platform and is not affiliated with Formula One Group, FIA, or any of their associated companies. All trademarks and copyrights, including F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, and GRAND PRIX, are owned by Formula One Licensing B.V. and other respective owners. We do not own, host, or stream copyrighted material; the service only provides links to third-party sources, and users are solely responsible for ensuring compliance with local laws.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>

        {/* Sticky bottom banner for mobile */}
        <div className="md:hidden">
        </div>
      </main>
      <Footer />
    </div>
  );
}
