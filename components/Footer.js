'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';
import { siteConfig } from '@/lib/site-config';

export default function Footer() {
  const { language } = useLanguage();
  const t = getDictionary(language).common;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand" style={{ color: '#fff', marginBottom: '1rem' }}>
              <Image 
                          src="/logo.png"        // Pastikan Anda sudah menyimpan logo.png di folder "public"
                          alt="Logo J-PSC" 
                          width={40}             // Atur lebar logo (dalam pixel)
                          height={40}            // Atur tinggi logo (dalam pixel)
                          className="brand-logo" 
                          priority               // priority memastikan logo langsung dimuat tanpa lazy loading
              />
              <span>PSC</span>
            </div>
            <p>{t.footer.tagline}</p>
          </div>

          <div>
            <h4>{t.footer.explore}</h4>
            <ul>
              <li><Link href="/about">{t.nav.about}</Link></li>
              <li><Link href="/journals">{t.nav.journals}</Link></li>
              <li><Link href="/publications">{t.nav.publications}</Link></li>
              <li><Link href="/news">{t.nav.news}</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t.footer.journalsHeading}</h4>
            <ul>
              <li><Link href="/journals#jsp">JSP</Link></li>
              <li><Link href="/journals#jeps">JEPS</Link></li>
              <li><Link href="/journals#jas">JAS</Link></li>
              <li><Link href="/journals#jciw">JCIW</Link></li>
            </ul>
          </div>

          <div>
            <h4>{t.footer.contactHeading}</h4>
            <ul>
              <li><Link href="/contact">{t.footer.contactForm}</Link></li>
              <li><a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t.footer.rights}</span>
          <span>{t.footer.builtWith}</span>
        </div>
      </div>
    </footer>
  );
}
