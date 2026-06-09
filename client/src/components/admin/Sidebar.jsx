import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Car, PlusCircle, Settings, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const navLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Add New Car', path: '/admin/add-car', icon: <PlusCircle size={20} /> },
    { name: 'Manage Cars', path: '/admin/manage-cars', icon: <Car size={20} /> },
    { name: 'Site Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} h-screen bg-gray-900 text-white p-6 fixed border-r border-gray-700 transition-all duration-300`}>
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-gray-400 hover:text-white mb-8"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Title with Icon */}
      <div className="flex items-center gap-3 mb-10 text-blue-400 border-b border-gray-700 pb-4 overflow-hidden whitespace-nowrap">
        <ShieldCheck size={28} className="flex-shrink-0" />
        {isOpen && <h2 className="font-bold text-xl">Admin Panel</h2>}
      </div>
      
      <ul className="space-y-6">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link 
              to={link.path} 
              className="flex items-center gap-4 p-2 rounded hover:bg-gray-800 hover:text-blue-400 transition-all border-l-4 border-transparent hover:border-blue-400"
            >
              {link.icon}
              {isOpen && <span>{link.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;