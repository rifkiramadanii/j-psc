'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';
import { siteConfig } from '@/lib/site-config';

export default function BookDetailContent({ book }) {
  const { language } = useLanguage();
  const t = getDictionary(language).bookDetail;
  const categories = getDictionary(language).categories;

  if (!book) {
    return (
      <div className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1>{t.notFoundTitle}</h1>
          <p className="lede" style={{ margin: '0 auto 1.5rem' }}>
            {t.notFoundBody}
          </p>
          <Link href="/publications" className="btn btn-secondary">
            {t.backToCatalog}
          </Link>
        </div>
      </div>
    );
  }

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    language === 'id'
      ? `Halo J-PSC, saya ingin bertanya tentang buku "${book.title.id}".`
      : `Hello J-PSC, I'd like to ask about the book "${book.title.en}".`
  )}`;

  const emailHref = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
    (language === 'id' ? 'Pertanyaan tentang buku: ' : 'Question about the book: ') +
      book.title[language]
  )}`;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <Link href="/publications" className="back-link">
            &larr; {t.backToCatalog}
          </Link>
        </div>
      </div>

      <section className="section">
        <div className="container book-detail-grid">
          <div className="book-detail-cover" style={{ background: book.coverColor }}>
            <span className="book-cover-category">{categories[book.category]}</span>
            <span className="book-detail-cover-title">{book.title[language]}</span>
          </div>

          <div>
            <h1>{book.title[language]}</h1>
            <p className="lede" style={{ marginBottom: '1.6rem' }}>
              {book.description[language]}
            </p>

            <div className="journal-facts" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div>
                <div className="journal-fact-label">{t.authorLabel}</div>
                <div className="journal-fact-value">{book.author}</div>
              </div>
              <div>
                <div className="journal-fact-label">{t.yearLabel}</div>
                <div className="journal-fact-value">{book.year}</div>
              </div>
              <div>
                <div className="journal-fact-label">{t.categoryLabel}</div>
                <div className="journal-fact-value">{categories[book.category]}</div>
              </div>
              <div>
                <div className="journal-fact-label">{t.isbnLabel}</div>
                <div className="journal-fact-value">{book.isbn}</div>
              </div>
            </div>

            <div className="plain-card" style={{ marginTop: '1.8rem' }}>
              <h3>{t.purchaseTitle}</h3>
              <p>{t.purchaseBody}</p>
              <div className="journal-actions">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-teal btn-sm"
                >
                  {t.chatAboutBook}
                </a>
                <a href={emailHref} className="btn btn-secondary btn-sm">
                  {t.emailAboutBook}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
