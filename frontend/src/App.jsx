import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/customer/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Marketplace from './pages/customer/Marketplace';
import ProductDetail from './pages/customer/ProductDetail';
import Orders from './pages/customer/Orders';

import MerchantDashboard from './pages/merchant/Dashboard';
import MerchantProducts from './pages/merchant/Products';
import AdminDashboard from './pages/admin/Dashboard';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <div className="App font-body min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Orders />
              </ProtectedRoute>
            } 
          />
        
        {/* Merchant Routes */}
        <Route 
          path="/merchant" 
          element={
            <ProtectedRoute allowedRoles={['merchant', 'admin']}>
              <MerchantDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/merchant/products" 
          element={
            <ProtectedRoute allowedRoles={['merchant', 'admin']}>
              <MerchantProducts />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
