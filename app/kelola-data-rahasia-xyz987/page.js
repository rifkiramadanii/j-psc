'use client';

import { useState, useEffect } from 'react';
import './admin.css';

const emptyForm = {
  slug: '', titleId: '', titleEn: '', author: '',
  year: new Date().getFullYear(), isbn: '', category: 'social',
  coverColor: '', descriptionId: '', descriptionEn: ''
};

export default function SecretAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [passwordInput, setPasswordInput] = useState('');

  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState(null);

  // Cek status login saat halaman pertama kali dibuka
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          setIsAuthenticated(true);
          fetchBooks();
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check error', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuthStatus();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/publications');
      const json = await res.json();
      if (json.success) setBooks(json.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  };

  // --- HANDLER LOGIN & LOGOUT ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const json = await res.json();
      
      if (json.success) {
        setIsAuthenticated(true);
        fetchBooks();
        setPasswordInput('');
      } else {
        alert(json.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan saat login.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setBooks([]); // Bersihkan data dari memori
  };

  // --- HANDLER CRUD ---
  const handleOpenModal = (book = null) => {
    if (book) {
      setIsEditing(true);
      setFormData({
        slug: book.slug,
        titleId: book.title_id || '',
        titleEn: book.title_en || '',
        author: book.author || '',
        year: book.publish_year || new Date().getFullYear(),
        isbn: book.isbn || '',
        category: book.category || 'social',
        coverColor: book.cover_color || '',
        descriptionId: book.desc_id || '',
        descriptionEn: book.desc_en || ''
      });
    } else {
      setIsEditing(false);
      setFormData(emptyForm);
    }
    setCoverFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (slug) => {
    if (!confirm('Hapus buku ini secara permanen?')) return;
    const res = await fetch(`/api/publications?slug=${slug}`, { method: 'DELETE' });
    const json = await res.json();
    
    if (json.success) {
      alert('Berhasil dihapus');
      fetchBooks();
    } else {
      alert('Gagal: ' + json.error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (coverFile) data.append('cover', coverFile);

    try {
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch('/api/publications', { method, body: data });
      const json = await res.json();
      
      if (json.success) {
        alert(isEditing ? 'Buku berhasil diperbarui!' : 'Publikasi berhasil ditambahkan!');
        setIsModalOpen(false);
        fetchBooks();
      } else {
        // Tampilkan pesan error spesifik dari backend alih-alih general alert
        alert('Gagal menyimpan: ' + (json.error || 'Kesalahan tidak diketahui'));
      }
    } catch (error) {
      // Menangkap error jaringan yang sebenarnya (misal: server mati atau koneksi terputus)
      console.error('Frontend Submit Error:', error);
      alert('Terjadi kesalahan jaringan atau server tidak merespons: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- RENDER VIEWS ---

  // 1. Tampilan Loading saat mengecek cookie
  if (isCheckingAuth) {
    return (
      <div className="admin-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#6b7280' }}>Memeriksa akses otentikasi...</p>
      </div>
    );
  }

  // 2. Tampilan Form Login jika belum terotentikasi
  if (!isAuthenticated) {
    return (
      <div className="admin-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="modal-content" style={{ maxWidth: '400px', padding: '2.5rem 2rem', margin: '0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem' }}>Login Admin</h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Masukkan kata sandi untuk mengakses dashboard.</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input 
                type="password" 
                value={passwordInput} 
                onChange={(e) => setPasswordInput(e.target.value)} 
                className="form-control" 
                placeholder="Masukkan Password..."
                required 
                style={{ padding: '0.75rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
              Masuk Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 3. Tampilan Dashboard Utama jika sudah terotentikasi
  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Secure Dashboard</h1>
            <p className="admin-subtitle">Akses Rahasia Manajer Publikasi</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => handleOpenModal(null)} className="btn btn-primary">
              + Tambah Buku
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        {/* TABEL DATA BUKU */}
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Cover</th>
                <th>Judul</th>
                <th>Kategori</th>
                <th style={{ textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.slug}>
                  <td>
                    {book.cover_url ? (
                      <img src={book.cover_url} alt="Cover" className="cover-image" />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </td>
                  <td>
                    <p className="book-title">{book.title_id}</p>
                    <p className="book-meta">{book.author} • {book.publish_year}</p>
                  </td>
                  <td>
                    <span className="badge">{book.category}</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                      <button onClick={() => handleOpenModal(book)} className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(book.slug)} className="btn btn-danger" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
                    Belum ada data publikasi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL FORM CRUD (Tetap sama seperti sebelumnya) */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              {/* ... (Isi modal form CRUD yang sama persis seperti kode sebelumnya) ... */}
              <div className="modal-header">
                <h2>{isEditing ? 'Edit Data Buku' : 'Tambah Buku Baru'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="btn-close-text">Tutup</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body form-grid">
                  {/* KOLOM 1: INFO DASAR */}
                  <div>
                    <div className="form-group">
                      <label className="form-label">Slug (URL Unik)</label>
                      <input required name="slug" value={formData.slug} onChange={handleInputChange} disabled={isEditing} className="form-control" style={isEditing ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}} placeholder="buku-sejarah-islam" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Penulis</label>
                      <input required name="author" value={formData.author} onChange={handleInputChange} className="form-control" />
                    </div>
                    <div className="form-row">
                      <div>
                        <label className="form-label">Tahun</label>
                        <input required type="number" name="year" value={formData.year} onChange={handleInputChange} className="form-control" />
                      </div>
                      <div>
                        <label className="form-label">ISBN</label>
                        <input name="isbn" value={formData.isbn} onChange={handleInputChange} className="form-control" />
                      </div>
                    </div>
                    <div className="form-row">
                      <div>
                        <label className="form-label">Kategori</label>
                        <select name="category" value={formData.category} onChange={handleInputChange} className="form-control">
                          <option value="social">Social</option>
                          <option value="education">Education</option>
                          <option value="arabic">Arabic</option>
                          <option value="islamic">Islamic</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label">Warna Cover</label>
                        <input name="coverColor" value={formData.coverColor} onChange={handleInputChange} className="form-control" placeholder="var(--navy)" />
                      </div>
                    </div>
                    <div className="file-upload-box">
                      <label className="form-label" style={{ marginBottom: '0.5rem' }}>{isEditing ? 'Ganti Cover Baru (Opsional)' : 'Upload Gambar Cover'}</label>
                      <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} className="file-input" />
                    </div>
                  </div>

                  {/* KOLOM 2: BILINGUAL KONTEN */}
                  <div>
                    <div className="content-box id-box">
                      <h3>Konten Indonesia (ID)</h3>
                      <div className="form-group">
                        <input required name="titleId" value={formData.titleId} onChange={handleInputChange} placeholder="Judul ID" className="form-control" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <textarea required name="descriptionId" value={formData.descriptionId} onChange={handleInputChange} placeholder="Deskripsi ID" rows="4" className="form-control"></textarea>
                      </div>
                    </div>
                    <div className="content-box en-box">
                      <h3>Konten English (EN)</h3>
                      <div className="form-group">
                        <input required name="titleEn" value={formData.titleEn} onChange={handleInputChange} placeholder="Title EN" className="form-control" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <textarea required name="descriptionEn" value={formData.descriptionEn} onChange={handleInputChange} placeholder="Description EN" rows="4" className="form-control"></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Batal</button>
                  <button type="submit" disabled={isLoading} className="btn btn-primary">
                    {isLoading ? 'Menyimpan...' : (isEditing ? 'Perbarui Buku' : 'Simpan Buku')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}