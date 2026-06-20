import React, { useEffect, useState } from 'react';
import axios from '../../api/axios.js';
import { Users, Trash2, Shield, User, ChevronDown } from 'lucide-react';

const ManageUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/admin/users', { headers })
      .then(({ data }) => setUsers(data.users || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
    try {
      await axios.put(`/admin/users/${id}/role`, { role }, { headers });
      setUsers(prev => prev.map(u => u._id === id ? { ...u, role } : u));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${id}`, { headers });
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Manage Users</h1>
        <p className="text-sm text-gray-400 mt-0.5">{users.length} users registered</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">User</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Email</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Role</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Joined</th>
              <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-16 text-center text-sm text-gray-400">No users found</td></tr>
            ) : users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4">
                  <div className="relative inline-block">
                    <select
                      value={user.role}
                      onChange={e => changeRole(user._id, e.target.value)}
                      className={`text-[11px] font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer appearance-none pr-6 ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                'bg-gray-100 text-gray-500'
                      }`}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteUser(user._id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;