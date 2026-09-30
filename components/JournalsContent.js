// 'use client';

// import Link from 'next/link';
// import Reveal from '@/components/Reveal';
// import { journals } from '@/lib/journals';
// import { useLanguage } from '@/lib/i18n/LanguageContext';
// import { getDictionary } from '@/lib/i18n/dictionary';

// export default function JournalsContent() {
//   const { language } = useLanguage();
//   const t = getDictionary(language).journalsPage;
//   const common = getDictionary(language).common;

//   return (
//     <>
//       <div className="page-header">
//         <div className="container">
//           <p className="eyebrow">{t.pageEyebrow}</p>
//           <h1>{t.pageTitle}</h1>
//           <p className="lede">{t.pageLede}</p>
//         </div>
//       </div>

//       <section className="section">
//         <div className="container">
//           {journals.map((journal) => (
//             <Reveal as="article" className="journal-detail" id={journal.slug} key={journal.slug}>
//               <div className="journal-detail-head">
//                 <div
//                   className="journal-detail-spine"
//                   style={{ background: journal.spineColor }}
//                 ></div>
//                 <div className="journal-detail-body">
//                   <div className="journal-top-row">
//                     <span className="journal-abbr-badge">{journal.abbr}</span>
//                     <span className="oa-badge">{common.openAccess}</span>
//                   </div>
//                   <h2>{journal.name}</h2>
//                   <p>{journal.longDescription[language]}</p>

//                   <div className="journal-facts">
//                     <div>
//                       <div className="journal-fact-label">{t.scopeLabel}</div>
//                       <div className="journal-fact-value">{journal.scope[language]}</div>
//                     </div>
//                     <div>
//                       <div className="journal-fact-label">{t.freqLabel}</div>
//                       <div className="journal-fact-value">{journal.frequency[language]}</div>
//                     </div>
//                     <div>
//                       <div className="journal-fact-label">{t.oaLabel}</div>
//                       <div className="journal-fact-value">{journal.openAccess[language]}</div>
//                     </div>
//                   </div>

//                   <div className="journal-actions">
//                     <a href={journal.link} target='_blank' className="btn btn-primary btn-sm">
//                       {common.visitJournal}
//                     </a>
//                     <Link href="/contact" className="btn btn-secondary btn-sm">
//                       {t.askSubmitting}
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </Reveal>
//           ))}

//           {/* <div className="future-note">{t.futureNote}</div> */}
//         </div>
//       </section>

//       <section className="section section--tint">
//         <div className="container" style={{ textAlign: 'center' }}>
//           <p className="eyebrow" style={{ justifyContent: 'center' }}>
//             {t.howEyebrow}
//           </p>
//           <h2>{t.howTitle}</h2>
//           <p className="lede" style={{ margin: '0 auto 1.5rem' }}>
//             {t.howLede}
//           </p>
//           <div className="stat-row" style={{ justifyContent: 'center' }}>
//             <div className="stat">
//               <span className="num">1</span>
//               <span className="label">{t.step1}</span>
//             </div>
//             <div className="stat">
//               <span className="num">2</span>
//               <span className="label">{t.step2}</span>
//             </div>
//             <div className="stat">
//               <span className="num">3</span>
//               <span className="label">{t.step3}</span>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
'use client';

import Link from 'next/link';
import Reveal from '@/components/Reveal';
import { journals } from '@/lib/journals';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { getDictionary } from '@/lib/i18n/dictionary';

export default function JournalsContent() {
  const { language } = useLanguage();
  const t = getDictionary(language).journalsPage;
  const common = getDictionary(language).common;

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
        <div className="container">
          {/* Tambahkan parameter "index" pada fungsi map */}
          {journals.map((journal, index) => {
            // Logika untuk menentukan 2 jurnal terakhir
            const isComingSoon = index >= journals.length - 2;

            return (
              <Reveal as="article" className="journal-detail" id={journal.slug} key={journal.slug}>
                <div className="journal-detail-head">
                  <div
                    className="journal-detail-spine"
                    style={{ background: isComingSoon ? '#cccccc' : journal.spineColor }} // Ubah warna spine jadi abu-abu jika belum aktif (opsional)
                  ></div>
                  <div className="journal-detail-body">
                    <div className="journal-top-row">
                      <span className="journal-abbr-badge">{journal.abbr}</span>
                      
                      {/* Tampilkan badge "Coming Soon" atau "Open Access" */}
                      {isComingSoon ? (
                        <span className="oa-badge" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>
                          Coming Soon
                        </span>
                      ) : (
                        <span className="oa-badge">{common.openAccess}</span>
                      )}
                    </div>
                    
                    <h2>{journal.name}</h2>
                    <p>{journal.longDescription[language]}</p>

                    <div className="journal-facts">
                      <div>
                        <div className="journal-fact-label">{t.scopeLabel}</div>
                        <div className="journal-fact-value">{journal.scope[language]}</div>
                      </div>
                      <div>
                        <div className="journal-fact-label">{t.freqLabel}</div>
                        <div className="journal-fact-value">{journal.frequency[language]}</div>
                      </div>
                      <div>
                        <div className="journal-fact-label">{t.oaLabel}</div>
                        <div className="journal-fact-value">{journal.openAccess[language]}</div>
                      </div>
                    </div>

                    <div className="journal-actions">
                      {/* Matikan tombol jika Coming Soon */}
                      {isComingSoon ? (
                        <button className="btn btn-primary btn-sm" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                          Coming Soon
                        </button>
                      ) : (
                        <a href={journal.link} target='_blank' className="btn btn-primary btn-sm">
                          {common.visitJournal}
                        </a>
                      )}
                      
                      <Link href="/contact" className="btn btn-secondary btn-sm">
                        {t.askSubmitting}
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}

          {/* <div className="future-note">{t.futureNote}</div> */}
        </div>
      </section>

      {/* Sisa kode (Bagian "How to publish") tetap sama ... */}
      <section className="section section--tint">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>
            {t.howEyebrow}
          </p>
          <h2>{t.howTitle}</h2>
          <p className="lede" style={{ margin: '0 auto 1.5rem' }}>
            {t.howLede}
          </p>
          <div className="stat-row" style={{ justifyContent: 'center' }}>
            <div className="stat">
              <span className="num">1</span>
              <span className="label">{t.step1}</span>
            </div>
            <div className="stat">
              <span className="num">2</span>
              <span className="label">{t.step2}</span>
            </div>
            <div className="stat">
              <span className="num">3</span>
              <span className="label">{t.step3}</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}