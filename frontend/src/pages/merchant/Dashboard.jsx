import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatRupiah } from '../../utils/format';

const MerchantDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0, productsSold: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ideally we would have a specific endpoint for merchant stats.
    // For now, let's assume we can fetch all orders and filter them, or the API returns merchant specific orders.
    const fetchMerchantData = async () => {
      try {
        const response = await api.get('/orders/merchant-orders'); 
        // Note: The backend should ideally filter orders to only show those for this merchant's products.
        const orders = response.data.data || [];
        
        const totalRevenue = orders
          .filter(o => o.status === 'completed' || o.status === 'picked_up')
          .reduce((sum, o) => sum + o.total_amount, 0);

        setStats({
          totalOrders: orders.length,
          revenue: totalRevenue,
          productsSold: orders.filter(o => o.status === 'completed' || o.status === 'picked_up').reduce((sum, o) => sum + o.quantity, 0)
        });

        setRecentOrders(orders.slice(0, 5)); // Just show top 5 recent
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch merchant data", err);
        setLoading(false);
      }
    };
    fetchMerchantData();
  }, []);

  const handleVerifyOrder = async (orderId) => {
    try {
      // Backend expects a pickup_code. Since we don't have a modal for it right now, 
      // we might need to prompt the merchant to enter the code, or skip if backend allows.
      const code = prompt("Masukkan 6 digit kode pickup dari pelanggan:");
      if (!code) return;
      
      await api.post(`/orders/${orderId}/redeem`, { pickup_code: code });
      
      // Refresh local state
      setRecentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'picked_up' } : o));
      alert('Pesanan berhasil diverifikasi!');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memverifikasi pesanan.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Memuat dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-gray-900">Merchant Dashboard</h1>
          <p className="text-gray-600">Selamat datang kembali, {user?.name}</p>
        </div>
        <Link to="/merchant/products">
          <Button>Kelola Produk</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card className="flex items-center gap-4 border-l-4 border-[var(--color-primary)]">
          <div className="p-3 bg-green-50 rounded-full">
            <span className="material-symbols-outlined text-green-600 text-3xl">receipt_long</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pesanan</p>
            <p className="text-2xl font-bold font-heading">{stats.totalOrders}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-l-4 border-[var(--color-secondary)]">
          <div className="p-3 bg-green-50 rounded-full">
            <span className="material-symbols-outlined text-green-600 text-3xl">payments</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pendapatan</p>
            <p className="text-2xl font-bold font-heading">{formatRupiah(stats.revenue)}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4 border-l-4 border-[var(--color-tertiary)]">
          <div className="p-3 bg-yellow-50 rounded-full">
            <span className="material-symbols-outlined text-yellow-600 text-3xl">takeout_dining</span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Porsi Terjual</p>
            <p className="text-2xl font-bold font-heading">{stats.productsSold}</p>
          </div>
        </Card>
      </div>

      <h2 className="text-2xl font-bold font-heading mb-4">Pesanan Terbaru</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">Belum ada pesanan yang masuk.</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity} porsi</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{formatRupiah(order.total_amount)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      (order.status === 'completed' || order.status === 'picked_up') ? 'bg-green-100 text-green-800' : 
                      (order.status === 'pending' || order.status === 'paid') ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'paid' ? 'Menunggu Diambil' : order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {(order.status === 'pending' || order.status === 'paid') && (
                      <button 
                        onClick={() => handleVerifyOrder(order.id)}
                        className="text-[var(--color-primary)] hover:text-green-900 font-bold"
                      >
                        Verifikasi Selesai
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
