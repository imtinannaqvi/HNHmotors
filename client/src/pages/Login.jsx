import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { data } = await api.post('/auth/login', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({
      _id:   data._id,
      name:  data.name,
      email: data.email,
      role:  data.role,
    }));
    navigate(data.role === 'admin' ? '/admin' : '/');
  } catch (err) {
    alert(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-up">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1 mb-4">
            <span style={{ fontStyle: 'italic', fontWeight: 900, fontSize: '26px', color: '#111', letterSpacing: '-1px', fontFamily: 'Georgia, serif' }}>
              <span style={{ color: '#e85d04' }}>H</span>NH
            </span>
            <span style={{ fontWeight: 300, fontSize: '26px', color: '#111', letterSpacing: '2px', marginLeft: '4px' }}>MOTORS</span>
          </div>
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Welcome Back</h2>
          <div className="flex items-center justify-center gap-2 mt-3 mb-2">
            <div className="h-0.5 w-10 bg-orange-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            <div className="h-0.5 w-10 bg-orange-500" />
          </div>
          <p className="text-gray-500 text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600 transition">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;