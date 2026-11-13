import Link from 'next/link';

export default function BookCard({ book, language, categoryLabel, byAuthorLabel, viewDetailsLabel }) {
  // Menggunakan optional chaining (?.) agar aplikasi tidak error 
  // jika data dari database ada yang terlewat/kosong
  const title = book.title?.[language] || '';
  const description = book.description?.[language] || '';

  return (
    <article className="book-card">
      <div 
        className="book-cover" 
        style={{ 
          background: book.coverColor || '#e5e7eb',
          position: 'relative', 
          overflow: 'hidden' 
        }}
      >
        {book.coverImageUrl ? (
          <img 
            src={book.coverImageUrl} 
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
            <span className="book-cover-category">{categoryLabel}</span>
            <span className="book-cover-title">{title}</span>
          </>
        )}
      </div>
      <div className="book-card-body">
        <h3>{title}</h3>
        <p className="book-card-author">
          {byAuthorLabel} {book.author} &middot; {book.year}
        </p>
        <p className="book-card-desc">{description}</p>
        <p className="book-card-isbn">ISBN {book.isbn}</p>
        <Link href={`/publications/${book.slug}`} className="btn btn-secondary btn-sm">
          {viewDetailsLabel}
        </Link>
      </div>
    </article>
  );
}