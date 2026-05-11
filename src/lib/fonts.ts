import { Russo_One, Outfit, Manrope } from 'next/font/google';

export const russoOne = Russo_One({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const outfit = Outfit({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
});

export const manrope = Manrope({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
