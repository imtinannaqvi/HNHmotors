import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.js';
import { Car, Users, Mail, CheckCircle, Plus, List, Tag, PoundSterling, AlertTriangle } from 'lucide-react';

const API_BASE = '';

const CATEGORY_COLORS = ['#6366f1','#f59e0b','#10b981','#3b82f6','#ef4444','#8b5cf6','#ec4899','#14b8a6'];
const BRAND_COLORS    = ['#1e293b','#334155','#475569','#64748b','#94a3b8','#cbd5e1'];

const AdminDashboard = () => {
  const [stats,   setStats]   = useState({ cars: 0, users: 0, inquiries: 0, sold: 0, specialOffers: 0, inventoryValue: 0, recentCars: [], recentUsers: [], brandBreakdown: [], categoryBreakdown: [] });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => setStats(data))
      .catch(err => console.error('Stats error:', err))
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const maxBrand    = Math.max(...(stats.brandBreakdown.map(b => b.count)), 1);
  const totalCatSum = stats.categoryBreakdown.reduce((s, c) => s + c.count, 0) || 1;

  const statCards = [
    { label: 'Total cars',       value: stats.cars,                                          sub: 'in inventory',    icon: Car,           },
    { label: 'Total users',      value: stats.users,                                         sub: 'registered',      icon: Users,         },
    { label: 'Sold',             value: stats.sold ?? 0,                                     sub: 'cars sold',       icon: CheckCircle,   },
    { label: 'Special offers',   value: stats.specialOffers ?? 0,                            sub: 'active deals',    icon: Tag,           },
    { label: 'Inventory value',  value: `£${(stats.inventoryValue||0).toLocaleString()}`,    sub: 'total stock',     icon: PoundSterling, },
    { label: 'Inquiries',        value: stats.inquiries ?? 0,                                sub: 'total received',  icon: Mail,          },
  ];

  const actions = [
    { label: 'Add new car',      icon: Plus,  path: '/admin/add-car',     primary: true  },
    { label: 'Manage inventory', icon: List,  path: '/admin/manage-cars', primary: false },
    { label: 'Site settings',    icon: List,  path: '/admin/settings',    primary: false },
  ];

  const lowStock = stats.cars < 3;

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard overview</h1>
      </div>

      {/* Low stock alert */}
      {!loading && lowStock && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-sm font-medium">
          <AlertTriangle size={16} /> Low inventory — only {stats.cars} car{stats.cars !== 1 ? 's' : ''} listed.
          <button onClick={() => navigate('/admin/add-car')} className="ml-auto underline underline-offset-2 text-xs font-bold">Add now</button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statCards.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-4 col-span-1">
            <Icon size={16} className="text-gray-400 mb-2" />
            <p className="text-[10px] text-gray-400 mb-0.5 font-medium">{label}</p>
            <p className="text-xl font-bold text-gray-900 truncate">
              {loading ? '—' : value}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Row 2: Brand chart + Category donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Brand bar chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Cars by brand</h2>
          {loading ? <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" /></div>
          : stats.brandBreakdown.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
          : (
            <div className="space-y-2.5">
              {stats.brandBreakdown.map(({ brand, count }, i) => (
                <div key={brand}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1 font-medium">
                    <span>{brand}</span><span>{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(count / maxBrand) * 100}%`, background: BRAND_COLORS[i % BRAND_COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Category breakdown</h2>
          {loading ? <div className="h-32 flex items-center justify-center"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" /></div>
          : stats.categoryBreakdown.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No data yet</p>
          : (
            <div className="space-y-2">
              {stats.categoryBreakdown.map(({ category, count }, i) => (
                <div key={category} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(count / totalCatSum) * 100}%`, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right font-medium">{category} ({count})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Recent cars + Recent users + Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Recent cars */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm md:col-span-1">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Recently added</h2>
          {loading ? <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" /></div>
          : stats.recentCars?.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No cars yet</p>
          : (
            <div className="divide-y divide-gray-50">
              {stats.recentCars.map(car => (
                <div key={car._id} onClick={() => navigate(`/admin/edit-car/${car._id}`)}
                  className="flex items-center gap-3 py-2.5 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-xl transition">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {car.thumbnail
                      ? <img src={`${API_BASE}/${car.thumbnail}`} alt={car.title} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Car size={13} className="text-gray-300" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{car.title}</p>
                    <p className="text-[10px] text-gray-400">{timeAgo(car.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent users */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm md:col-span-1">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Recent users</h2>
          {loading ? <div className="flex items-center justify-center py-8"><div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" /></div>
          : stats.recentUsers?.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No users yet</p>
          : (
            <div className="divide-y divide-gray-50">
              {stats.recentUsers.map(user => (
                <div key={user._id} className="flex items-center gap-3 py-2.5">
                  <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                    user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                    user.role === 'dealer' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>{user.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm md:col-span-1">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Quick actions</h2>
          <div className="flex flex-col gap-2">
            {actions.map(({ label, icon: Icon, path, primary }) => (
              <button key={label} onClick={() => navigate(path)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                  primary ? 'bg-gray-900 text-white hover:bg-black' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;