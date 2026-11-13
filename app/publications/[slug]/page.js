import pool from '@/lib/db';
import BookDetailContent from '@/components/BookDetailContent';
import { notFound } from 'next/navigation';

async function getBook(slug) {
  try {
    const [rows] = await pool.query('SELECT * FROM publications WHERE slug = ? LIMIT 1', [slug]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching book for detail page:', error);
    return null;
  }
}

// 1. generateMetadata dengan await params
export async function generateMetadata({ params }) {
  const resolvedParams = await params; // Wajib await di Next.js versi terbaru
  const book = await getBook(resolvedParams.slug);
  
  if (!book) {
    return { title: 'Buku Tidak Ditemukan | J-PSC' };
  }
  
  return {
    title: `${book.title_en} | J-PSC`,
    description: book.desc_en,
    openGraph: {
      title: book.title_en,
      description: book.desc_en,
      images: book.cover ? [book.cover] : [],
    }
  };
}

// 2. BookDetailPage dengan await params
export default async function BookDetailPage({ params }) {
  const resolvedParams = await params; // Wajib await di Next.js versi terbaru
  const book = await getBook(resolvedParams.slug);

  if (!book) {
    notFound(); 
  }

  return <BookDetailContent book={book} />;
}