import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios.js';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Car, Users, Mail, Eye, Plus, List, Tag, PoundSterling, AlertTriangle, MessageSquare } from 'lucide-react';

const API_BASE = '';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    cars: 0, users: 0, inquiries: 0, contacts: 0, visits: 0,
    recentCars: [], recentUsers: [], activityTrend: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/stats', { headers: { Authorization: `Bearer ${token}` } })
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

  // Format trend data: turn "2026-06-20" into "Fri" for the x-axis
  const chartData = (stats.activityTrend || []).map((d) => {
    const day = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' });
    return { day, enquiries: d.enquiries || 0, contacts: d.contacts || 0, visits: d.visits || 0 };
  });

  const totalEnquiries = chartData.reduce((s, d) => s + d.enquiries, 0);
  const totalContacts  = chartData.reduce((s, d) => s + d.contacts, 0);
  const totalVisits    = chartData.reduce((s, d) => s + d.visits, 0);

  const hasActivity = totalEnquiries + totalContacts + totalVisits > 0;

  const statCards = [
    { label: 'Site visits',  value: stats.visits ?? 0,    sub: 'all time',       icon: Eye },
    { label: 'Total cars',   value: stats.cars ?? 0,      sub: 'in inventory',   icon: Car },
    { label: 'Total users',  value: stats.users ?? 0,     sub: 'registered',     icon: Users },
    { label: 'Enquiries',    value: stats.inquiries ?? 0, sub: 'total received', icon: Mail },
    { label: 'Contacts',     value: stats.contacts ?? 0,  sub: 'messages',       icon: MessageSquare },
    { label: 'Inventory',    value: `£${(stats.inventoryValue || 0).toLocaleString()}`, sub: 'total stock', icon: PoundSterling },
  ];

  const actions = [
    { label: 'Add new car',      icon: Plus, path: '/admin/add-car',     primary: true },
    { label: 'Manage inventory', icon: List, path: '/admin/manage-cars', primary: false },
    { label: 'Site settings',    icon: List, path: '/admin/settings',    primary: false },
  ];

  const lowStock = !loading && stats.cars < 3;

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard overview</h1>
      </div>

      {/* Low stock alert */}
      {lowStock && (
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
            <p className="text-xl font-bold text-gray-900 truncate">{loading ? '—' : value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Activity chart — visits, enquiries, contacts over last 7 days */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Activity — last 7 days</h2>
            <p className="text-xs text-gray-400 mt-0.5">Visits, enquiries and contact messages per day</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-bold text-amber-500 leading-none">{totalVisits}</p>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 justify-end"><Eye size={10} /> visits</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-indigo-600 leading-none">{totalEnquiries}</p>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 justify-end"><Mail size={10} /> enquiries</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-600 leading-none">{totalContacts}</p>
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1 justify-end"><MessageSquare size={10} /> contacts</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
          </div>
        ) : !hasActivity ? (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <MessageSquare size={28} className="text-gray-200 mb-2" />
            <p className="text-sm text-gray-400">No activity recorded yet</p>
            <p className="text-xs text-gray-300 mt-1">Visits, enquiries and messages will appear here as they come in</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gEnq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  labelStyle={{ fontWeight: 600, color: '#0f172a' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={8} />
                <Area type="monotone" dataKey="visits"    name="Visits"    stroke="#f59e0b" strokeWidth={2} fill="url(#gVis)" />
                <Area type="monotone" dataKey="enquiries" name="Enquiries" stroke="#6366f1" strokeWidth={2} fill="url(#gEnq)" />
                <Area type="monotone" dataKey="contacts"  name="Contacts"  stroke="#10b981" strokeWidth={2} fill="url(#gCon)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
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
                    <span className="text-white text-xs font-bold">{user.name?.charAt(0).toUpperCase()}</span>
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