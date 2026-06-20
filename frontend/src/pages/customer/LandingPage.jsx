import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/ui/Button';

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--color-primary)] text-white pt-24 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          {/* Abstract background shapes */}
          <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[130%] rounded-full bg-[var(--color-secondary)] opacity-20 blur-3xl mix-blend-screen"></div>
          <div className="absolute top-[50%] -left-[10%] w-[50%] h-[100%] rounded-full bg-emerald-400 opacity-20 blur-3xl mix-blend-screen"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-heading leading-tight mb-6 text-white">
                Selamatkan Makanan, <br/>
                <span className="text-[var(--color-secondary)]">Nikmati Hematnya.</span>
              </h1>
              <p className="text-lg sm:text-xl text-green-50 mb-8 max-w-lg">
                Dapatkan makanan berkualitas dari restoran dan toko favorit Anda dengan harga hingga 70% lebih murah sebelum terbuang sia-sia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/marketplace">
                  <Button className="w-full sm:w-auto !py-4 !px-8 text-lg shadow-lg hover:-translate-y-1 transition-transform">
                    Mulai Selamatkan Makanan
                  </Button>
                </Link>
                <Link to="/#how-it-works">
                  <Button variant="secondary" className="w-full sm:w-auto !py-4 !px-8 text-lg !text-white !border-white hover:!bg-white/10">
                    Pelajari Lebih Lanjut
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop" 
                  alt="Delicious food" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl text-gray-900 shadow-lg flex items-center justify-between">
                  <div>
                    <p className="font-bold font-heading">Surprise Bag Bakery</p>
                    <p className="text-sm text-gray-600">Sisa 3 porsi hari ini</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 line-through">Rp 50.000</p>
                    <p className="font-bold text-[var(--color-primary)] text-xl">Rp 15.000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-4">Bagaimana Cara Kerjanya?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">Hanya dalam 3 langkah mudah, Anda bisa menikmati makanan enak sekaligus menjaga bumi.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'shopping_cart', title: '1. Temukan Makanan', desc: 'Cari restoran atau toko terdekat di aplikasi FoodSaver yang memiliki makanan berlebih hari ini.' },
              { icon: 'credit_card', title: '2. Pesan & Bayar', desc: 'Pesan Surprise Bag atau makanan satuan dengan harga diskon besar, bayar dengan aman.' },
              { icon: 'storefront', title: '3. Ambil di Toko', desc: 'Datang ke toko pada waktu yang ditentukan dan tunjukkan pesanan Anda untuk mengambil makanan.' }
            ].map((step, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--color-secondary)] transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl text-[var(--color-primary)] group-hover:text-white transition-colors">{step.icon}</span>
                </div>
                <h3 className="text-xl font-bold font-heading mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-24 bg-[var(--color-primary)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-12 text-white">Dampak Kita Bersama</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-5xl text-[var(--color-secondary)] mb-4">restaurant</span>
              <h3 className="text-4xl font-bold mb-2">12,500+</h3>
              <p className="text-green-100">Porsi Makanan Terselamatkan</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-5xl text-[var(--color-secondary)] mb-4">co2</span>
              <h3 className="text-4xl font-bold mb-2">31,250 kg</h3>
              <p className="text-green-100">Emisi CO2e Dicegah</p>
            </div>
            <div className="p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <span className="material-symbols-outlined text-5xl text-[var(--color-secondary)] mb-4">account_balance_wallet</span>
              <h3 className="text-4xl font-bold mb-2">Rp 450 Juta</h3>
              <p className="text-green-100">Uang Pelanggan Dihemat</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
