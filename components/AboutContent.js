'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';

export default function AboutContent() {
  const { language } = useLanguage();
  const t = getDictionary(language).about;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <p className="eyebrow">{t.pageEyebrow}</p>
          <h1>{t.pageTitle}</h1>
          <p className="lede">{t.pageLede}</p>
        </div>
      </div>

      {/* OUR STORY */}
      <section className="section">
        <div className="container two-col">
          <Reveal>
            <p className="eyebrow">{t.storyEyebrow}</p>
            <h2>{t.storyTitle}</h2>
            <p>{t.storyP1}</p>
            <p>{t.storyP2}</p>
          </Reveal>
          <Reveal>
            <div className="plain-card">
              <h3>{t.glanceTitle}</h3>
              <ul style={{ paddingLeft: '1.2em', color: 'var(--text-soft)' }}>
                <li>{t.glance1}</li>
                <li>{t.glance2}</li>
                <li>{t.glance3}</li>
                <li>{t.glance4}</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MISSION / VISION / PHILOSOPHY */}
      <section className="section section--tint">
        <div className="container cards-3">
          <Reveal className="plain-card">
            <p className="eyebrow">{t.missionEyebrow}</p>
            <h3>{t.missionTitle}</h3>
            <p>{t.missionBody}</p>
          </Reveal>
          <Reveal className="plain-card">
            <p className="eyebrow">{t.visionEyebrow}</p>
            <h3>{t.visionTitle}</h3>
            <p>{t.visionBody}</p>
          </Reveal>
          <Reveal className="plain-card">
            <p className="eyebrow">{t.philosophyEyebrow}</p>
            <h3>{t.philosophyTitle}</h3>
            <p>{t.philosophyBody}</p>
          </Reveal>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section">
        <div className="container">
          <p className="eyebrow">{t.valuesEyebrow}</p>
          <h2>{t.valuesTitle}</h2>
          <div className="cards-3" style={{ marginTop: '2rem' }}>
            <Reveal className="plain-card">
              <span className="value-num">01</span>
              <h3>{t.value1Title}</h3>
              <p>{t.value1Body}</p>
            </Reveal>
            <Reveal className="plain-card">
              <span className="value-num">02</span>
              <h3>{t.value2Title}</h3>
              <p>{t.value2Body}</p>
            </Reveal>
            <Reveal className="plain-card">
              <span className="value-num">03</span>
              <h3>{t.value3Title}</h3>
              <p>{t.value3Body}</p>
            </Reveal>
            <Reveal className="plain-card">
              <span className="value-num">04</span>
              <h3>{t.value4Title}</h3>
              <p>{t.value4Body}</p>
            </Reveal>
            <Reveal className="plain-card">
              <span className="value-num">05</span>
              <h3>{t.value5Title}</h3>
              <p>{t.value5Body}</p>
            </Reveal>
            <Reveal className="plain-card">
              <span className="value-num">06</span>
              <h3>{t.value6Title}</h3>
              <p>{t.value6Body}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PUBLISHING PHILOSOPHY / EDITORIAL STANDARDS */}
      <section className="section section--tint">
        <div className="container two-col">
          <Reveal>
            <p className="eyebrow">{t.pubPhilEyebrow}</p>
            <h2>{t.pubPhilTitle}</h2>
            <p>{t.pubPhilP1}</p>
            <p>{t.pubPhilP2}</p>
          </Reveal>
          <Reveal>
            <p className="eyebrow">{t.standardsEyebrow}</p>
            <h2>{t.standardsTitle}</h2>
            <ul style={{ paddingLeft: '1.2em', color: 'var(--text-soft)' }}>
              <li>{t.standard1}</li>
              <li>{t.standard2}</li>
              <li>{t.standard3}</li>
              <li>{t.standard4}</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--navy">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>{t.ctaTitle}</h2>
          <p className="lede" style={{ margin: '0 auto 1.5rem', textAlign: 'center' }}>
            {t.ctaLede}
          </p>
          <Link href="/journals" className="btn btn-ghost-light">
            {getDictionary(language).home.exploreJournals}
          </Link>
        </div>
      </section>
    </>
  );
}
