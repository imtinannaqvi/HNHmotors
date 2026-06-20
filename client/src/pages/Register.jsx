import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // If register returns a token, log them straight in; otherwise go to login
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">

          {/* Heading */}
          <div className="text-center mb-7">
            <h1 className="text-2xl font-black text-gray-900">Create your account</h1>
            <p className="text-sm text-gray-400 mt-1">Join HNH Motors to get started</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div className="relative">
              <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="name" value={form.name} onChange={handleChange} required
                placeholder="Full name" className={inputCls} />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="Email address" className={inputCls} />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} required
                placeholder="Password" className={inputCls} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <CheckCircle size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input name="confirm" type={showPass ? 'text' : 'password'} value={form.confirm} onChange={handleChange} required
                placeholder="Confirm password" className={inputCls} />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : 'Create account'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;