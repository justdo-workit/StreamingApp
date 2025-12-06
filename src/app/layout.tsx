import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from "@vercel/analytics/next"
import AppShell from "@/components/layout/AppShell";
const fontSans = localFont({
  src: '../fonts/f1Fonts/Formula1-Regular-1.ttf',
  variable: '--font-sans',
});

const fontHeadline = localFont({
  src: '../fonts/f1Fonts/Formula1-Bold_web.ttf',
  variable: '--font-headline',
});


export const metadata: Metadata = {
  title: 'Slipstreams',
  description: 'Slipstreams – the ultimate F1 streaming experience. ',
  icons: {
    icon: '/M.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        
        <link rel="icon" href="/M.png" sizes="any" />

    <meta name="google-adsense-account" content="ca-pub-3330435576859353"></meta>



      </head>
      <body className={`${fontSans.variable} ${fontHeadline.variable} font-sans antialiased`}>
        <AppShell>
          {children}
          <Toaster />
          <Analytics />
        </AppShell>
      </body>
    </html>
  );
}
