import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { Calendar, Fuel, Settings2, ArrowRight, Tag } from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const getDetail = (car, key) => {
  if (!car.details || typeof car.details !== 'object') return '';
  const e = Object.entries(car.details).find(([k]) => k.toLowerCase() === key.toLowerCase());
  return e ? String(e[1]) : '';
};

const CarTabs = () => {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState('used'); // 'used' | 'new'
  const navigate              = useNavigate();

  useEffect(() => {
    api.get('/cars', { params: { limit: 100 } })
      .then(({ data }) => setCars(data.cars || []))
      .catch(err => console.error('CARTABS ERROR:', err))
      .finally(() => setLoading(false));
  }, []);

  const usedCars = useMemo(
    () => cars.filter(c => getDetail(c, 'condition').toLowerCase() === 'used'),
    [cars]
  );
  const newCars = useMemo(
    () => cars.filter(c => getDetail(c, 'condition').toLowerCase() === 'new'),
    [cars]
  );

  const activeCars = (tab === 'used' ? usedCars : newCars).slice(0, 6);

  if (loading) return null;
  if (usedCars.length === 0 && newCars.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900 italic tracking-tight">Browse Our Vehicles</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-0.5 w-12 bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="h-0.5 w-12 bg-orange-500" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setTab('used')}
              className={`px-8 py-2.5 text-sm font-bold  tracking-wide cursor-pointer rounded-xl transition-all duration-300 ${
                tab === 'used' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:text-gray-900'
              }`}>
              Used Cars 
            </button>
            <button
              onClick={() => setTab('new')}
              className={`px-8 py-2.5 text-sm font-bold  tracking-wide cursor-pointer rounded-xl transition-all duration-300 ${
                tab === 'new' ? 'bg-orange-500 text-white shadow' : 'text-gray-600 hover:text-gray-900'
              }`}>
              New Cars 
            </button>
          </div>
        </div>

        {/* Horizontal cards — 2 per row */}
        {activeCars.length > 0 ? (
          <div key={tab} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeCars.map((car, i) => {
              const brand        = getDetail(car, 'brand');
              const year         = getDetail(car, 'year');
              const fuelType     = getDetail(car, 'fuelType', 'fuel', 'fueltype', 'fuletype');
              const transmission = getDetail(car, 'transmission');
              const hasDiscount  = car.isSpecialOffer && car.discountedPrice && car.discountedPrice < car.price;

              return (
                <div key={car._id}
                  onClick={() => navigate(`/car/${car._id}`)}
                  className="animate-fade-up group flex bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'backwards' }}>

                  {/* Image — left */}
                  <div className="relative w-44 sm:w-52 flex-shrink-0 overflow-hidden bg-gray-100">
                    {car.thumbnail ? (
                      <img src={`${API_BASE}/${car.thumbnail}`} alt={car.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200 text-3xl">🚗</div>
                    )}
                    {car.isSpecialOffer && (
                      <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Tag size={8} /> Offer
                      </span>
                    )}
                  </div>

                  {/* Info — right */}
                  <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                    <div>
                      {brand && (
                        <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-0.5">{brand}</p>
                      )}
                      <h3 className="text-base font-bold text-gray-900 truncate">{car.title}</h3>

                      {/* Specs */}
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mt-2">
                        {year         && <span className="flex items-center gap-1"><Calendar size={11} /> {year}</span>}
                        {fuelType     && <span className="flex items-center gap-1"><Fuel size={11} /> {fuelType}</span>}
                        {transmission && <span className="flex items-center gap-1"><Settings2 size={11} /> {transmission}</span>}
                      </div>
                    </div>

                    {/* Price + arrow */}
                    <div className="flex items-end justify-between mt-3">
                      <div>
                        {hasDiscount ? (
                          <div className="flex items-baseline gap-1.5">
                            <p className="text-lg font-black text-gray-900">£{car.discountedPrice.toLocaleString()}</p>
                            <p className="text-xs text-gray-400 line-through">£{car.price?.toLocaleString()}</p>
                          </div>
                        ) : (
                          <p className="text-lg font-black text-gray-900">£{car.price?.toLocaleString()}</p>
                        )}
                      </div>
                      <span className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-orange-500 text-gray-500 group-hover:text-white flex items-center justify-center transition-all duration-300 flex-shrink-0">
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-12">
            No {tab} cars available right now — check back soon.
          </p>
        )}

        
      </div>
    </section>
  );
};

export default CarTabs;