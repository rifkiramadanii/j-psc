'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { newsItems } from '@/lib/news';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';

export default function NewsContent() {
  const { language } = useLanguage();
  const t = getDictionary(language).news;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">{t.pageEyebrow}</p>
          <h1>{t.pageTitle}</h1>
          <p className="lede">{t.pageLede}</p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: '820px' }}>
          {newsItems.map((item) => (
            <Reveal className="news-item" key={item.title.en}>
              <div className="news-date">{item.date[language]}</div>
              <div>
                <span className="news-tag">{item.tag[language]}</span>
                <h3 style={{ marginTop: '0.5em' }}>{item.title[language]}</h3>
                <p>{item.body[language]}</p>
                <Link href={item.linkHref} className="btn btn-secondary btn-sm" target='_blank'>
                  {item.linkLabel[language]}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
