'use client';

import { useState, useEffect } from 'react';
import './admin.css'; // Sesuaikan lokasi file CSS jika berbeda folder

const emptyForm = {
  slug: '', titleId: '', titleEn: '', author: '',
  year: new Date().getFullYear(), isbn: '', category: 'social',
  coverColor: '', descriptionId: '', descriptionEn: ''
};

export default function SecretAdminDashboard() {
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    fetchBooks();
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
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    
    if (coverFile) {
      data.append('cover', coverFile);
    }

    try {
      const res = await fetch('/api/publications', {
        method: 'POST',
        body: data, 
      });
      
      const json = await res.json();
      
      if (json.success) {
        alert('Publikasi berhasil ditambahkan!');
        setIsModalOpen(false);
        setFormData(emptyForm);
        setCoverFile(null);
        fetchBooks();
      } else {
        alert('Gagal menyimpan: ' + json.error);
      }
    } catch (error) {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-container">
        
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Secure Dashboard</h1>
            <p className="admin-subtitle">Akses Rahasia Manajer Publikasi</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
            + Tambah Buku
          </button>
        </div>

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
                    {book.cover_image_url ? (
                      <img src={book.cover_image_url} alt="Cover" className="cover-image" />
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
                  <td style={{ textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
                    <button
                      onClick={() => handleDelete(book.slug)}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MODAL FORM */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Tambah Buku Baru</h2>
                <button onClick={() => setIsModalOpen(false)} className="btn-close-text">Tutup</button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body form-grid">
                  
                  {/* KOLOM 1: INFO DASAR */}
                  <div>
                    <div className="form-group">
                      <label className="form-label">Slug (URL Unik)</label>
                      <input required name="slug" value={formData.slug} onChange={handleInputChange} className="form-control" placeholder="buku-sejarah-islam" />
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
                      <label className="form-label" style={{ marginBottom: '0.5rem' }}>Upload Gambar Cover</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setCoverFile(e.target.files[0])}
                        className="file-input"
                      />
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
                    {isLoading ? 'Menyimpan...' : 'Simpan Buku'}
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