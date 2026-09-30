'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { journals } from '@/lib/journals';
import { newsItems } from '@/lib/news';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';

export default function HomeContent() {
  const { language } = useLanguage();
  const t = getDictionary(language).home;
  const common = getDictionary(language).common;
  
  // State untuk mengontrol slide aktif
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  // Auto-play slider (Ganti slide setiap 5 detik)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="announcement-bar">
        <div className="container">
          <span>🔥 <strong>Call for Papers 2026:</strong> Segera terbitkan artikel Anda di Jurnal JSP & JEPS.</span>
          <Link href="/journals" className="announcement-link">
            Kirim Sekarang &rarr;
          </Link>
        </div>
      </div>

      {/* HERO / MASTHEAD DENGAN CAROUSEL */}
      <section className="masthead">
        <div className="container">
          <div className="masthead-rule">
            <span>{t.mastheadTag1}</span>
            <span>{t.mastheadTag2}</span>
          </div>

          <div className="hero-carousel-viewport">
            <div 
              className="hero-carousel-track" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              
              {/* =========================================
                  SLIDE 1: CALL FOR PAPERS
                  ========================================= */}
              <div className="hero-slide">
                <div className="masthead-grid">
                  <div>
                    <p className="eyebrow" style={{ color: '#e74c3c' }}>Pengumuman Penting</p>
                    <h1>Call for Papers 2026</h1>
                    <p className="lede">
                      Kami mengundang para peneliti, akademisi, dan praktisi untuk mempublikasikan artikel ilmiah berkualitas pada jurnal <strong>JSP</strong> dan <strong>JEPS</strong>. Dapatkan visibilitas global dengan platform *Open Access*.
                    </p>
                    <div className="masthead-actions">
                      <Link href="/journals#jsp" className="btn btn-primary">
                        Submit ke JSP
                      </Link>
                      <Link href="/journals#jeps" className="btn btn-secondary">
                        Submit ke JEPS
                      </Link>
                    </div>
                  </div>

                  {/* UBAH: Dari <Reveal> menjadi <div> biasa agar tidak tersembunyi (opacity 0) */}
                  <div className="toc-card cfp-schedule-card">
                    <div className="toc-card-head" style={{ backgroundColor: 'var(--navy)', color: '#fff' }}>
                      <span>Timeline</span>
                      Jadwal Penting
                    </div>
                    <ul className="toc-list" style={{ padding: '1.5rem' }}>
                      <li style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', display: 'block' }}>Batas Pengiriman</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--navy-ink)' }}>20 Oktober 2026</strong>
                      </li>
                      <li style={{ borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', display: 'block' }}>Proses Review</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--navy-ink)' }}>Oktober 2026</strong>
                      </li>
                      <li>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', display: 'block' }}>Publikasi Jurnal</span>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--navy-ink)' }}>30 Oktober 2026</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* =========================================
                  SLIDE 2: KONTEN HERO ORIGINAL
                  ========================================= */}
              <div className="hero-slide">
                <div className="masthead-grid">
                  <div>
                    <p className="eyebrow">{t.eyebrow1}</p>
                    <h1>{t.heroTitle}</h1>
                    <p className="lede">{t.heroLede}</p>
                    <div className="masthead-actions">
                      <Link href="/journals" className="btn btn-primary">
                        {t.exploreJournals}
                      </Link>
                      <Link href="/about" className="btn btn-secondary">
                        {t.aboutJpsc}
                      </Link>
                    </div>
                  </div>

                  {/* UBAH: Dari <Reveal> menjadi <div> biasa */}
                  <div className="toc-card">
                    <div className="toc-card-head">
                      <span>{t.tocTag}</span>
                      {t.tocHeading}
                    </div>
                    <ul className="toc-list">
                      {journals.map((journal, i) => (
                        <li key={journal.slug}>
                          <Link href={`/journals#${journal.slug}`}>
                            <span className="toc-num">{String(i + 1).padStart(2, '0')}</span>{' '}
                            {journal.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          <div className="carousel-dots">
            <button 
              onClick={() => setCurrentSlide(0)} 
              className={currentSlide === 0 ? 'active' : ''}
              aria-label="Slide 1"
            />
            <button 
              onClick={() => setCurrentSlide(1)} 
              className={currentSlide === 1 ? 'active' : ''}
              aria-label="Slide 2"
            />
          </div>
        </div>
      </section>

      {/* Sisa konten sama persis dengan sebelumnya */}
      <section className="section">
        <div className="container two-col">
          <Reveal>
            <p className="eyebrow">{t.aboutEyebrow}</p>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutP1}</p>
            <p>{t.aboutP2}</p>
            <Link href="/about" className="btn btn-secondary btn-sm">
              {t.readStory}
            </Link>
          </Reveal>
          <Reveal>
            <div className="stat-row plain-card">
              <div className="stat">
                <span className="num">04</span>
                <span className="label">{t.statJournals}</span>
              </div>
              <div className="stat">
                <span className="num">100%</span>
                <span className="label">{t.statOpenAccess}</span>
              </div>
              <div className="stat">
                <span className="num">OJS</span>
                <span className="label">{t.statPlatform}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">{t.featuredEyebrow}</p>
          <h2>{t.featuredTitle}</h2>
          <p className="lede" style={{ marginBottom: '2.2rem' }}>
            {t.featuredLede}
          </p>

          <div className="spine-grid">
            {journals.map((journal, index) => {
              const isComingSoon = index >= journals.length - 2;

              return (
                <Reveal as="article" className="spine-card" key={journal.slug}>
                  <div 
                    className="spine" 
                    style={{ background: isComingSoon ? '#cccccc' : journal.spineColor }}
                  ></div>
                  
                  <div className="spine-body">
                    <div className="spine-top">
                      <span className="spine-abbr">{journal.abbr}</span>
                      {isComingSoon ? (
                        <span className="oa-badge" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>
                          Coming Soon
                        </span>
                      ) : (
                        <span className="oa-badge">{common.openAccess}</span>
                      )}
                    </div>
                    
                    <h3>{journal.name}</h3>
                    <p className="spine-scope">{journal.shortDescription[language]}</p>
                    
                    {isComingSoon ? (
                      <button className="btn btn-secondary btn-sm" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                        Coming Soon
                      </button>
                    ) : (
                      <Link href={`/journals#${journal.slug}`} className="btn btn-secondary btn-sm">
                        {common.visitJournal}
                      </Link>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.whyEyebrow}</p>
          <h2>{t.whyTitle}</h2>
          <div className="cards-3" style={{ marginTop: '2rem' }}>
            <Reveal className="plain-card">
              <span className="value-num">01</span>
              <h3>{t.why1Title}</h3>
              <p>{t.why1Body}</p>
            </Reveal>
            <Reveal className="plain-card">
              <span className="value-num">02</span>
              <h3>{t.why2Title}</h3>
              <p>{t.why2Body}</p>
            </Reveal>
            <Reveal className="plain-card">
              <span className="value-num">03</span>
              <h3>{t.why3Title}</h3>
              <p>{t.why3Body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <p className="eyebrow">{t.newsEyebrow}</p>
          <h2>{t.newsTitle}</h2>
          <div style={{ marginTop: '1.5rem' }}>
            {newsItems.slice(0, 2).map((item) => (
              <Reveal className="news-item" key={item.title.en}>
                <div className="news-date">{item.date[language]}</div>
                <div>
                  <span className="news-tag">{item.tag[language]}</span>
                  <h3 style={{ marginTop: '0.5em' }}>{item.title[language]}</h3>
                  <p>{item.body[language]}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Link href="/news" className="btn btn-secondary btn-sm" style={{ marginTop: '1.5rem' }}>
            {t.viewAllNews}
          </Link>
        </div>
      </section>

      <section className="section section--navy">
        <div className="container two-col">
          <Reveal>
            <p className="eyebrow" style={{ color: '#8FD3DE' }}>
              {t.ctaEyebrow}
            </p>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaBody}</p>
            <Link href="/contact" className="btn btn-ghost-light">
              {common.contactUs}
            </Link>
          </Reveal>
          <div></div>
        </div>
      </section>
    </>
  );
}