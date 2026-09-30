'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';
import { siteConfig } from '@/lib/site-config';

// 'idle' | 'sending' | 'success' | 'error' | 'not_configured'
export default function ContactForm() {
  const [status, setStatus] = useState('idle');
  const { language } = useLanguage();
  const t = getDictionary(language).contact;

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data?.error === 'not_configured') {
        setStatus('not_configured');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  }

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    language === 'id'
      ? 'Halo J-PSC, saya ingin bertanya tentang jurnal atau publikasi Anda.'
      : "Hello J-PSC, I'd like to ask about your journals or publications."
  )}`;

  const showFallback = status === 'error' || status === 'not_configured';

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">{t.nameLabel}</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-field">
          <label htmlFor="email">{t.emailFieldLabel}</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="subject">{t.subjectLabel}</label>
          <input type="text" id="subject" name="subject" placeholder={t.subjectPlaceholder} required />
        </div>
        <div className="form-field">
          <label htmlFor="message">{t.messageLabel}</label>
          <textarea id="message" name="message" required></textarea>
        </div>
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? t.sending : t.sendButton}
        </button>

        {status === 'success' && (
          <p className="form-note" style={{ marginTop: '1rem', color: 'var(--teal-ink)' }}>
            {t.statusMessage}
          </p>
        )}
        {status === 'error' && (
          <p className="form-note" style={{ marginTop: '1rem', color: '#B3423A' }}>
            {t.sendError}
          </p>
        )}
        {status === 'not_configured' && (
          <p className="form-note" style={{ marginTop: '1rem' }}>
            {t.notConfiguredNote}
          </p>
        )}
      </form>

      {showFallback && (
        <div className="contact-fallback">
          <p className="contact-fallback-label">{t.orDirect}</p>
          <div className="contact-fallback-actions">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-teal btn-sm"
            >
              {t.chatWhatsapp}
            </a>
            <a href={`mailto:${siteConfig.contactEmail}`} className="btn btn-secondary btn-sm">
              {t.emailDirectly}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
