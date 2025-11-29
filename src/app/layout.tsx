import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from "@vercel/analytics/next"
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
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(s){s.dataset.zone='10248228',s.src='https://groleegni.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))",
          }}
          
        />
        <link rel="icon" href="/M.png" sizes="any" />
      </head>
      <body className={`${fontSans.variable} ${fontHeadline.variable} font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
