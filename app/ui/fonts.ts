import { Inter, Lusitana } from 'next/font/google';

/* Global Font */
export const inter = Inter({ subsets: ['latin'] });
/*export const lobster = Inter({ subsets: ['latin'] });
export const lusitana = Inter({ subsets: ['latin']});*/

export const lusitana = Lusitana({
    weight: ['400', '700'],
    subsets: ['latin'],
  });
