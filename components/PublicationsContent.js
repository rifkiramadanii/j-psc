'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import BookCard from '@/components/BookCard';
import { books } from '@/lib/books';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';

const CATEGORY_ORDER = ['social', 'education', 'arabic', 'islamic'];

export default function PublicationsContent() {
  const { language } = useLanguage();
  const t = getDictionary(language).publications;
  const categories = getDictionary(language).categories;
  const [activeCategory, setActiveCategory] = useState('all');

  const visibleBooks = useMemo(() => {
    if (activeCategory === 'all') return books;
    return books.filter((book) => book.category === activeCategory);
  }, [activeCategory]);

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">{t.pageEyebrow}</p>
          <h1>{t.pageTitle}</h1>
          <p className="lede">{t.pageLede}</p>
        </div>
      </div>

      {/* BOOK CATALOG */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.catalogEyebrow}</p>
          <h2>{t.catalogTitle}</h2>
          <p className="lede" style={{ marginBottom: '1.8rem' }}>
            {t.catalogLede}
          </p>

          <div className="catalog-filters" role="group" aria-label="Filter by category">
            <button
              type="button"
              className={`filter-tab ${activeCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {t.filterAll}
            </button>
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`filter-tab ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {categories[cat]}
              </button>
            ))}
          </div>

          <div className="book-grid">
            {visibleBooks.map((book) => (
              <Reveal as="div" key={book.slug}>
                <BookCard
                  book={book}
                  language={language}
                  categoryLabel={categories[book.category]}
                  byAuthorLabel={t.byAuthor}
                  viewDetailsLabel={t.viewDetails}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMING SOON: PROCEEDINGS / REPORTS */}
      <section className="section section--tint">
        <div className="container two-col">
          <Reveal>
            <p className="eyebrow">{t.comingSoonEyebrow}</p>
            <h2>{t.comingSoonTitle}</h2>
            <p>{t.comingSoonP1}</p>
            <p>{t.comingSoonP2}</p>
            <Link href="/contact" className="btn btn-secondary btn-sm">
              {t.contactEditorial}
            </Link>
          </Reveal>
          <Reveal>
            <div className="future-note">{t.futureNote}</div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.expectEyebrow}</p>
          <h2>{t.expectTitle}</h2>
          <div className="cards-3" style={{ marginTop: '2rem' }}>
            <Reveal className="plain-card">
              <h3>{t.expect1Title}</h3>
              <p>{t.expect1Body}</p>
            </Reveal>
            <Reveal className="plain-card">
              <h3>{t.expect2Title}</h3>
              <p>{t.expect2Body}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
