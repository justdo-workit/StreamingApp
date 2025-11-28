import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

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
  description: 'Slipstreams – the ultimate F1 streaming experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${fontSans.variable} ${fontHeadline.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
