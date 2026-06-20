import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, Car, PlusCircle, Settings, ShieldCheck, Users, Tag, Inbox, MessageSquare, Home } from 'lucide-react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { pathname } = useLocation();

  const navLinks = [
    { name: 'Dashboard',      path: '/admin',                icon: LayoutDashboard, exact: true  },
    { name: 'Add New Car',    path: '/admin/add-car',        icon: PlusCircle,      exact: false },
    { name: 'Manage Cars',    path: '/admin/manage-cars',    icon: Car,             exact: false },
    { name: 'Manage Users',   path: '/admin/users',          icon: Users,           exact: false },
    { name: 'Enquiries',      path: '/admin/enquiries',      icon: Inbox,           exact: false },
    { name: 'Messages',       path: '/admin/contacts',       icon: MessageSquare,   exact: false },
    { name: 'Special Offers', path: '/admin/special-offers', icon: Tag,             exact: false },
    { name: 'Site Settings',  path: '/admin/settings',       icon: Settings,        exact: false },
  ];

  const isActive = (link) =>
    link.exact ? pathname === link.path : pathname.startsWith(link.path);

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} h-screen bg-blue-400 text-white flex flex-col fixed border-r border-gray-800 transition-all duration-300 z-40`}>

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-400">
        {isOpen && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <ShieldCheck size={20} className="text-slate-600 flex-shrink-0" />
            <span className="font-bold text-sm text-white whitespace-nowrap">Admin Panel</span>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)}
          className={`text-slate-600 hover:text-white transition ${!isOpen ? 'mx-auto' : ''}`}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ name, path, icon: Icon, exact }) => {
          const active = isActive({ path, exact });
          return (
            <Link key={name} to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-blue-300 text-white'
                  : 'text-white hover:bg-blue-300 hover:text-white'
              }`}>
              <Icon size={18} className="flex-shrink-0" />
              {isOpen && <span className="whitespace-nowrap">{name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* View Site — back to the public homepage */}
      <div className="px-3 pb-3">
        <Link to="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white hover:bg-blue-300 hover:text-white transition-all border border-gray-800 ${!isOpen ? 'justify-center' : ''}`}>
          <Home size={18} className="flex-shrink-0" />
          {isOpen && <span className="whitespace-nowrap">View Site</span>}
        </Link>
      </div>

      {/* Footer */}
      {isOpen && (
        <div className="px-5 py-4 border-t border-gray-800">
          <p className="text-[12px] text-hite font-bold">HNH Motors © {new Date().getFullYear()}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;