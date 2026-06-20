import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios.js';
import { MapPin, Phone, Menu, X, Shield, Car, Home, Info, Mail } from 'lucide-react';

const Navbar = () => {
  const [settings, setSettings] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  const token = localStorage.getItem('token');
  let user = null;
  try {
    const raw = localStorage.getItem('user');
    user = raw && raw !== 'undefined' ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    axios.get('/settings')
      .then(({ data }) => setSettings(data))
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const navLinks = settings?.navbar?.navLinks || [];
  const logo     = settings?.navbar?.logo || settings?.footer?.logo;
  const location = settings?.navbar?.location;
  const phone    = settings?.navbar?.phoneNumber;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const subLinks = [
    { to: '/',        label: 'Home',    icon: Home },
    { to: '/about',   label: 'About',   icon: Info },
    { to: '/contact', label: 'Contact', icon: Mail },
    ...navLinks.map(l => ({
      to: `/${l.title.toLowerCase().replace(/\s+/g, '-')}`,
      label: l.title,
      icon: Car,
    })),
  ];

  const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to);

  return (
    <header className="w-full z-50">

      {/* ── TOP BAR ── */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 sm:gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 transition-transform duration-300 hover:scale-[1.04]">
            {logo ? (
              <img src={`/${logo}`} alt="Logo"
                className="h-16 sm:h-20 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-1">
                <span style={{ fontStyle: 'italic', fontWeight: 900, fontSize: '28px', color: '#111', letterSpacing: '-1px', fontFamily: 'Georgia, serif' }}>
                  <span style={{ color: '#e85d04' }}>H</span>NH
                </span>
                <span style={{ fontWeight: 300, fontSize: '28px', color: '#111', letterSpacing: '2px', marginLeft: '6px' }}>MOTORS</span>
              </div>
            )}
          </Link>

          {/* Center: location + phone */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {location && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors duration-300 hover:bg-orange-500 group"
                  style={{ borderColor: '#e85d04' }}>
                  <MapPin size={16} style={{ color: '#e85d04' }} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#e85d04' }}>Location</p>
                  <p className="text-sm font-semibold text-gray-900">{location}</p>
                </div>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2" style={{ borderColor: '#e85d04' }}>
                  <Phone size={16} style={{ color: '#e85d04' }} />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#e85d04' }}>Phone</p>
                  <a href={`tel:${phone}`} className="text-sm font-bold text-gray-900 hover:text-orange-500 transition-colors duration-200">{phone}</a>
                </div>
              </div>
            )}
          </div>

          {/* Right: auth */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {token ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded text-white transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5"
                    style={{ background: '#e85d04' }}>
                    <Shield size={13} /> Admin
                  </Link>
                )}
                <button onClick={handleLogout} className="text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors duration-200">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-semibold text-gray-700 hover:text-gray-900 hover:border-gray-400 transition-all duration-200 px-3 py-2 border border-gray-200 rounded">Login</Link>
                <Link to="/register" className="text-sm font-bold text-white px-4 py-2 rounded transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5" style={{ background: '#e85d04' }}>Register</Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-gray-700 transition-transform active:scale-90" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── SUB-NAV ── */}
      <div className="hidden md:block bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center justify-center">
          {subLinks.map(({ to, label }) => (
            <Link key={to} to={to}
              className="relative px-5 py-3 text-md font-bold tracking-wide transition-colors duration-200 group"
              style={{ color: isActive(to) ? '#e85d04' : '#222', letterSpacing: '0.05em' }}>
              {label}
              <span
                className="absolute left-1/2 -translate-x-1/2 bottom-1.5 h-0.5 bg-orange-500 transition-all duration-300"
                style={{ width: isActive(to) ? '60%' : '0%' }}
              />
              <span className="absolute left-1/2 -translate-x-1/2 bottom-1.5 h-0.5 bg-orange-500 w-0 group-hover:w-[40%] transition-all duration-300" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-6 py-5 flex flex-col gap-3 shadow-lg animate-fade-up">
          {location && (
            <span className="flex items-center gap-2 text-sm text-gray-600"><MapPin size={14} style={{ color: '#e85d04' }} /> {location}</span>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} style={{ color: '#e85d04' }} /> {phone}</a>
          )}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-1">
            {subLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className="px-3 py-2.5 text-sm font-bold uppercase tracking-wide rounded transition-colors duration-200"
                style={{ color: isActive(to) ? '#fff' : '#222', background: isActive(to) ? '#e85d04' : 'transparent' }}>
                {label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            {token ? (
              <>
                {isAdmin && <Link to="/admin" className="flex items-center gap-2 text-sm font-bold" style={{ color: '#e85d04' }}><Shield size={14} /> Admin Panel</Link>}
                <button onClick={handleLogout} className="text-sm font-semibold text-left text-gray-500">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700">Login</Link>
                <Link to="/register" className="text-sm font-bold" style={{ color: '#e85d04' }}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;