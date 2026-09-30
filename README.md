# J-PSC Website — Next.js

A Next.js (App Router) rebuild of the J-PSC academic publisher website, based on the PRD
(`03-website-structure.md`) and brand guidelines (`02-brand-guidelines.md`) — with an
Indonesian/English language toggle, a book catalog with detail pages, a working contact-form
email backend, and a WhatsApp channel.

## Stack

- **Next.js 14** (App Router, JavaScript — no TypeScript)
- **next/font** for Noto Sans (body) and Noto Serif (display headings)
- Plain CSS with design tokens in `app/globals.css` (no Tailwind/CSS-in-JS dependency)
- Custom, dependency-free i18n via React Context
- Contact form emailing via **Resend's REST API**, called with native `fetch` — no SDK dependency
- A few small client components for interactivity (mobile nav, language toggle, scroll-reveal,
  contact form, book catalog filter, floating WhatsApp button)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000. (This project was generated without running `npm install` —
no network access in the environment that built it.)

## Contact form → real email

The contact form posts to `app/api/contact/route.js`, which sends the message via
[Resend](https://resend.com)'s HTTP API using `fetch` (no extra npm package required).

**To activate it:**

1. Create a free Resend account and verify a sending domain (or use their shared
   `onboarding@resend.dev` sender while testing).
2. Copy `.env.local.example` to `.env.local` and fill in:

   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   CONTACT_TO_EMAIL=editorial@jpsc-publisher.org
   RESEND_FROM_EMAIL=J-PSC Website <onboarding@resend.dev>
   ```

3. Restart `npm run dev` (or redeploy).

**Until it's configured:** submitting the form shows a friendly "not fully set up yet" note along
with direct **Email** and **WhatsApp** buttons, so visitors always have a way to reach you — the
form never dead-ends. The same fallback also appears if a send genuinely fails at runtime.

Want a different provider (SendGrid, Postmark, SMTP via Nodemailer, etc.) instead of Resend? Only
`app/api/contact/route.js` needs to change — the form component doesn't know or care which
provider is behind the API route.

## WhatsApp

- A floating WhatsApp button (bottom-right, on every page) opens a chat with a pre-filled
  greeting in the visitor's current language.
- The Contact page also has a dedicated WhatsApp card, and each book detail page has an
  "Ask on WhatsApp" button pre-filled with that book's title.
- **Set the real number** in `lib/site-config.js`:

  ```js
  whatsappNumber: '6281234567890', // country code + number, no +, no spaces, no leading 0
  whatsappDisplay: '+62 812-3456-7890', // how it's shown to humans
  ```

## Book catalog + detail pages (new)

- `lib/books.js` holds the catalog data — title, author, year, ISBN, category, description
  (bilingual except author/year/ISBN).
- The **Publications** page (`components/PublicationsContent.js`) lists all books with a
  client-side category filter.
- Each book now has its own detail page at **`/publications/[slug]`**
  (`app/publications/[slug]/page.js` + `components/BookDetailContent.js`), statically generated
  via `generateStaticParams`, with per-book `<title>`/description metadata via `generateMetadata`.
  Each detail page includes "Ask on WhatsApp" / "Ask via Email" buttons pre-filled with that
  book's title.
- Add a 7th book by adding one more object to the `books` array in `lib/books.js` — its detail
  page and catalog entry both appear automatically, no other file needs to change.
- Book covers are CSS-drawn placeholders (brand-colored panels), not image files — add an `<img>`
  inside `.book-cover` (`components/BookCard.js`) and `.book-detail-cover`
  (`components/BookDetailContent.js`) once real cover art is available.

## Language toggle (Indonesian / English)

- Default language is **Indonesian** (`id`). The header's "ID | EN" pill toggle switches to
  English and back, persisted in `localStorage`.
- All UI copy lives in `lib/i18n/dictionary.js` as `{ en: {...}, id: {...} }`. Journal data
  (`lib/journals.js`), news items (`lib/news.js`), and book catalog data (`lib/books.js`) are
  bilingual at the field level (e.g. `shortDescription: { en, id }`).
- `lib/i18n/LanguageContext.js` provides `useLanguage()` (`language`, `setLanguage`,
  `toggleLanguage`) and keeps `<html lang="...">` in sync.
- Every page's content lives in a **client component** (`components/*Content.js`) so it can read
  the language from context; `app/*/page.js` files stay server components purely to export
  `metadata` (which stays static/English regardless of the toggle, since Next.js metadata is
  generated server-side before the client toggle exists).
- To add a third language: add a new key (e.g. `ms`) to every `{ en, id }` object across
  `dictionary.js`, `journals.js`, `news.js`, and `books.js`, then extend `components/Header.js`.

## Project structure

```
app/
  layout.js                  Root layout — fonts, LanguageProvider, Header/Footer/WhatsAppButton
  globals.css                 Design tokens + all component/catalog/toggle/detail-page styles
  api/contact/route.js         POST handler — sends contact form email via Resend's REST API
  page.js                       Home           → components/HomeContent.js
  about/page.js                  About          → components/AboutContent.js
  journals/page.js                Journals       → components/JournalsContent.js
  publications/page.js             Publications   → components/PublicationsContent.js (+ catalog)
  publications/[slug]/page.js       Book detail    → components/BookDetailContent.js (new)
  news/page.js                      News           → components/NewsContent.js
  contact/page.js                    Contact        → components/ContactContent.js
components/
  Header.js           Client — mobile nav, active-link highlighting, language toggle
  Footer.js             Client — bilingual footer
  Reveal.js               Client — IntersectionObserver fade/slide-in wrapper
  ContactForm.js         Client — real submission to /api/contact, with WhatsApp/email fallback
  BookCard.js               Presentational card for one catalog entry, links to its detail page
  BookDetailContent.js        Client — single book's detail page (new)
  WhatsAppButton.js             Client — floating site-wide WhatsApp button (new)
  *Content.js                    Per-page client components consuming the language context
lib/
  i18n/
    LanguageContext.js    React Context + hook + localStorage persistence
    dictionary.js           All static UI copy, { en, id } per key
  journals.js         The 4 journals (JSP, JEPS, JAS, JCIW) — bilingual fields
  news.js               News/announcement items — bilingual fields
  books.js                Book catalog data — bilingual fields
  site-config.js             Contact email + WhatsApp number — edit here to go live (new)
```

## Still placeholder / to replace before launch

- `lib/site-config.js` — real WhatsApp number and contact email
- `.env.local` — real Resend API key + verified sending domain
- "Visit Journal" buttons on the Journals page (`#` / `/journals#slug`) — real OJS URLs per journal
- Book cover art — swap the CSS color panels for real cover images
