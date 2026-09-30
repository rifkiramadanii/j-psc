import { books } from '@/lib/books';
import BookDetailContent from '@/components/BookDetailContent';

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export function generateMetadata({ params }) {
  const book = books.find((b) => b.slug === params.slug);
  if (!book) {
    return { title: 'Book Not Found' };
  }
  return {
    title: book.title.en,
    description: book.description.en,
  };
}

export default function BookDetailPage({ params }) {
  const book = books.find((b) => b.slug === params.slug);
  return <BookDetailContent book={book} />;
}
