import React, { useEffect, useState } from 'react';
import axios from '../../api/axios.js'; // Import your configured axios instance

const AdminDashboard = () => {
  const [stats, setStats] = useState({ cars: 0, users: 0, inquiries: 0 });

  useEffect(() => {
    // You'll need to create this endpoint in your backend
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/admin/stats'); 
        setStats(data);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500">Total Cars</h3>
          <p className="text-4xl font-bold">{stats.cars}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500">Total Users</h3>
          <p className="text-4xl font-bold">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-gray-500">Inquiries</h3>
          <p className="text-4xl font-bold">{stats.inquiries}</p>
        </div>
      </div>

      {/* Placeholder for Recent Activity */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Add New Car</button>
            <button className="bg-gray-200 px-4 py-2 rounded">View All Users</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;