import Link from 'next/link';

export default function BookCard({ book, language, categoryLabel, byAuthorLabel, viewDetailsLabel }) {
  return (
    <article className="book-card">
      <div className="book-cover" style={{ background: book.coverColor }}>
        <span className="book-cover-category">{categoryLabel}</span>
        <span className="book-cover-title">{book.title[language]}</span>
      </div>
      <div className="book-card-body">
        <h3>{book.title[language]}</h3>
        <p className="book-card-author">
          {byAuthorLabel} {book.author} &middot; {book.year}
        </p>
        <p className="book-card-desc">{book.description[language]}</p>
        <p className="book-card-isbn">ISBN {book.isbn}</p>
        <Link href={`/publications/${book.slug}`} className="btn btn-secondary btn-sm">
          {viewDetailsLabel}
        </Link>
      </div>
    </article>
  );
}

