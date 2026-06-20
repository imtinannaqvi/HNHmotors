import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';
import { ArrowLeft, Car, ChevronLeft, ChevronRight, Phone, Mail, CheckCircle, X } from 'lucide-react';
const API_BASE = '';

const CarDetails = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [car, setCar]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [related, setRelated]     = useState([]);

  const [query, setQuery]     = useState({ name: '', email: '', phone: '', location: '', message: '', remarks: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    setActiveImg(0);
    setLoading(true);
    axios.get(`/cars/${id}`)
      .then(({ data }) => {
        setCar(data);
        return axios.get('/cars', { params: { limit: 10 } });
      })
      .then(({ data }) => setRelated((data.cars || []).filter(c => c._id !== id)))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  if (!car) return null;

  const stockId = car._id ? car._id.slice(-6).toUpperCase() : '—';
  const images  = car.images?.length ? car.images : car.thumbnail ? [car.thumbnail] : [];

  const detailEntries = car.details && typeof car.details === 'object'
    ? Object.entries(car.details).filter(([, v]) => v !== '' && v != null)
    : [];

  const description = car.details?.Description || car.details?.description || car.description || '';
  const tableEntries = detailEntries.filter(([label]) => label.toLowerCase() !== 'description');

  const prev = () => setActiveImg(i => (i - 1 + images.length) % images.length);
  const next = () => setActiveImg(i => (i + 1) % images.length);

  const handleQueryChange = (e) => setQuery(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const submitQuery = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post('/enquiries', { ...query, carId: car._id, carTitle: car.title, stockId });
      setSent(true);
      setQuery({ name: '', email: '', phone: '', location: '', message: '', remarks: '' });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      alert('Error sending enquiry: ' + (err.response?.data?.message || err.message));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

      {/* Back */}
      <button onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 mb-5 transition-colors duration-200">
        <ArrowLeft size={16} /> Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

        {/* ── LEFT: Gallery + description + similar ── */}
        <div>
          <div className="relative w-full h-56 sm:h-80 lg:h-[420px] rounded-2xl overflow-hidden bg-gray-900">
            {images.length > 0 ? (
              <img key={activeImg}
                src={`${API_BASE}/${images[activeImg]}`}
                alt={car.title}
                onClick={() => setLightbox(true)}
                className="w-full h-full object-cover cursor-zoom-in"
                style={{ animation: 'fadeIn 0.4s ease' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Car size={64} />
              </div>
            )}

            <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg">
              {car.status || 'available'}
            </span>

            {images.length > 1 && (
              <>
                <button onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-orange-500 text-white transition-all duration-300">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-black/30 hover:bg-orange-500 text-white transition-all duration-300">
                  <ChevronRight size={20} />
                </button>
                <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded">
                  {activeImg + 1}/{images.length}
                </span>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mt-2">
              {images.slice(0, 10).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`h-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === activeImg ? 'border-orange-500' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}>
                  <img src={`${API_BASE}/${img}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {description && (
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 mt-4">
              <h2 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Description</h2>
              <div className="w-8 h-0.5 bg-orange-500 mb-3" />
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{description}</p>
            </div>
          )}

          {/* ── Similar vehicles ── */}
          {related.length > 0 && (
            <div className="mt-6">
              <h2 className="text-md font-black text-gray-900 mb-1 tracking-wide">Similar Vehicles</h2>
              <div className="w-8 h-0.5 bg-orange-500 mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3 sm:gap-4">
                {related.slice(0, 4).map(c => (
                  <button key={c._id} onClick={() => navigate(`/car/${c._id}`)}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 text-left group">
                    <div className="h-28 sm:h-32 bg-gray-100 overflow-hidden">
                      {c.thumbnail ? (
                        <img src={`${API_BASE}/${c.thumbnail}`} alt={c.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                          <Car size={28} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                      <p className="text-sm font-black text-gray-900 mt-1">£{c.price?.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Details ── */}
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">{car.title}</h1>

          {/* Price row */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 border-b border-gray-200 pb-3 mb-0">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-wide">
              Price <span className="text-gray-400 font-medium normal-case">— (£)</span>
            </span>
            {car.isSpecialOffer && car.discountedPrice ? (
              <span className="text-lg sm:text-xl font-black text-gray-900">
                £{car.discountedPrice?.toLocaleString()}
                <span className="text-sm text-gray-400 line-through ml-2 font-medium">£{car.price?.toLocaleString()}</span>
              </span>
            ) : (
              <span className="text-lg sm:text-xl font-black text-gray-900">£{car.price?.toLocaleString() || '0'}</span>
            )}
          </div>

          {/* Details table — scrolls horizontally if cramped on tiny screens */}
          <div className="border border-gray-200 border-t-0 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[320px]">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 sm:px-4 py-2.5 text-gray-500 bg-gray-50 w-[22%]">Stock Id</td>
                  <td className="px-3 sm:px-4 py-2.5 text-gray-900 font-semibold w-[28%]">{stockId}</td>
                  {tableEntries[0] ? (
                    <>
                      <td className="px-3 sm:px-4 py-2.5 text-gray-500 bg-gray-50 w-[22%] capitalize">{tableEntries[0][0]}</td>
                      <td className="px-3 sm:px-4 py-2.5 text-gray-900 font-semibold w-[28%]">{String(tableEntries[0][1])}</td>
                    </>
                  ) : <><td className="bg-gray-50" /><td /></>}
                </tr>

                {Array.from({ length: Math.ceil((tableEntries.length - 1) / 2) }).map((_, rowIdx) => {
                  const left  = tableEntries[1 + rowIdx * 2];
                  const right = tableEntries[1 + rowIdx * 2 + 1];
                  return (
                    <tr key={rowIdx} className="border-b border-gray-200">
                      {left ? (
                        <>
                          <td className="px-3 sm:px-4 py-2.5 text-gray-500 bg-gray-50 capitalize">{left[0]}</td>
                          <td className="px-3 sm:px-4 py-2.5 text-gray-900 font-semibold">{String(left[1])}</td>
                        </>
                      ) : <><td className="bg-gray-50" /><td /></>}
                      {right ? (
                        <>
                          <td className="px-3 sm:px-4 py-2.5 text-gray-500 bg-gray-50 capitalize">{right[0]}</td>
                          <td className="px-3 sm:px-4 py-2.5 text-gray-900 font-semibold">{String(right[1])}</td>
                        </>
                      ) : <><td className="bg-gray-50" /><td /></>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Features */}
          {car.features?.length > 0 && (
            <div className="mt-5">
              <h2 className="text-center text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide bg-gray-50 border border-gray-200 py-2.5">
                Features
              </h2>
              <div className="border border-gray-200 border-t-0">
                <table className="w-full text-xs sm:text-sm">
                  <tbody>
                    {Array.from({ length: Math.ceil(car.features.length / 2) }).map((_, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-gray-200 last:border-b-0">
                        {[0, 1].map(col => {
                          const f = car.features[rowIdx * 2 + col];
                          return <td key={col} className="px-3 sm:px-4 py-2.5 text-gray-700 w-1/2">{f || ''}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          {car.status !== 'sold' ? (
            <div className="flex justify-center mt-5">
              <a href={`https://wa.me/?text=Hi, I'm interested in the ${car.title} (Stock ID ${stockId})`}
                target="_blank" rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.558 4.116 1.535 5.847L.057 23.485a.75.75 0 00.921.921l5.638-1.478A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.711 9.711 0 01-4.953-1.355l-.355-.211-3.684.965.981-3.585-.231-.369A9.712 9.712 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          ) : (
            <div className="flex justify-center mt-5">
              <div className="inline-block text-center bg-gray-100 text-gray-400 font-semibold px-5 py-2.5 rounded-xl text-xs uppercase">
                This car has been sold
              </div>
            </div>
          )}

          {/* Enquiry form */}
          <div className="mt-8 pt-5 border-t border-gray-200">
            <h3 className="text-base font-black text-center text-gray-900 uppercase tracking-wide mb-1">Send an enquiry</h3>
            <p className="text-sm text-gray-400 text-center mb-4">We'll get back to you about this vehicle</p>

            {sent ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-3 py-2.5 rounded-xl text-sm font-medium animate-fade-up">
                <CheckCircle size={15} /> Thanks! Your enquiry has been sent.
              </div>
            ) : (
              <form onSubmit={submitQuery} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input name="name" value={query.name} onChange={handleQueryChange} required placeholder="Your name"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                  <input name="phone" value={query.phone} onChange={handleQueryChange} required placeholder="Your phone"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                  <input name="location" value={query.location} onChange={handleQueryChange} placeholder="Your location"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                  <input name="email" type="email" value={query.email} onChange={handleQueryChange} required placeholder="Your email"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                </div>
                <textarea name="message" value={query.message} onChange={handleQueryChange} rows={3}
                  placeholder={`I'm interested in the ${car.title}...`}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none" />
                <textarea name="remarks" value={query.remarks} onChange={handleQueryChange} rows={2}
                  placeholder="Any remarks (optional)"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none" />
                <div className="flex justify-center">
                  <button type="submit" disabled={sending}
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50">
                    {sending ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : 'Send enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mt-6">
            <a href="tel:+447000000000" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors duration-200">
              <Phone size={13} /> +44 7000 000000
            </a>
            <a href="mailto:info@hnhmotors.com" className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors duration-200">
              <Mail size={13} /> info@hnhmotors.com
            </a>
          </div>
        </div>
      </div>

      {/* ── Fullscreen image lightbox ── */}
      {lightbox && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          style={{ animation: 'fadeIn 0.25s ease' }}
          onClick={() => setLightbox(false)}>

          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 left-4 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-orange-500 text-white transition-all duration-300 z-10"
            aria-label="Close">
            <X size={22} />
          </button>

          {images.length > 1 && (
            <span className="absolute top-5 right-5 text-white/80 text-sm font-semibold">
              {activeImg + 1} / {images.length}
            </span>
          )}

          <img
            src={`${API_BASE}/${images[activeImg]}`}
            alt={car.title}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[92vw] max-h-[88vh] object-contain select-none"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-orange-500 text-white transition-all duration-300">
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-orange-500 text-white transition-all duration-300">
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
    </div>
  );
};

export default CarDetails;