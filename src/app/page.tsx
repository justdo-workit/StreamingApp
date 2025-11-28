import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag } from 'lucide-react';
import AdBanner from '@/components/shared/AdBanner';
import AdPlaceholder from '@/components/shared/AdPlaceholder';
import Footer from '@/components/layout/Footer';
import { grandPrixes, placeholderImages } from '@/lib/data';

export default function Home() {
  const currentGrandPrix = grandPrixes[0];
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

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[90vh] min-h-[400px] w-full text-white">
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
                <Flag className="mr-2 h-5 w-5" />
                {currentGrandPrix.name}
              </Link>
            </Button>
            <p className="mt-4 text-sm font-normal text-gray-400">
              for quick updates and alterts ,<br/> join our Telegram or Discord channel
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Top banner ad (728x90) below Hero */}
          <div className="my-8 flex justify-center">
            <AdBanner
              width={728}
              height={90}
              zoneKey="912074aa3de30a2f3cb2b3432d994606"
              scriptSrc="//www.highperformanceformat.com/912074aa3de30a2f3cb2b3432d994606/invoke.js"
            />
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

          {/* 300x250 ad above Disclaimer */}
          <div className="mx-auto my-8 flex justify-center">
            <AdBanner
              width={300}
              height={250}
              zoneKey="9942bce170e25aead636127279479c68"
              scriptSrc="//www.highperformanceformat.com/9942bce170e25aead636127279479c68/invoke.js"
            />
          </div>

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
            <AdPlaceholder label="Sticky Bottom Banner (320x50)" className="fixed bottom-0 left-0 z-50 h-[50px] w-full" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
