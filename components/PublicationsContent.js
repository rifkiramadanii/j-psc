'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import BookCard from '@/components/BookCard';
// Hapus import { books } from '@/lib/books';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';

const CATEGORY_ORDER = ['social', 'education', 'arabic', 'islamic'];

export default function PublicationsContent() {
  const { language } = useLanguage();
  const t = getDictionary(language).publications;
  const categories = getDictionary(language).categories;
  
  const [activeCategory, setActiveCategory] = useState('all');
  
  // 1. State baru untuk menampung data dari database
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Fetch data dari API saat halaman dimuat
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/publications');
        const json = await res.json();
        
        if (json.success) {
          // Transformasi format kolom database menjadi format yang dimengerti komponen
          const formattedBooks = json.data.map(dbBook => ({
            slug: dbBook.slug,
            title: {
              en: dbBook.title_en,
              id: dbBook.title_id
            },
            author: dbBook.author,
            year: dbBook.publish_year,
            isbn: dbBook.isbn,
            category: dbBook.category,
            coverColor: dbBook.cover_color,
            description: {
              en: dbBook.description_en,
              id: dbBook.description_id
            },
            // Tambahkan field URL gambar
            coverImageUrl: dbBook.cover_image_url
          }));
          
          setBooks(formattedBooks);
        }
      } catch (error) {
        console.error("Gagal mengambil data publikasi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const visibleBooks = useMemo(() => {
    if (activeCategory === 'all') return books;
    return books.filter((book) => book.category === activeCategory);
  }, [activeCategory, books]);

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

          {/* Tampilkan status loading jika data sedang di-fetch */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500">Memuat katalog buku...</p>
            </div>
          ) : (
            <div className="book-grid">
              {visibleBooks.length > 0 ? (
                visibleBooks.map((book) => (
                  <Reveal as="div" key={book.slug}>
                    <BookCard
                      book={book}
                      language={language}
                      categoryLabel={categories[book.category]}
                      byAuthorLabel={t.byAuthor}
                      viewDetailsLabel={t.viewDetails}
                    />
                  </Reveal>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  Belum ada publikasi di kategori ini.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ... sisa kode section COMING SOON dan EXPECT tetap sama ... */}
      <section className="section section--tint">
         {/* ... */}
      </section>
    </>
  );
}