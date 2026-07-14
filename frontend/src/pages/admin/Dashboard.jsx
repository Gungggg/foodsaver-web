import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Pagination from '../../components/ui/Pagination';
import { formatRupiah, getImageUrl } from '../../utils/format';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState([]);
  const [loadingMerchants, setLoadingMerchants] = useState(true);
  const [merchantSearch, setMerchantSearch] = useState('');
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [productPagination, setProductPagination] = useState({ totalPages: 1 });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, merchantsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/admin/merchants')
        ]);
        
        const data = statsRes.data.data;
        setStats({
          totalUsers: data.total_users || 0,
          totalMerchants: data.total_merchants || 0, 
          totalProducts: data.total_products || 0,
          totalOrders: data.total_orders || 0
        });

        setMerchants(merchantsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
        setLoadingMerchants(false);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    const fetchAdminProducts = async () => {
      setLoadingProducts(true);
      try {
        let url = `/products?limit=20&page=${productPage}`;
        if (productSearch.trim()) {
          url += `&search=${encodeURIComponent(productSearch.trim())}`;
        }
        const res = await api.get(url);
        setProducts(res.data.data || []);
        if (res.data.pagination) {
          setProductPagination({ totalPages: res.data.pagination.total_pages });
        }
      } catch (err) {
        console.error("Failed to fetch admin products", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    
    // Add debounce for search
    const delayDebounceFn = setTimeout(() => {
      fetchAdminProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [productPage, productSearch]);

  // Reset page when search changes
  useEffect(() => {
    setProductPage(1);
  }, [productSearch]);

  const handleVerifyMerchant = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin memverifikasi merchant ini?')) return;
    
    try {
      await api.patch(`/admin/merchants/${id}/verify`);
      setMerchants((prevMerchants) => 
        prevMerchants.map(merchant => 
          merchant.id === id ? { ...merchant, is_verified: 1 } : merchant
        )
      );
      alert('Merchant berhasil diverifikasi!');
    } catch (err) {
      console.error("Gagal memverifikasi merchant", err);
      alert('Gagal memverifikasi merchant. Silakan coba lagi.');
    }
  };

  const filteredMerchants = merchants.filter(m => 
    m.store_name.toLowerCase().includes(merchantSearch.toLowerCase()) || 
    m.email.toLowerCase().includes(merchantSearch.toLowerCase()) ||
    m.location.toLowerCase().includes(merchantSearch.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-500">Memuat data administrator...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-heading text-gray-900 mb-2">Administrator Panel</h1>
        <p className="text-gray-600">Overview sistem FoodSaver global.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full">
            <span className="material-symbols-outlined text-blue-600 text-3xl">group</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pengguna</p>
            <p className="text-2xl font-bold font-heading">{stats.totalUsers}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-full">
            <span className="material-symbols-outlined text-purple-600 text-3xl">store</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Merchant</p>
            <p className="text-2xl font-bold font-heading">{stats.totalMerchants}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-full">
            <span className="material-symbols-outlined text-green-600 text-3xl">inventory_2</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Produk Terdaftar</p>
            <p className="text-2xl font-bold font-heading">{stats.totalProducts}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-yellow-50 rounded-full">
            <span className="material-symbols-outlined text-yellow-600 text-3xl">receipt_long</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Transaksi</p>
            <p className="text-2xl font-bold font-heading">{stats.totalOrders}</p>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading">Daftar Merchant</h2>
            <p className="text-gray-500 text-sm mt-1">Kelola dan verifikasi pendaftaran merchant.</p>
          </div>
          <div className="w-full sm:w-64">
            <Input 
              type="text" 
              placeholder="Cari merchant..." 
              value={merchantSearch}
              onChange={(e) => setMerchantSearch(e.target.value)}
              className="!mb-0"
              icon="search"
            />
          </div>
        </div>
        
        {loadingMerchants ? (
          <div className="text-center text-gray-500 py-8">Memuat daftar merchant...</div>
        ) : merchants.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada merchant yang mendaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Nama Toko</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Email</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Lokasi</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Status</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredMerchants.length > 0 ? filteredMerchants.map((merchant) => (
                  <tr key={merchant.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{merchant.store_name}</td>
                    <td className="py-3 px-4 text-gray-600">{merchant.email}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{merchant.location}</td>
                    <td className="py-3 px-4">
                      {merchant.is_verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span>
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <span className="material-symbols-outlined text-[14px]">pending</span>
                          Menunggu
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {!merchant.is_verified ? (
                        <Button 
                          variant="primary" 
                          className="px-3 py-1.5 text-xs"
                          onClick={() => handleVerifyMerchant(merchant.id)}
                        >
                          Verifikasi
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm italic">Selesai</span>
                      )}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      Tidak ada merchant yang cocok dengan pencarian "{merchantSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold font-heading">Daftar Makanan (Produk)</h2>
            <p className="text-gray-500 text-sm mt-1">Pantau semua produk yang terdaftar di sistem.</p>
          </div>
          <div className="w-full sm:w-64">
            <Input 
              type="text" 
              placeholder="Cari makanan atau toko..." 
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="!mb-0"
              icon="search"
            />
          </div>
        </div>
        
        {loadingProducts ? (
          <div className="text-center text-gray-500 py-8">Memuat daftar produk...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 py-8">Belum ada produk yang terdaftar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Produk</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Merchant</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Kategori</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Harga</th>
                  <th className="py-3 px-4 font-semibold text-gray-600 text-sm">Stok</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={getImageUrl(product.image_url)} alt={product.name} className="w-10 h-10 rounded object-cover" />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{product.store_name}</td>
                    <td className="py-3 px-4 text-gray-600">{product.category_name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className="text-[var(--color-primary)] font-medium">{formatRupiah(product.discount_price)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      Tidak ada produk yang cocok dengan pencarian "{productSearch}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <Pagination 
          currentPage={productPage} 
          totalPages={productPagination.totalPages} 
          onPageChange={(newPage) => setProductPage(newPage)} 
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
