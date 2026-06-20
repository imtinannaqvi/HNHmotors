import React, { useEffect, useState } from 'react';
import axios from '../../api/axios.js';
import { Mail, Phone, Trash2, MailOpen, MailWarning, Clock, MessageSquare } from 'lucide-react';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all'); // all | unread | read

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  // Load all messages
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

  // Mark a message read/unread
  const toggleRead = async (c) => {
    try {
      const { data } = await axios.put(`/contact/${c._id}/read`, { isRead: !c.isRead }, { headers });
      setContacts(prev => prev.map(x => x._id === c._id ? { ...x, isRead: data.isRead } : x));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete a message
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
    <div className="max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {unreadCount > 0 ? `${unreadCount} unread message${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              filter === t.key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            {t.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              filter === t.key ? 'bg-white/20' : 'bg-gray-200'
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
              className={`bg-white border rounded-2xl p-5 shadow-sm transition ${
                c.isRead ? 'border-gray-100' : 'border-l-4 border-l-orange-400 border-gray-100'
              }`}>

              {/* Top row: avatar + name/email + status + time */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">{c.name?.charAt(0).toUpperCase()}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">{c.name}</p>
                    {!c.isRead && (
                      <span className="text-[10px] font-bold bg-orange-50 text-orange-500 px-2 py-0.5 rounded-full">NEW</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1"><Mail size={11} /> {c.email}</span>
                    {c.phone && <span className="flex items-center gap-1"><Phone size={11} /> {c.phone}</span>}
                    <span className="flex items-center gap-1"><Clock size={11} /> {timeAgo(c.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              {c.subject && (
                <p className="text-sm font-semibold text-gray-800 mt-3">{c.subject}</p>
              )}

              {/* Message */}
              <div className="mt-2 bg-gray-50 rounded-xl p-3">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{c.message}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => toggleRead(c)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition">
                  {c.isRead ? <><MailWarning size={13} /> Mark unread</> : <><MailOpen size={13} /> Mark read</>}
                </button>
                <a href={`mailto:${c.email}`}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                  <Mail size={13} /> Reply
                </a>
                <button onClick={() => remove(c._id)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition ml-auto">
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