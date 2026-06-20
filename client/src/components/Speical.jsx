import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const API_BASE = '';

const getDetail = (car, key) => {
  if (!car.details || typeof car.details !== 'object') return '';
  const e = Object.entries(car.details).find(([k]) => k.toLowerCase() === key.toLowerCase());
  return e ? String(e[1]) : '';
};

const fmt = (n) => (typeof n === 'number' ? n.toLocaleString() : n ?? '');

const Special = () => {
  const [cars, setCars]       = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    api.get('/cars/special')
      .then(({ data }) => {
        // console.log('SPECIAL DATA:', data);
        setCars(Array.isArray(data) ? data : (data.cars || []));
      })
      .catch(err => console.error('SPECIAL ERROR:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
if (cars.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">

        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-gray-900  tracking-tight">Special Offers</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-0.5 w-12 bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="h-0.5 w-12 bg-orange-500" />
          </div>
          <p className="text-sm text-gray-400 mt-3">
            {loading }
          </p>
        </div>

        {/* Cards */}
        <div className={`grid gap-5 ${
          cars.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
          cars.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
          cars.length === 3 ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {cars.map((car, i) => {
            const price      = Number(car.price) || 0;
            const discounted = Number(car.discountedPrice) || 0;
            const hasDiscount = discounted > 0 && discounted < price;
            const discountPct = hasDiscount ? Math.round((1 - discounted / price) * 100) : null;
            const brand = getDetail(car, 'brand');
            const year  = getDetail(car, 'year');

            return (
              <div key={car._id}
                onClick={() => navigate(`/car/${car._id}`)}
                className="bg-white border border-gray-100 rounded-md overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1">

                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {car.thumbnail ? (
                    <img src={`${API_BASE}/${car.thumbnail}`} alt={car.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">🚗</div>
                  )}
                  {discountPct > 0 && discountPct <= 90 && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discountPct}%</div>
                  )}
                  {car.offerLabel && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-[10px] font-semibold px-2 py-1 rounded-lg">{car.offerLabel}</div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-sm font-bold text-gray-900 truncate mb-1">{car.title}</p>
                  {(brand || year) && (
                    <p className="text-xs text-gray-400 mb-3">{[brand, year].filter(Boolean).join(' · ')}</p>
                  )}
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {hasDiscount ? (
                      <>
                        <span className="text-lg font-black text-gray-900">£{fmt(discounted)}</span>
                        <span className="text-sm text-gray-400 line-through">£{fmt(price)}</span>
                      </>
                    ) : (
                      <span className="text-lg font-black text-gray-900">£{fmt(price)}</span>
                    )}
                  </div>
                  <button className="mt-3 w-full py-2.5 bg-orange-500 hover:bg-orange-400 text-white text-xs font-bold rounded-md transition-colors duration-200">
                    View details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Special;