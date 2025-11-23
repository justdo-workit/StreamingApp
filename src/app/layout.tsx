import type {Metadata} from 'next';
import { Roboto, Roboto_Condensed } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-roboto-condensed',
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
      <body className={`${roboto.variable} ${robotoCondensed.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
