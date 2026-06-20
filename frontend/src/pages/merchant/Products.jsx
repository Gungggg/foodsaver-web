import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatRupiah } from '../../utils/format';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    original_price: '',
    discount_price: '',
    stock: '',
    expiry_time: '',
    image: null
  });

  const fetchProducts = async () => {
    try {
      // In a real app, backend would filter by merchant_id from token
      const response = await api.get('/products');
      setProducts(response.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description || '',
        original_price: product.original_price,
        discount_price: product.discount_price,
        stock: product.stock,
        expiry_time: product.expiry_time ? product.expiry_time.substring(0, 16) : '',
        image: null
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '', description: '', original_price: '', discount_price: '', stock: '', expiry_time: '', image: null
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('original_price', formData.original_price);
    data.append('discount_price', formData.discount_price);
    data.append('stock', formData.stock);
    data.append('expiry_time', formData.expiry_time);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        // Assume API has PUT or PATCH /products/:id
        // Since backend routes currently only have PATCH /products/:id/stock for updates, 
        // we might only be able to update stock in reality unless we expand the backend.
        // For demonstration, we'll hit the patch stock if that's all there is.
        await api.patch(`/products/${editingId}/stock`, { stock: formData.stock });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      handleCloseModal();
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan produk.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert('Gagal menghapus produk.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat produk...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">Manajemen Produk</h1>
          <p className="text-gray-600">Kelola etalase makanan berlebih Anda</p>
        </div>
        <div className="flex gap-4">
          <Link to="/merchant">
            <Button variant="secondary">Kembali ke Dashboard</Button>
          </Link>
          <Button onClick={() => handleOpenModal()}>+ Tambah Produk</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col h-full !p-0 overflow-hidden border border-gray-100 shadow-sm hover:shadow-md">
            <div className="h-40 bg-gray-200">
               <img 
                  src={product.image_url ? `http://localhost:5000${product.image_url}` : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop"} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold font-heading text-lg mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.description}</p>
              
              <div className="mt-auto pt-3 flex justify-between items-end border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500">Stok: {product.stock}</p>
                  <p className="font-bold text-[var(--color-primary)]">{formatRupiah(product.discount_price)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(product)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded-md">
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-md">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCloseModal}></div>
          <Card className="relative bg-white w-full max-w-lg mx-4 z-10 max-h-[90vh] overflow-y-auto !p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold font-heading">{editingId ? 'Edit Stok Produk' : 'Tambah Produk Baru'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <>
                  <Input label="Nama Produk" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Deskripsi</label>
                    <textarea className="input-field min-h-[100px] py-2" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Harga Asli (Rp)" type="number" required value={formData.original_price} onChange={(e) => setFormData({...formData, original_price: e.target.value})} />
                    <Input label="Harga Diskon (Rp)" type="number" required value={formData.discount_price} onChange={(e) => setFormData({...formData, discount_price: e.target.value})} />
                  </div>
                  <Input label="Batas Waktu Pengambilan (Expiry Time)" type="datetime-local" required value={formData.expiry_time} onChange={(e) => setFormData({...formData, expiry_time: e.target.value})} />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">Foto Produk</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[var(--color-primary)] hover:file:bg-green-100" />
                  </div>
                </>
              )}
              
              <Input label="Jumlah Stok" type="number" required value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />

              {editingId && (
                <p className="text-xs text-yellow-600 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  Catatan: Saat ini sistem hanya mengizinkan pembaruan stok produk untuk produk yang sudah ada (sesuai API Endpoint).
                </p>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={handleCloseModal}>Batal</Button>
                <Button type="submit">{editingId ? 'Simpan Perubahan' : 'Upload Produk'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Products;
