'use client';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { siteConfig } from '@/lib/site-config';

export default function WhatsAppButton() {
  const { language } = useLanguage();

  const message =
    language === 'id'
      ? 'Halo J-PSC, saya ingin bertanya tentang jurnal atau publikasi Anda.'
      : "Hello J-PSC, I'd like to ask about your journals or publications.";

  const href = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
  const label = language === 'id' ? 'Chat via WhatsApp' : 'Chat via WhatsApp';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.4.63 4.66 1.83 6.66L3.5 29l7.5-2.24a11.9 11.9 0 0 0 5.02 1.13h.01c6.62 0 12.02-5.4 12.02-12.02C28.05 8.4 22.65 3 16.02 3zm0 21.9c-1.66 0-3.28-.44-4.7-1.28l-.34-.2-4.45 1.33 1.35-4.34-.22-.36a9.83 9.83 0 0 1-1.53-5.03c0-5.46 4.44-9.9 9.9-9.9 2.65 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.45 9.88-9.91 9.88zm5.42-7.41c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.15-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.36-1.46-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.75-.71 2-1.4.25-.68.25-1.27.17-1.4-.07-.13-.27-.2-.57-.35z" />
      </svg>
    </a>
  );
}
