'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();
  
  // Menentukan teks berdasarkan bahasa aktif (karena ini halaman global, 
  // kita gunakan variabel lokal agar tidak bergantung pada dictionary tertentu)
  const isEn = language === 'en';
  const title = isEn ? 'Page Not Found' : 'Halaman Tidak Ditemukan';
  const description = isEn 
    ? "The page or book you are looking for doesn't exist, has been removed, or the URL is incorrect." 
    : "Halaman atau buku yang Anda cari tidak ada, telah dihapus, atau URL salah.";
  const homeBtn = isEn ? 'Back to Home' : 'Kembali ke Beranda';
  const catalogBtn = isEn ? 'View Publications' : 'Lihat Publikasi';

  return (
    <div className="section" style={{ 
      minHeight: '70vh', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="container" style={{ textAlign: 'center' }}>
        
        {/* Angka 404 berukuran besar sebagai aksen visual */}
        <h1 style={{ 
          fontSize: '6rem', 
          fontWeight: '900', 
          color: 'var(--navy, #1e293b)', 
          margin: '0 0 1rem 0',
          lineHeight: '1'
        }}>
          404
        </h1>
        
        <h2>{title}</h2>
        <p className="lede" style={{ margin: '1rem auto 2.5rem', maxWidth: '600px' }}>
          {description}
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Menggunakan class CSS tombol Vanilla Anda */}
          <Link href="/" className="btn btn-primary">
            {homeBtn}
          </Link>
          <Link href="/publications" className="btn btn-secondary">
            {catalogBtn}
          </Link>
        </div>
        
      </div>
    </div>
  );
}