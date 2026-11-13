import pool from '@/lib/db';
import BookDetailContent from '@/components/BookDetailContent';
import { notFound } from 'next/navigation';

// Fungsi bantuan untuk mengambil data buku spesifik dari MySQL
async function getBook(slug) {
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE slug = ? LIMIT 1', [slug]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching book for detail page:', error);
    return null;
  }
}

// 1. Menghasilkan Meta Tags (SEO) secara dinamis
export async function generateMetadata({ params }) {
  const book = await getBook(params.slug);
  
  if (!book) {
    return { title: 'Buku Tidak Ditemukan | J-PSC' };
  }
  
  return {
    title: `${book.title_en} | J-PSC`,
    description: book.desc_en,
    openGraph: {
      title: book.title_en,
      description: book.desc_en,
      images: book.cover_image_url ? [book.cover_image_url] : [],
    }
  };
}

// 2. Render Halaman Utama (Server Side)
export default async function BookDetailPage({ params }) {
  const book = await getBook(params.slug);

  // Jika buku tidak ada di database, arahkan ke halaman 404 bawaan Next.js
  if (!book) {
    notFound(); 
  }

  // Lempar data dari MySQL ke Client Component Anda
  return <BookDetailContent book={book} />;
}