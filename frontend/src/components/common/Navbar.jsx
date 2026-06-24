import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-display font-bold text-lg gradient-text">
              TravelMind AI
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-ghost">Dashboard</Link>
                <Link to="/upload" className="btn-ghost">Upload</Link>
                <Link to="/itineraries" className="btn-ghost">My Trips</Link>
                <div className="flex items-center gap-3 pl-4 border-l border-dark-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-dark-300">{user?.name}</span>
                  <button onClick={handleLogout} className="btn-ghost text-sm text-red-400 hover:text-red-300">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden btn-ghost"
          >
            {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-dark-300 hover:text-white" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/upload" className="block px-4 py-2 text-dark-300 hover:text-white" onClick={() => setMobileOpen(false)}>Upload</Link>
                <Link to="/itineraries" className="block px-4 py-2 text-dark-300 hover:text-white" onClick={() => setMobileOpen(false)}>My Trips</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-4 py-2 text-red-400">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-4 py-2 text-dark-300 hover:text-white" onClick={() => setMobileOpen(false)}>Login</Link>
                <Link to="/register" className="block px-4 py-2 text-primary-400" onClick={() => setMobileOpen(false)}>Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
