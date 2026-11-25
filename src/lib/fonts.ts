import { Manrope, Newsreader } from 'next/font/google';

export const newsreader = Newsreader({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const manrope = Manrope({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
