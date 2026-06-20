import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-green-400 text-3xl">eco</span>
              <span className="font-heading font-bold text-2xl text-white">
                Food<span className="text-green-400">Saver</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Misi kami adalah menyelamatkan makanan berkualitas dari pembuangan sia-sia, 
              sekaligus memberikan Anda hidangan lezat dengan harga yang jauh lebih murah.
            </p>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors">Cara Kerja</Link></li>
              <li><Link to="/impact" className="text-gray-400 hover:text-white transition-colors">Dampak Lingkungan</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Untuk Mitra</h4>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-400 hover:text-white transition-colors">Daftar sebagai Merchant</Link></li>
              <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login Merchant</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} FoodSaver. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="material-symbols-outlined">public</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
