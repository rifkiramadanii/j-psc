import { Noto_Sans, Noto_Serif } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  title: {
    default: 'J-PSC — Academic Publisher',
    template: '%s — J-PSC',
  },
  description:
    'J-PSC is an academic publisher supporting peer-reviewed, open-access journals across social praxis, education, Arabic studies, and the contemporary Islamic world.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        <LanguageProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
