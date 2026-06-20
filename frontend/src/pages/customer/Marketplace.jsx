import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatRupiah } from '../../utils/format';

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        // Assume API returns { status: 'success', data: [...] }
        setProducts(response.data.data || []);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat daftar produk. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <span className="material-symbols-outlined text-4xl mb-2">error</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-600">Selamatkan makanan berlebih dari toko di sekitar Anda.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
          <h3 className="text-xl font-heading font-semibold text-gray-700 mb-2">Belum ada produk</h3>
          <p className="text-gray-500">Saat ini belum ada makanan berlebih yang tersedia. Cek lagi nanti!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full overflow-hidden hover:-translate-y-1 transition-transform duration-300 !p-0">
              <div className="relative h-48 bg-gray-200">
                {product.image_url ? (
                  <img 
                    src={`http://localhost:5000${product.image_url}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop" 
                    alt="Placeholder" 
                    className="w-full h-full object-cover"
                  />
                )}
                {product.stock <= 5 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    Sisa {product.stock}!
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-2">
                  <h3 className="text-lg font-bold font-heading text-gray-900 line-clamp-1">{product.name}</h3>
                  {/* Ideally we'd fetch merchant name if joined, for now placeholder if not available */}
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">storefront</span>
                    {product.merchant_name || 'FoodSaver Partner'}
                  </p>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                  {product.description || 'Tidak ada deskripsi.'}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 line-through">{formatRupiah(product.original_price)}</p>
                    <p className="text-lg font-bold text-[var(--color-primary)]">{formatRupiah(product.discount_price)}</p>
                  </div>
                  <Link to={`/products/${product.id}`}>
                    <Button className="!px-4 !py-2">Pesan</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
