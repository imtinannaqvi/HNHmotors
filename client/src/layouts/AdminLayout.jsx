// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar'; // Check this path!

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-8 w-full bg-gray-100 min-h-screen">
        {/* THIS IS CRITICAL: It renders the child pages */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;