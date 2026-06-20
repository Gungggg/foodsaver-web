import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMerchants: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, there would be dedicated admin endpoints.
    // We are simulating fetching global metrics by fetching available lists if the API supports it.
    // For now, we'll try to fetch all products and orders to calculate some metrics.
    const fetchAdminData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders')
        ]);
        
        const products = productsRes.data.data || [];
        const orders = ordersRes.data.data || [];

        setStats({
          totalUsers: 'N/A', // Assuming no GET /users endpoint is publicly accessible yet
          totalMerchants: 'N/A', 
          totalProducts: products.length,
          totalOrders: orders.length
        });

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

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

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">admin_panel_settings</span>
        <h2 className="text-xl font-bold font-heading mb-2">Verifikasi Merchant (Coming Soon)</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Fitur untuk menyetujui atau menolak pendaftaran merchant baru akan segera hadir setelah endpoint API terkait verifikasi diimplementasikan di backend.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
