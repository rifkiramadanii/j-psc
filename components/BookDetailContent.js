'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';
import { siteConfig } from '@/lib/site-config';

export default function BookDetailContent({ book }) {
  const { language } = useLanguage();
  const t = getDictionary(language).bookDetail;
  const categories = getDictionary(language).categories;

  // Menyesuaikan pemanggilan data dengan kolom database MySQL
  const title = language === 'en' ? book.title_en : book.title_id;
  const description = language === 'en' ? book.desc_en : book.desc_id;

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    language === 'id'
      ? `Halo J-PSC, saya ingin bertanya tentang buku "${title}".`
      : `Hello J-PSC, I'd like to ask about the book "${title}".`
  )}`;

  const emailHref = `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
    (language === 'id' ? 'Pertanyaan tentang buku: ' : 'Question about the book: ') + title
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
          
          {/* BAGIAN COVER */}
          <div 
            className="book-detail-cover" 
            style={{ 
              background: book.cover_color || '#e5e7eb',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {book.cover_image_url ? (
              <img 
                src={book.cover_image_url} 
                alt={title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0
                }}
              />
            ) : (
              <>
                <span className="book-cover-category">{categories[book.category]}</span>
                <span className="book-detail-cover-title">{title}</span>
              </>
            )}
          </div>

          {/* BAGIAN INFO BUKU */}
          <div>
            <h1>{title}</h1>
            <p className="lede" style={{ marginBottom: '1.6rem', whiteSpace: 'pre-wrap' }}>
              {description}
            </p>

            <div className="journal-facts" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <div>
                <div className="journal-fact-label">{t.authorLabel}</div>
                <div className="journal-fact-value">{book.author}</div>
              </div>
              <div>
                <div className="journal-fact-label">{t.yearLabel}</div>
                <div className="journal-fact-value">{book.publish_year}</div> {/* Disesuaikan DB */}
              </div>
              <div>
                <div className="journal-fact-label">{t.categoryLabel}</div>
                <div className="journal-fact-value">{categories[book.category]}</div>
              </div>
              <div>
                <div className="journal-fact-label">{t.isbnLabel}</div>
                <div className="journal-fact-value">{book.isbn || '-'}</div>
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