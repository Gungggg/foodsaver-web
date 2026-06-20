import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 text-3xl">eco</span>
            <Link to="/" className="font-heading font-bold text-2xl text-[var(--color-primary)]">
              Food<span className="text-[var(--color-secondary)]">Saver</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/marketplace" className="text-gray-600 hover:text-[var(--color-primary)] font-medium transition-colors">
              Marketplace
            </Link>
            <Link to="/#how-it-works" className="text-gray-600 hover:text-[var(--color-primary)] font-medium transition-colors">
              How it works
            </Link>
            <Link to="/#impact" className="text-gray-600 hover:text-[var(--color-primary)] font-medium transition-colors">
              Impact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  Hi, {user.name}
                </span>
                {user.role === 'customer' && (
                  <Link to="/orders">
                    <Button variant="secondary" className="!px-3 !py-2">
                      <span className="material-symbols-outlined text-[18px] mr-1">receipt_long</span>
                      Orders
                    </Button>
                  </Link>
                )}
                {(user.role === 'merchant' || user.role === 'admin') && (
                  <Link to={`/${user.role}`}>
                    <Button variant="secondary" className="!px-3 !py-2">Dashboard</Button>
                  </Link>
                )}
                <Button variant="danger" className="!px-3 !py-2" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-[var(--color-primary)] font-medium hover:text-[var(--color-secondary)] transition-colors">
                  Login
                </Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
