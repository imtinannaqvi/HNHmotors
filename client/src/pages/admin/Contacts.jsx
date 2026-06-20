import React, { useEffect, useState } from 'react';
import axios from '../../api/axios.js';
import { Mail, Phone, Trash2, MailOpen, MailWarning, Clock, MessageSquare, Inbox } from 'lucide-react';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all'); // all | unread | read

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/contact', { headers })
      .then(({ data }) => setContacts(data))
      .catch(err => console.error('Contacts error:', err))
      .finally(() => setLoading(false));
  }, []);

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60)    return 'Just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const fullDate = (date) =>
    new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const toggleRead = async (c) => {
    try {
      const { data } = await axios.put(`/contact/${c._id}/read`, { isRead: !c.isRead }, { headers });
      setContacts(prev => prev.map(x => x._id === c._id ? { ...x, isRead: data.isRead } : x));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`/contact/${id}`, { headers });
      setContacts(prev => prev.filter(x => x._id !== id));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  const unreadCount = contacts.filter(c => !c.isRead).length;

  const filtered = contacts.filter(c =>
    filter === 'unread' ? !c.isRead :
    filter === 'read'   ?  c.isRead : true
  );

  const tabs = [
    { key: 'all',    label: 'All',    count: contacts.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'read',   label: 'Read',   count: contacts.length - unreadCount },
  ];

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
          <Inbox size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Messages</h1>
          <p className="text-sm text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread of ${contacts.length}` : `${contacts.length} message${contacts.length !== 1 ? 's' : ''}, all read`}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mt-5 mb-5 border-b border-gray-100">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition ${
              filter === t.key
                ? 'border-gray-900 text-gray-900'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}>
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              filter === t.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
            }`}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-200 rounded-2xl">
          <MessageSquare size={30} className="text-gray-200 mb-3" />
          <p className="text-sm text-gray-400">No messages here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <div key={c._id}
              className={`rounded-2xl border bg-white overflow-hidden transition hover:shadow-sm ${
                c.isRead ? 'border-gray-100' : 'border-gray-200 ring-1 ring-orange-100'
              }`}>

              {/* Card header — sender + time */}
              <div className={`flex items-center gap-3 px-5 py-3.5 border-b ${
                c.isRead ? 'border-gray-50' : 'border-orange-50 bg-orange-50/40'
              }`}>
                <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{c.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate">{c.name}</p>
                    {!c.isRead && (
                      <span className="text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wide">New</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{c.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-medium text-gray-500">{timeAgo(c.createdAt)}</p>
                  <p className="text-[10px] text-gray-300">{fullDate(c.createdAt)}</p>
                </div>
              </div>

              {/* Card body — subject + message */}
              <div className="px-5 py-4">
                {c.subject && (
                  <p className="text-sm font-semibold text-gray-900 mb-1.5">{c.subject}</p>
                )}
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{c.message}</p>

                {c.phone && (
                  <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50">
                    <Phone size={12} /> {c.phone}
                  </p>
                )}
              </div>

              {/* Card actions */}
              <div className="flex items-center gap-2 px-5 py-3 bg-gray-50/70 border-t border-gray-50">
                <button onClick={() => toggleRead(c)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 text-gray-600 hover:bg-white rounded-lg transition">
                  {c.isRead ? <><MailWarning size={13} /> Mark unread</> : <><MailOpen size={13} /> Mark read</>}
                </button>
                <a href={`mailto:${c.email}`}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 text-blue-600 hover:bg-white rounded-lg transition">
                  <Mail size={13} /> Reply
                </a>
                <button onClick={() => remove(c._id)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 text-red-500 hover:bg-white rounded-lg transition ml-auto">
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;