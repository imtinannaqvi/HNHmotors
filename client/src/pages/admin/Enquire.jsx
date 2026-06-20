import React, { useEffect, useState } from 'react';
import axios from "../../api/axios.js";
import { Trash2, Mail, Inbox, Check, ChevronDown, ChevronUp } from 'lucide-react';

const ManageEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [openId,    setOpenId]    = useState(null);

  useEffect(() => { fetchEnquiries(); }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/enquiries');
      setEnquiries(data.enquiries || []);
    } catch (err) {
      console.error('Error fetching enquiries:', err);
      setEnquiries([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    try {
      await axios.delete(`/enquiries/${id}`);
      setEnquiries(prev => prev.filter(e => e._id !== id));
    } catch (err) {
      alert('Error deleting enquiry');
    }
  };

  const markRead = async (id) => {
    try {
      await axios.put(`/enquiries/${id}`, { isRead: true });
      setEnquiries(prev => prev.map(e => e._id === id ? { ...e, isRead: true } : e));
    } catch (err) {
      // non-blocking
    }
  };

  const toggleOpen = (enq) => {
    setOpenId(prev => (prev === enq._id ? null : enq._id));
    if (!enq.isRead) markRead(enq._id);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  const unread = enquiries.filter(e => !e.isRead).length;

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Enquiries</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {enquiries.length} total{unread > 0 && <span className="text-gray-900 font-semibold"> · {unread} unread</span>}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Name</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Contact</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Vehicle</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Date</th>
              <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-16 text-center">
                  <Inbox size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">No enquiries yet</p>
                </td>
              </tr>
            ) : enquiries.map(enq => (
              <React.Fragment key={enq._id}>
                <tr
                  onClick={() => toggleOpen(enq)}
                  className={`hover:bg-gray-50/60 transition-colors cursor-pointer ${!enq.isRead ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {!enq.isRead && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{enq.name}</p>
                        {enq.location && <p className="text-xs text-gray-400">{enq.location}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{enq.phone}</p>
                    <p className="text-xs text-gray-400">{enq.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-800">{enq.carTitle || '—'}</p>
                    {enq.stockId && <p className="text-xs text-gray-400">Stock {enq.stockId}</p>}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{fmtDate(enq.createdAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleOpen(enq); }}
                        className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
                        {openId === enq._id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteEnquiry(enq._id); }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded detail row */}
                {openId === enq._id && (
                  <tr className="bg-gray-50/40">
                    <td colSpan="5" className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {enq.message && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Message</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{enq.message}</p>
                          </div>
                        )}
                        {enq.remarks && (
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Remarks</p>
                            <p className="text-sm text-gray-700 whitespace-pre-line">{enq.remarks}</p>
                          </div>
                        )}
                        {!enq.message && !enq.remarks && (
                          <p className="text-sm text-gray-400">No message or remarks provided.</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                        <a href={`mailto:${enq.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 transition">
                          <Mail size={13} /> Reply by email
                        </a>
                        {!enq.isRead && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markRead(enq._id); }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700 transition">
                            <Check size={13} /> Mark as read
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageEnquiries;