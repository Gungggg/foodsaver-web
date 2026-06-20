import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatRupiah } from '../../utils/format';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/my-orders');
        setOrders(response.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load orders");
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
      case 'paid': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Menunggu Diambil</span>;
      case 'picked_up':
      case 'completed': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Selesai</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold uppercase">Dibatalkan</span>;
      default: return null;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full"></div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold font-heading mb-8">Pesanan Saya</h1>
      
      {/* Mini Impact Summary */}
      <div className="bg-[var(--color-primary)] text-white rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div>
          <h2 className="text-xl font-bold font-heading mb-1">Dampak Lingkungan Anda 🌿</h2>
          <p className="text-green-100 text-sm">Terima kasih {user?.name} telah berkontribusi menyelamatkan bumi!</p>
        </div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <div className="text-center bg-white/10 p-3 rounded-xl border border-white/20">
            <p className="text-3xl font-bold">{orders.filter(o => o.status === 'completed' || o.status === 'picked_up').length}</p>
            <p className="text-xs text-green-100">Porsi Terselamatkan</p>
          </div>
          <div className="text-center bg-white/10 p-3 rounded-xl border border-white/20">
            <p className="text-3xl font-bold">{(orders.filter(o => o.status === 'completed' || o.status === 'picked_up').length * 2.5).toFixed(1)} kg</p>
            <p className="text-xs text-green-100">CO2e Dicegah</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">receipt_long</span>
            <p className="text-gray-500 mb-4">Anda belum memiliki pesanan.</p>
            <Link to="/marketplace">
              <Button>Cari Makanan</Button>
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="flex flex-col sm:flex-row gap-6 items-center">
              <div className="w-full sm:w-1/4">
                <div className="h-32 bg-gray-100 rounded-xl overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop" alt="Food" className="w-full h-full object-cover opacity-80" />
                </div>
              </div>
              <div className="w-full sm:w-2/4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold font-heading">Order #{order.id.toString().substring(0, 8)}</h3>
                  {getStatusBadge(order.status)}
                </div>
                <p className="text-gray-600 mb-1">Jumlah: {order.quantity} porsi</p>
                <p className="text-sm text-gray-400 mb-3">Dipesan pada: {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                <p className="font-bold text-[var(--color-primary)] text-lg">Total: {formatRupiah(order.total_amount)}</p>
              </div>
              <div className="w-full sm:w-1/4 text-center sm:text-right flex flex-col justify-center h-full">
                {(order.status === 'pending' || order.status === 'paid') && (
                   <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                     <p className="text-xs text-gray-500 mb-1">Ambil pesanan di:</p>
                     <p className="font-bold text-sm text-gray-800 mb-2">{order.store_name || 'Toko FoodSaver'}</p>
                     <p className="text-xs text-gray-500 mb-2">Tunjukkan kode ini ke Kasir</p>
                     <div className="bg-white border border-gray-300 py-2 px-3 rounded-lg flex flex-col items-center justify-center">
                       <span className="font-mono text-xl font-bold tracking-widest text-[var(--color-primary)]">{order.pickup_code}</span>
                     </div>
                   </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
