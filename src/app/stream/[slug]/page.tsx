import { notFound } from "next/navigation";
import {
  grandPrixes,
  streamSources,
  streamingUrls,
} from "@/lib/data";
import StreamLayout from "@/components/stream/StreamLayout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type StreamPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return grandPrixes.map((g) => ({ slug: g.slug }));
}

export default async function StreamPage({ params }: StreamPageProps) {
  const { slug } = await params;
  const gp = grandPrixes.find((g) => g.slug === slug);

  if (!gp) {
    notFound();
  }

  const getCountryCode = (name: string) => {
    const n = name.toLowerCase();
    const map: Record<string, string> = {
      qatar: "qa",
      bahrain: "bh",
      saudi: "sa",
      "saudi arabia": "sa",
      australia: "au",
      japanese: "jp",
      japan: "jp",
      "abu dhabi": "ae",
      "united arab emirates": "ae",
    };
    for (const key of Object.keys(map)) {
      if (n.includes(key)) return map[key];
    }
    return "";
  };

  const countryCode = getCountryCode(gp.name);
  const flagUrl = countryCode
    ? `https://flagcdn.com/48x36/${countryCode}.png`
    : undefined;

  return (
    <div className="flex min-h-screen flex-col">
       <Header
        grandPrixName={gp.name}
        showBack
        a_href={`/grand-prix/${gp.slug}`}
        showTimer={false}
        flagUrl={flagUrl}
      />
      <main className="flex-grow">
        <StreamLayout
          grandPrix={gp}
          streamSources={streamSources}
          streamingUrls={streamingUrls}
        />
      </main>
      <Footer />
    </div>
  );
}
