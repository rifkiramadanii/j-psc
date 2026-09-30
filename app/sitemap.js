// app/sitemap.js

export default async function sitemap() {
  // 1. Tentukan URL utama website kamu (Ganti dengan domain aslimu)
  const baseUrl = 'https://j-psc.com';

  // 2. Tentukan halaman statis yang URL-nya tidak pernah berubah
  const staticPages = ['', '/tentang-kami', '/kontak'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8, // Halaman beranda (Home) diberi prioritas tertinggi 1.0
  }));

  // 3. Ambil data dinamis (Contoh: Jurnal, Buku, atau Berita dari API/Database)
  // Dalam praktiknya, buka komentar fetch di bawah dan sesuaikan dengan API/database kamu:
  /*
    const res = await fetch('https://api.j-psc.com/jurnal');
    const dataJurnal = await res.json();
  */
  
  // Simulasi respons data dari database (dummy data)
  const dataJurnal = [
    { slug: 'jsp', updatedAt: '2026-10-01' },
    { slug: 'jeps', updatedAt: '2026-09-28' },
  ];

  // 4. Petakan data dinamis ke dalam format sitemap
  const dynamicPages = dataJurnal.map((item) => ({
    url: `${baseUrl}/jurnal/${item.slug}`,
    lastModified: new Date(item.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // 5. Gabungkan halaman statis dan dinamis, lalu kembalikan hasilnya
  return [...staticPages, ...dynamicPages];
}