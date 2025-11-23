import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flag } from 'lucide-react';
import AdPlaceholder from '@/components/shared/AdPlaceholder';
import Footer from '@/components/layout/Footer';
import { grandPrixes, placeholderImages } from '@/lib/data';

export default function Home() {
  const currentGrandPrix = grandPrixes[0];
  const upcomingGPs = grandPrixes.slice(1);
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
              for quick updates and alterts , join our telegram channel
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Ad Placeholder below Hero */}
          <AdPlaceholder
            label="Banner Ad (970x90)"
            className="my-8 h-[90px] w-full"
          />

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
                            <div className="relative h-10 w-10 rounded-full ring-2 ring-white/80 bg-neutral-900 overflow-hidden">
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
                  ApexStream is a premier destination for Formula 1 enthusiasts, offering a seamless and immersive streaming experience. We are dedicated to providing high-quality, reliable access to every Grand Prix weekend, from the first practice session to the final lap of the race. Our platform is built with a mobile-first approach, ensuring you never miss a moment, whether you&apos;re at home or on the go.
                </p>
                <p>
                  Beyond live streams, we provide dynamic race data, including live driver standings, lap timings, and interactive track maps. Our goal is to enhance your viewing experience by bringing all the critical information directly to your screen, creating a comprehensive hub for every F1 fan.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Ad Placeholder above Disclaimer */}
          <AdPlaceholder
            label="CPM Display Ad (300x250)"
            className="mx-auto my-8 h-[250px] w-[300px]"
          />

          {/* Disclaimer and Policies */}
          <section className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold">
                  Disclaimer
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm font-normal text-muted-foreground">
                <p>
                  ApexStream is an independent platform and is not affiliated with Formula One Group, FIA, or any of its associated companies. All trademarks and copyrights belong to their respective owners. We do not own, host, or stream any copyrighted material. This service provides links to third-party streaming sources and does not verify the legality or quality of the content. Users are responsible for their own actions and must comply with their local laws.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl font-bold">
                  Privacy & Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm font-normal text-muted-foreground">
                <p>
                  <strong>1. Data Usage:</strong> We collect anonymous usage data to improve our service and optimize ad placements. We do not sell personal data.
                </p>
                <p>
                  <strong>2. Cookies:</strong> We use cookies to enhance user experience. By using ApexStream, you consent to our use of cookies.
                </p>
                <p>
                  <strong>3. Conduct:</strong> Please be respectful in any community features. Hate speech or harassment will not be tolerated.
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
