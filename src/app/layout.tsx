import type {Metadata} from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const fontSans = localFont({
  src: [
    {
      path: '../../public/fonts/Formula1-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Formula1-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Formula1-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-sans',
});

const fontHeadline = localFont({
  src: [
    {
      path: '../../public/fonts/Formula1-Wide.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-headline',
});


export const metadata: Metadata = {
  title: 'ApexStream',
  description: 'The ultimate F1 streaming experience.',
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
