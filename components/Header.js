'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = getDictionary(language).common;

  const navItems = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/journals', label: t.nav.journals },
    { href: '/publications', label: t.nav.publications },
    { href: '/news', label: t.nav.news },
    { href: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="site-header">
      <nav className="nav">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <Image 
            src="/logo.png"        // Pastikan Anda sudah menyimpan logo.png di folder "public"
            alt="Logo J-PSC" 
            width={40}             // Atur lebar logo (dalam pixel)
            height={40}            // Atur tinggi logo (dalam pixel)
            className="brand-logo" 
            priority               // priority memastikan logo langsung dimuat tanpa lazy loading
          />
          <span>
            PSC
            <br />
            <small>{t.brandTagline}</small>
          </span>
        </Link>

        <ul className={`nav-links ${open ? 'is-open' : ''}`}>
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-cta">
          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLanguage}
            aria-label="Switch language / Ganti bahasa"
          >
            <span className={language === 'id' ? 'is-active' : ''}>ID</span>
            <span className="lang-toggle-sep">|</span>
            <span className={language === 'en' ? 'is-active' : ''}>EN</span>
          </button>
          <Link href="/journals" className="btn btn-primary btn-sm">
            {t.viewJournals}
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
