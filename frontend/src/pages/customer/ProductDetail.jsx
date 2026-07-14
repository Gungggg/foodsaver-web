import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { formatRupiah } from '../../utils/format';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat detail produk.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setOrdering(true);
    setError(null);
    try {
      await api.post('/orders', {
        bag_id: product.id,
        quantity: quantity,
      });
      setSuccess(true);
      setOrdering(false);
      // Wait a bit and redirect to orders
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal melakukan pemesanan.');
      setOrdering(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-10 w-10 border-b-2 border-green-600 rounded-full"></div></div>;
  }

  if (error && !product) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
        <div className="rounded-xl overflow-hidden h-64 md:h-96 relative bg-gray-100">
           <img 
              src={product?.image_url ? (product.image_url.startsWith('http') ? product.image_url : `${import.meta.env.VITE_BASE_URL || 'http://localhost:5000'}${product.image_url}`) : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop"} 
              alt={product?.name} 
              className="w-full h-full object-cover"
            />
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold font-heading mb-2">{product?.name}</h1>
          <div className="flex items-center gap-2 text-gray-500 mb-6">
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>{product?.merchant_name || 'FoodSaver Partner'}</span>
          </div>
          
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">
            {product?.description || 'Makanan berkualitas yang berlebih. Mari selamatkan makanan ini dan nikmati hidangan lezat dengan harga miring!'}
          </p>
          
          <div className="flex items-end gap-4 mb-8 p-4 bg-green-50 rounded-xl border border-green-100">
            <div>
              <p className="text-sm text-gray-500 line-through mb-1">{formatRupiah(product?.original_price)}</p>
              <p className="text-3xl font-bold text-[var(--color-primary)]">{formatRupiah(product?.discount_price)}</p>
            </div>
            <div className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-semibold">
              Hemat {Math.round((1 - product?.discount_price / product?.original_price) * 100)}%
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Jumlah Pesanan (Stok: {product?.stock})</label>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <span className="material-symbols-outlined">remove</span>
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product?.stock || 1, quantity + 1))}
                className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>

          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
          {success && (
            <div className="text-green-600 mb-4 flex items-center gap-2 bg-green-50 p-3 rounded-lg">
              <span className="material-symbols-outlined">check_circle</span>
              Pemesanan berhasil! Mengarahkan ke pesanan...
            </div>
          )}

          <Button 
            className="w-full !py-4 text-lg" 
            onClick={handleOrder}
            disabled={ordering || product?.stock === 0 || success}
          >
            {ordering ? 'Memproses...' : (product?.stock === 0 ? 'Habis Terjual' : 'Pesan Sekarang')}
          </Button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span className="material-symbols-outlined">eco</span>
            Membeli produk ini mencegah emisi karbon dari *food waste*.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
