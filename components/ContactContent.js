'use client';

import ContactForm from '@/components/ContactForm';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';
import { siteConfig } from '@/lib/site-config';

export default function ContactContent() {
  const { language } = useLanguage();
  const t = getDictionary(language).contact;

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
        <div className="container contact-grid">
          <div>
            <h2 style={{ marginBottom: '1.4rem' }}>{t.infoTitle}</h2>

            <div className="contact-info-item">
              <div className="contact-info-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <div className="journal-fact-label" style={{ marginBottom: '0.2em' }}>
                  {t.addressLabel}
                </div>
                <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{t.addressValue}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
              </div>
              <div>
                <div className="journal-fact-label" style={{ marginBottom: '0.2em' }}>
                  {t.emailLabel}
                </div>
                <p style={{ margin: 0 }}>
                  <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
                </p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <div className="journal-fact-label" style={{ marginBottom: '0.2em' }}>
                  {t.phoneLabel}
                </div>
                <p style={{ margin: 0 }}>{t.phoneValue}</p>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                  <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.4.63 4.66 1.83 6.66L3.5 29l7.5-2.24a11.9 11.9 0 0 0 5.02 1.13h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3z" />
                </svg>
              </div>
              <div>
                <div className="journal-fact-label" style={{ marginBottom: '0.2em' }}>
                  WhatsApp
                </div>
                <p style={{ margin: '0 0 0.6em' }}>{siteConfig.whatsappDisplay}</p>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-teal btn-sm"
                >
                  {t.chatWhatsapp}
                </a>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <div className="journal-fact-label" style={{ marginBottom: '0.2em' }}>
                  {t.socialLabel}
                </div>
                <p style={{ margin: 0, color: 'var(--text-soft)' }}>{t.socialValue}</p>
              </div>
            </div>
          </div>

          <div>
            <div className="plain-card">
              <h2 style={{ marginBottom: '1.2rem' }}>{t.formTitle}</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
