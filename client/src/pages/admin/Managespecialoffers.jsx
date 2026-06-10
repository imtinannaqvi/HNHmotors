import React, { useEffect, useState } from 'react';
import axios from '../../api/axios.js';
import { Tag, Car, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

const ManageSpecialOffers = () => {
  const [cars,    setCars]    = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token   = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get('/cars')
      .then(({ data }) => setCars(data.cars || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggleOffer = async (car) => {
    try {
      const formData = new FormData();
      formData.append('isSpecialOffer', !car.isSpecialOffer);
      await axios.put(`/cars/${car._id}`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
      setCars(prev => prev.map(c => c._id === car._id ? { ...c, isSpecialOffer: !c.isSpecialOffer } : c));
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  const specialCars = cars.filter(c => c.isSpecialOffer);
  const regularCars = cars.filter(c => !c.isSpecialOffer);

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Special Offers</h1>
        <p className="text-sm text-gray-400 mt-0.5">{specialCars.length} active deals</p>
      </div>

      {/* Active offers */}
      {specialCars.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Active offers</h2>
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            {specialCars.map((car, i) => (
              <div key={car._id} className={`flex items-center gap-4 px-5 py-4 ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                  {car.thumbnail
                    ? <img src={`${API_BASE}/${car.thumbnail}`} alt={car.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Car size={16} className="text-gray-300" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{car.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-gray-900">£{car.price?.toLocaleString()}</span>
                    {car.discountedPrice && (
                      <>
                        <span className="text-xs text-gray-400 line-through">£{car.discountedPrice?.toLocaleString()}</span>
                        <span className="text-[10px] font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                          -{Math.round((1 - car.discountedPrice / car.price) * 100)}%
                        </span>
                      </>
                    )}
                    {car.offerLabel && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{car.offerLabel}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate(`/admin/edit-car/${car._id}`)}
                    className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => toggleOffer(car)}
                    className="text-xs font-semibold px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition">
                    Remove offer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular cars — add as offer */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Add to special offers</h2>
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {regularCars.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-10">All cars are already on special offer</p>
          ) : regularCars.map((car, i) => (
            <div key={car._id} className={`flex items-center gap-4 px-5 py-4 ${i !== 0 ? 'border-t border-gray-50' : ''}`}>
              <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                {car.thumbnail
                  ? <img src={`${API_BASE}/${car.thumbnail}`} alt={car.title} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center"><Car size={16} className="text-gray-300" /></div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{car.title}</p>
                <p className="text-xs text-gray-400">{car.brand} · {car.year} · £{car.price?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => navigate(`/admin/edit-car/${car._id}`)}
                  className="text-xs font-semibold px-3 py-1.5 bg-gray-900 text-white hover:bg-black rounded-lg transition flex items-center gap-1.5">
                  <Tag size={12} /> Add offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageSpecialOffers;