import Link from 'next/link';

export default function BookCard({ book, language, categoryLabel, byAuthorLabel, viewDetailsLabel }) {
  // Menyesuaikan dengan kolom database: title_id / title_en dan desc_id / desc_en
  const title = language === 'en' ? book.title_en : book.title_id;
  const description = language === 'en' ? book.desc_en : book.desc_id;

  return (
    <article className="book-card">
      <div 
        className="book-cover" 
        style={{ 
          background: book.cover_color || '#e5e7eb',
          position: 'relative', 
          overflow: 'hidden',
          aspectRatio: '2/3'
        }}
      >
        {/* Menggunakan book.cover sesuai nama kolom di database */}
        {book.cover ? (
          <img 
            src={book.cover} 
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
          {byAuthorLabel} {book.author} &middot; {book.publish_year}
        </p>
        <p className="book-card-desc">{description}</p>
        {book.isbn && <p className="book-card-isbn">ISBN {book.isbn}</p>}
        <Link href={`/publications/${book.slug}`} className="btn btn-secondary btn-sm">
          {viewDetailsLabel}
        </Link>
      </div>
    </article>
  );
}