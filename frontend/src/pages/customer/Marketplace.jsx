import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Pagination from '../../components/ui/Pagination';
import { formatRupiah, getImageUrl } from '../../utils/format';

const CATEGORIES = ['Semua', 'Roti & Kue', 'Sayur & Buah', 'Makanan Berat', 'Camilan', 'Minuman', 'Seafood', 'Daging', 'Vegan', 'Cepat Saji', 'Bahan Pokok'];

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState({ totalPages: 1 });

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?limit=20&page=${page}`;
        if (selectedCategory !== 'Semua') {
          url += `&category=${encodeURIComponent(selectedCategory)}`;
        }
        if (searchQuery.trim()) {
          url += `&search=${encodeURIComponent(searchQuery.trim())}`;
        }
        
        const response = await api.get(url);
        setProducts(response.data.data || []);
        if (response.data.pagination) {
          setPaginationData({ totalPages: response.data.pagination.total_pages });
        }
        setError(null);
      } catch (err) {
        setError('Gagal memuat daftar produk. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, page]);

  // Reset page to 1 when search or category changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery]);

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">Marketplace</h1>
        <p className="text-gray-600">Selamatkan makanan berlebih dari toko di sekitar Anda.</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined">error</span>
          {error}
        </div>
      )}

      {/* Search Input */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-gray-400">search</span>
          </div>
          <input
            type="text"
            placeholder="Cari nama makanan atau nama toko..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm transition-colors"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-8 flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-[var(--color-primary)] text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-[var(--color-primary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
          <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
          <h3 className="text-xl font-heading font-semibold text-gray-700 mb-2">Belum ada produk</h3>
          <p className="text-gray-500">Saat ini belum ada makanan berlebih yang tersedia untuk kategori ini. Cek lagi nanti!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col h-full overflow-hidden hover:-translate-y-1 transition-transform duration-300 !p-0">
              <div className="relative h-48 bg-gray-200">
                <img 
                  src={getImageUrl(product.image_url)} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                
                {product.stock <= 5 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                    Sisa {product.stock}!
                  </div>
                )}
                
                {product.category_name && (
                   <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-gray-800 text-xs font-medium px-2 py-1 rounded-md shadow-sm border border-gray-100">
                     {product.category_name}
                   </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold font-heading line-clamp-1" title={product.name}>{product.name}</h3>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  <span className="truncate">{product.store_name}</span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 line-through">{formatRupiah(product.original_price)}</p>
                    <p className="text-lg font-bold text-[var(--color-primary)]">{formatRupiah(product.discount_price)}</p>
                  </div>
                  <Link to={`/products/${product.id}`}>
                    <Button variant="primary" className="!py-2 !px-4 shadow-sm">Pesan</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <Pagination 
        currentPage={page} 
        totalPages={paginationData.totalPages} 
        onPageChange={(newPage) => setPage(newPage)} 
      />
    </div>
  );
};

export default Marketplace;
