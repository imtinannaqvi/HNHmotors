import React, { useEffect, useState, useRef } from 'react';
import axios from '../../api/axios.js';
import { Plus, Trash2, Save, Upload, X, Check } from 'lucide-react';

const emptyForm = {
  navbar: { location: '', phoneNumber: '', navLinks: [] },
  footer: { logo: '', description: '', email: '', whatsappNumber: '', quickLinks: [] },
  socialLinks: { facebook: '', instagram: '', twitter: '', linkedin: '' },
};

const AdminSettings = () => {
  const [form, setForm] = useState(emptyForm);
  const [logoFile,    setLogoFile]    = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null);  // { type, message }
  const fileInputRef = useRef();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // Load current settings so you can see and edit what's already saved
  useEffect(() => {
    axios.get('/settings')
      .then(({ data }) => {
        setForm({
          navbar: {
            location:    data.navbar?.location    || '',
            phoneNumber: data.navbar?.phoneNumber || '',
            navLinks:    data.navbar?.navLinks    || [],
          },
          footer: {
            logo:           data.footer?.logo           || data.navbar?.logo || '',
            description:    data.footer?.description    || '',
            email:          data.footer?.email          || '',
            whatsappNumber: data.footer?.whatsappNumber || '',
            quickLinks:     data.footer?.quickLinks     || [],
          },
          socialLinks: {
            facebook:  data.socialLinks?.facebook  || '',
            instagram: data.socialLinks?.instagram || '',
            twitter:   data.socialLinks?.twitter   || '',
            linkedin:  data.socialLinks?.linkedin  || '',
          },
        });
        const logo = data.footer?.logo || data.navbar?.logo;
        if (logo) setLogoPreview(`http://localhost:5000/${logo}`);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setForm(f => ({ ...f, footer: { ...f.footer, logo: '' } }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('data', JSON.stringify(form));
      if (logoFile) formData.append('logo', logoFile);

      const { data } = await axios.put('/settings', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      showToast('success', 'Settings saved!');

      // Refresh form with what the server returned, so it stays in sync
      const updated = data.settings || data;
      if (updated) {
        setForm({
          navbar: {
            location:    updated.navbar?.location    || '',
            phoneNumber: updated.navbar?.phoneNumber || '',
            navLinks:    updated.navbar?.navLinks    || [],
          },
          footer: {
            logo:           updated.footer?.logo           || '',
            description:    updated.footer?.description    || '',
            email:          updated.footer?.email          || '',
            whatsappNumber: updated.footer?.whatsappNumber || '',
            quickLinks:     updated.footer?.quickLinks     || [],
          },
          socialLinks: {
            facebook:  updated.socialLinks?.facebook  || '',
            instagram: updated.socialLinks?.instagram || '',
            twitter:   updated.socialLinks?.twitter   || '',
            linkedin:  updated.socialLinks?.linkedin  || '',
          },
        });
        const logo = updated.footer?.logo || updated.navbar?.logo;
        if (logo) setLogoPreview(`http://localhost:5000/${logo}`);
      }
      setLogoFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      showToast('error', err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Helpers ──
  const setNavbar  = (key, val) => setForm(f => ({ ...f, navbar:      { ...f.navbar,      [key]: val } }));
  const setFooter  = (key, val) => setForm(f => ({ ...f, footer:      { ...f.footer,      [key]: val } }));
  const setSocials = (key, val) => setForm(f => ({ ...f, socialLinks: { ...f.socialLinks, [key]: val } }));

  const addNavLink    = ()           => setForm(f => ({ ...f, navbar: { ...f.navbar, navLinks: [...f.navbar.navLinks, { title: '' }] } }));
  const removeNavLink = (idx)        => setForm(f => ({ ...f, navbar: { ...f.navbar, navLinks: f.navbar.navLinks.filter((_, i) => i !== idx) } }));
  const updateNavLink = (idx, val)   => setForm(f => {
    const arr = [...f.navbar.navLinks]; arr[idx] = { ...arr[idx], title: val };
    return { ...f, navbar: { ...f.navbar, navLinks: arr } };
  });

  const addQuickLink    = ()           => setForm(f => ({ ...f, footer: { ...f.footer, quickLinks: [...f.footer.quickLinks, { title: '' }] } }));
  const removeQuickLink = (idx)        => setForm(f => ({ ...f, footer: { ...f.footer, quickLinks: f.footer.quickLinks.filter((_, i) => i !== idx) } }));
  const updateQuickLink = (idx, val)   => setForm(f => {
    const arr = [...f.footer.quickLinks]; arr[idx] = { ...arr[idx], title: val };
    return { ...f, footer: { ...f.footer, quickLinks: arr } };
  });

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  const inputCls   = "w-full p-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-gray-400";
  const labelCls   = "block text-xs font-semibold text-gray-500 mb-1";
  const sectionCls = "bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-4";

  return (
    <div className="max-w-3xl mx-auto">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold animate-fade-up ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Site Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">Edit your navbar, footer and social links</p>
        </div>
        <button onClick={handleSubmit} disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition disabled:opacity-50">
          <Save size={15} /> {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {/* ── Brand (logo) ── */}
      <div className={sectionCls}>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Brand Logo</h2>
        <div className="flex items-center gap-4">
          {logoPreview ? (
            <div className="relative">
              <img src={logoPreview} alt="Logo preview"
                className="h-14 w-auto object-contain border border-gray-200 rounded-xl p-1 bg-gray-50" />
              <button onClick={removeLogo}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition">
                <X size={11} />
              </button>
            </div>
          ) : (
            <div className="h-14 w-24 border border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 text-gray-400 text-xs">
              No logo
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleLogoChange}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload"
              className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 cursor-pointer transition">
              <Upload size={14} /> Upload logo
            </label>
            <p className="text-xs text-gray-400 mt-1">Used in both navbar and footer · PNG, JPG, WEBP — max 2MB</p>
          </div>
        </div>
      </div>

      {/* ── Navbar ── */}
      <div className={sectionCls}>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Navbar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className={labelCls}>Location</label>
            <input className={inputCls} value={form.navbar.location} onChange={e => setNavbar('location', e.target.value)} placeholder="London, UK" />
          </div>
          <div>
            <label className={labelCls}>Phone number</label>
            <input className={inputCls} value={form.navbar.phoneNumber} onChange={e => setNavbar('phoneNumber', e.target.value)} placeholder="+44 7000 000000" />
          </div>
        </div>

        <label className={labelCls}>Nav links</label>
        {form.navbar.navLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={inputCls} value={link.title} onChange={e => updateNavLink(i, e.target.value)} placeholder="Link title" />
            <button onClick={() => removeNavLink(i)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={15} /></button>
          </div>
        ))}
        <button onClick={addNavLink}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mt-1 transition">
          <Plus size={13} /> Add nav link
        </button>
      </div>

      {/* ── Footer ── */}
      <div className={sectionCls}>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Footer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div className="md:col-span-2">
            <label className={labelCls}>Description</label>
            <textarea className={inputCls} rows={2} value={form.footer.description} onChange={e => setFooter('description', e.target.value)} placeholder="Short description about the company" />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input className={inputCls} value={form.footer.email} onChange={e => setFooter('email', e.target.value)} placeholder="info@hnhmotors.com" />
          </div>
          <div>
            <label className={labelCls}>WhatsApp number</label>
            <input className={inputCls} value={form.footer.whatsappNumber} onChange={e => setFooter('whatsappNumber', e.target.value)} placeholder="447000000000" />
          </div>
        </div>

        <label className={labelCls}>Quick links</label>
        {form.footer.quickLinks.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className={inputCls} value={link.title} onChange={e => updateQuickLink(i, e.target.value)} placeholder="Link title" />
            <button onClick={() => removeQuickLink(i)} className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={15} /></button>
          </div>
        ))}
        <button onClick={addQuickLink}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mt-1 transition">
          <Plus size={13} /> Add quick link
        </button>
      </div>

      {/* ── Social links ── */}
      <div className={sectionCls}>
        <h2 className="text-sm font-bold text-gray-800 mb-4">Social links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['facebook', 'instagram', 'twitter', 'linkedin'].map(platform => (
            <div key={platform}>
              <label className={labelCls} style={{ textTransform: 'capitalize' }}>{platform}</label>
              <input className={inputCls} value={form.socialLinks[platform]} onChange={e => setSocials(platform, e.target.value)} placeholder={`https://${platform}.com/...`} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <button onClick={handleSubmit} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition disabled:opacity-50">
          <Save size={15} /> {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;