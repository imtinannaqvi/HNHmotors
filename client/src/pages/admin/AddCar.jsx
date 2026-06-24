import { useState } from 'react';
import api from "../../api/axios.js";
import { Upload, CheckCircle, Plus, X, Tag, ImageIcon, ListPlus, Sparkles, Search } from 'lucide-react';

const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition font-medium bg-white';
const labelCls = 'block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-2';

const Section = ({ icon: Icon, title, hint, children }) => (
  <section className="bg-white border border-slate-200/70 rounded-2xl shadow-sm shadow-slate-100 p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-slate-700 flex items-center justify-center flex-shrink-0">
        <Icon size={16} className="text-white" />
      </div>
      <div>
        <h2 className="text-sm font-medium text-slate-800 leading-tight">{title}</h2>
        {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
      </div>
    </div>
    {children}
  </section>
);

const AddCar = () => {
  const [formData, setFormData] = useState({ title: '', price: '' });

  const [details,    setDetails]    = useState([]);
  const [labelInput, setLabelInput] = useState('');
  const [valueInput, setValueInput] = useState('');

  const [images,   setImages]   = useState([]);
  const [previews, setPreviews] = useState([]);

  // Brand logo
  const [brandLogo,        setBrandLogo]        = useState(null);  // File
  const [brandLogoPreview, setBrandLogoPreview] = useState('');

  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [features,     setFeatures]     = useState([]);
  const [featureInput, setFeatureInput] = useState('');

  const [isSpecialOffer,  setIsSpecialOffer]  = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [offerLabel,      setOfferLabel]      = useState('');

  // SEO
  const [seoTitle,       setSeoTitle]       = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Does the details list contain a Brand row?
  const brandDetail = details.find(d => d.label.toLowerCase() === 'brand');

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    e.target.value = '';
  };
  const removeImage = (i) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setPreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const handleBrandLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBrandLogo(file);
    setBrandLogoPreview(URL.createObjectURL(file));
    e.target.value = '';
  };
  const removeBrandLogo = () => {
    setBrandLogo(null);
    setBrandLogoPreview('');
  };

  const addFeature = () => {
    const val = featureInput.trim();
    if (val && !features.includes(val)) {
      setFeatures(prev => [...prev, val]);
      setFeatureInput('');
    }
  };
  const removeFeature = (f) => setFeatures(prev => prev.filter(x => x !== f));

  const addDetail = () => {
    const label = labelInput.trim();
    const value = valueInput.trim();
    if (label && value) {
      setDetails(prev => [...prev, { label, value }]);
      setLabelInput('');
      setValueInput('');
    }
  };
  const removeDetail = (i) => {
    // If removing the Brand row, also clear the logo
    if (details[i]?.label.toLowerCase() === 'brand') removeBrandLogo();
    setDetails(prev => prev.filter((_, idx) => idx !== i));
  };

  const discountPct = formData.price && discountedPrice
    ? Math.round((1 - discountedPrice / formData.price) * 100)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    if (details.length) {
      const detailsObj = details.reduce((acc, d) => ({ ...acc, [d.label]: d.value }), {});
      data.append('details', JSON.stringify(detailsObj));
    }
    if (features.length) data.append('features', JSON.stringify(features));
    images.forEach(img => data.append('images', img));
    if (brandLogo) data.append('brandLogo', brandLogo);
    data.append('isSpecialOffer', isSpecialOffer);
    if (isSpecialOffer && discountedPrice) data.append('discountedPrice', discountedPrice);
    if (isSpecialOffer && offerLabel)      data.append('offerLabel',      offerLabel);

    // SEO — always sent (controller auto-generates a fallback if left blank)
    data.append('seoTitle',       seoTitle);
    data.append('seoDescription', seoDescription);

    try {
      await api.post('/cars', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({ title: '', price: '' });
      setImages([]); setPreviews([]);
      setDetails([]); setLabelInput(''); setValueInput('');
      setFeatures([]); setFeatureInput('');
      setBrandLogo(null); setBrandLogoPreview('');
      setIsSpecialOffer(false); setDiscountedPrice(''); setOfferLabel('');
      setSeoTitle(''); setSeoDescription('');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-medium text-slate-800 tracking-tight">Add New Vehicle</h1>
            <p className="text-sm text-slate-400 mt-1">Add a listing with your own custom details</p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
            <Sparkles size={13} /> Draft
          </span>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
            <CheckCircle size={15} /> Car published successfully!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT column: images ── */}
            <div className="space-y-6">
              <Section icon={ImageIcon} title="Photos" hint="First image is the main one">
                {previews.length > 0 ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-slate-200">
                      <img src={previews[0]} alt="main" className="w-full h-52 object-cover" />
                      <span className="absolute top-2 left-2 bg-slate-800/90 text-white text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded">
                        Main
                      </span>
                      <button type="button" onClick={() => removeImage(0)}
                        className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-md transition">
                        <X size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {previews.slice(1).map((src, i) => (
                        <div key={i + 1} className="relative h-16 rounded-lg overflow-hidden border border-slate-200">
                          <img src={src} alt={`thumb-${i + 1}`} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(i + 1)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded transition">
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                      <label htmlFor="imgUpload"
                        className="h-16 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-md cursor-pointer hover:border-slate-400 text-slate-300 transition">
                        <Plus size={18} />
                      </label>
                    </div>
                    <p className="text-xs text-slate-400">{previews.length} image{previews.length > 1 ? 's' : ''} selected</p>
                  </div>
                ) : (
                  <label htmlFor="imgUpload"
                    className="block border-2 border-dashed border-slate-200 rounded-md cursor-pointer hover:border-slate-400 transition">
                    <div className="flex flex-col items-center gap-2 py-12 text-slate-300">
                      <Upload size={26} />
                      <p className="text-sm font-medium text-slate-400">Click to upload images</p>
                      <p className="text-xs text-slate-300">First image becomes the main photo</p>
                    </div>
                  </label>
                )}
                <input id="imgUpload" type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
              </Section>
            </div>

            {/* ── RIGHT column: all the inputs ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basics */}
              <Section icon={ListPlus} title="Basics" hint="Required information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelCls}>Listing Title *</label>
                    <input name="title" value={formData.title} onChange={handleChange} required
                      placeholder="e.g. 2022 BMW X5 xDrive40i" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Price (£) *</label>
                    <input name="price" type="number" value={formData.price} onChange={handleChange} required
                      placeholder="e.g. 35000" className={inputCls} />
                  </div>
                </div>
              </Section>

              {/* Custom details */}
              <Section icon={ListPlus} title="Vehicle details" hint="Add your own label / value pairs">
                <div className="flex flex-col sm:flex-row gap-2 mb-4">
                  <input value={labelInput} onChange={e => setLabelInput(e.target.value)}
                    placeholder="Label (e.g. Year)"
                    className={`${inputCls} sm:max-w-[200px]`} />
                  <input value={valueInput} onChange={e => setValueInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addDetail())}
                    placeholder="Value (e.g. 2022)"
                    className={inputCls} />
                  <button type="button" onClick={addDetail} disabled={!labelInput.trim() || !valueInput.trim()}
                    className="flex items-center justify-center gap-1 px-5 py-2.5 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-md transition flex-shrink-0 disabled:opacity-40">
                    <Plus size={14} /> Add
                  </button>
                </div>

                {details.length > 0 ? (
                  <div className="space-y-2">
                    {details.map((d, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
                        <span className="w-32 flex-shrink-0 text-xs font-medium uppercase tracking-wide text-slate-400">{d.label}</span>
                        <span className="flex-1 text-sm font-medium text-slate-700 truncate">{d.value}</span>
                        <button type="button" onClick={() => removeDetail(i)}
                          className="flex-shrink-0 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-400">Type a label and value, then click Add</p>
                  </div>
                )}

                {/* Brand logo upload — appears once a Brand detail exists */}
                {brandDetail && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <label className={labelCls}>Brand logo for "{brandDetail.value}"</label>
                    <div className="flex items-center gap-3">
                      {brandLogoPreview ? (
                        <div className="relative">
                          <img src={brandLogoPreview} alt="Brand logo"
                            className="h-12 w-12 object-contain border border-slate-200 rounded-xl p-1 bg-white" />
                          <button type="button" onClick={removeBrandLogo}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition">
                            <X size={11} />
                          </button>
                        </div>
                      ) : (
                        <div className="h-12 w-12 border border-dashed border-slate-300 rounded-md flex items-center justify-center bg-slate-50 text-slate-300 text-[9px]">
                          Logo
                        </div>
                      )}
                      <label htmlFor="brandLogoUpload"
                        className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition">
                        <Upload size={14} /> {brandLogoPreview ? 'Change logo' : 'Upload logo'}
                      </label>
                      <input id="brandLogoUpload" type="file" accept="image/*" className="hidden" onChange={handleBrandLogo} />
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5">Shown next to the brand name on the site (PNG with transparent background works best)</p>
                  </div>
                )}
              </Section>

              {/* Features */}
              <Section icon={CheckCircle} title="Features" hint="Short keywords">
                <div className="flex gap-2 mb-3">
                  <input value={featureInput} onChange={e => setFeatureInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    maxLength={30}
                    placeholder="e.g. Sunroof"
                    className={`${inputCls} max-w-[240px]`} />
                  <button type="button" onClick={addFeature}
                    className="flex items-center gap-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium rounded-md transition flex-shrink-0">
                    <Plus size={14} /> Add
                  </button>
                </div>
                {features.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {features.map(f => (
                      <span key={f} className="flex items-center gap-1.5 bg-slate-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg">
                        {f}
                        <button type="button" onClick={() => removeFeature(f)} className="hover:text-slate-300 transition">
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">Type a keyword and press Enter or click Add</p>
                )}
              </Section>

              {/* Special offer */}
              <Section icon={Tag} title="Special offer" hint="Optional discount">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Enable a sale price for this listing</p>
                  <button type="button" onClick={() => setIsSpecialOffer(p => !p)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${isSpecialOffer ? 'bg-slate-700' : 'bg-slate-200'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isSpecialOffer ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {isSpecialOffer && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100">
                    <div>
                      <label className={labelCls}>Sale price (£)</label>
                      <input type="number" value={discountedPrice} onChange={e => setDiscountedPrice(e.target.value)}
                        placeholder={`e.g. ${formData.price ? Math.round(formData.price * 0.9) : '28000'}`} className={inputCls} />
                      {discountPct > 0 && (
                        <p className="text-xs text-green-600 font-medium mt-1.5">{discountPct}% off the original price</p>
                      )}
                    </div>
                    <div>
                      <label className={labelCls}>Offer label</label>
                      <input type="text" value={offerLabel} onChange={e => setOfferLabel(e.target.value)}
                        placeholder="e.g. Summer Sale" className={inputCls} />
                    </div>
                  </div>
                )}
              </Section>

              {/* SEO */}
              <Section icon={Search} title="SEO" hint="Optional — leave blank to auto-generate from the title">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`${labelCls} mb-0`}>Meta Title</label>
                      <span className={`text-[11px] font-medium ${seoTitle.length > 60 ? 'text-amber-500' : 'text-slate-300'}`}>
                        {seoTitle.length}/60
                      </span>
                    </div>
                    <input
                      value={seoTitle}
                      onChange={e => setSeoTitle(e.target.value)}
                      maxLength={70}
                      placeholder="Add Title"
                      className={inputCls}
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Shown as the clickable headline in search results. Aim for under 60 characters.</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className={`${labelCls} mb-0`}>Meta Description</label>
                      <span className={`text-[11px] font-medium ${seoDescription.length > 160 ? 'text-amber-500' : 'text-slate-300'}`}>
                        {seoDescription.length}/160
                      </span>
                    </div>
                    <textarea
                      value={seoDescription}
                      onChange={e => setSeoDescription(e.target.value)}
                      maxLength={200}
                      rows={3}
                      placeholder="Add Description"
                      className={`${inputCls} resize-none`}
                    />
                    <p className="text-xs text-slate-400 mt-1.5">The summary under the title in search results. Aim for under 160 characters.</p>
                  </div>
                </div>
              </Section>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {details.length > 0 && (
                  <span className="text-xs text-slate-400 font-medium">
                    {details.length} detail{details.length > 1 ? 's' : ''} added
                  </span>
                )}
                <button type="submit" disabled={loading}
                  className="flex items-center gap-2 px-7 py-3 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium rounded-md transition disabled:opacity-50 shadow-sm">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</>
                  ) : 'Publish Listing'}
                </button>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCar;