import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Menu, X, Droplets, Building2, Users, Phone, Info, LayoutDashboard, LogOut, LogIn } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = [
    { name: 'Home', path: '/', icon: Heart },
    { name: 'Donors Registry', path: '/donors', icon: Users },
    { name: 'Hospitals', path: '/hospitals', icon: Building2 },
    { name: 'About Us', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/auth';
    const role = user.role.toUpperCase();
    if (role === 'DONOR') return '/dashboard/donor';
    if (role === 'RECEIVER') return '/dashboard/receiver';
    if (role === 'HOSPITAL') return '/dashboard/hospital';
    if (role === 'ADMIN') return '/dashboard/admin';
    return '/auth';
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-red-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Heart className="h-8 w-8 text-primary heartbeat" fill="currentColor" />
              <Droplets className="absolute -top-1 -right-1 h-4 w-4 text-primary-glow blood-drop" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gradient-hero">VitaLink</span>
              <p className="text-xs text-muted-foreground -mt-1">Save Lives Together</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Auth Dependent Navigation Items */}
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardPath()}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname.startsWith('/dashboard')
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 px-4 py-2 bg-primary hover:bg-primary-glow text-white rounded-lg text-sm font-bold shadow-md transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Portal Login</span>
              </Link>
            )}
          </div>

          {/* Emergency Button */}
          <Link
            to="/emergency"
            className="hidden md:block btn-emergency text-sm px-5 py-2.5"
          >
            🚨 Emergency Blood
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-primary/5 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {/* Mobile Auth Dependent Links */}
              {isAuthenticated ? (
                <>
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium text-gray-600 hover:text-primary hover:bg-primary/5"
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="flex items-center space-x-3 w-full text-left px-3 py-3 rounded-lg text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center space-x-2 px-3 py-3 bg-primary text-white rounded-lg text-base font-bold shadow-md"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Portal Login</span>
                </Link>
              )}

              <Link
                to="/emergency"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center btn-emergency w-full mt-4"
              >
                🚨 Emergency Blood
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;