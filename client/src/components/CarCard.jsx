import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Fuel, Settings2, Calendar, Tag } from 'lucide-react';

const CarCard = ({ car }) => {
  const navigate = useNavigate();

  if (!car) return null;

  const API_BASE_URL = 'http://localhost:5000';

  const getDetail = (...keys) => {
    if (!car.details || typeof car.details !== 'object') return '';
    for (const key of keys) {
      const entry = Object.entries(car.details).find(([k]) => k.toLowerCase() === key.toLowerCase());
      if (entry && entry[1] !== '' && entry[1] != null) return String(entry[1]);
    }
    return '';
  };

  const condition    = getDetail('condition');
  const brand        = getDetail('brand');
  const category     = getDetail('category');
  const year         = getDetail('year');
  const fuelType     = getDetail('fuelType', 'fuel', 'fueltype', 'fuletype');
  const transmission = getDetail('transmission');

  return (
    <div
      onClick={() => navigate(`/car/${car._id}`)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all duration-300 group hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 cursor-pointer">

      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-gray-100">
        <img
          src={car.thumbnail ? `${API_BASE_URL}/${car.thumbnail}` : '/placeholder.jpg'}
          alt={car.title || 'Car Image'}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {condition && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 text-gray-700 px-2.5 py-1 rounded-full shadow-sm">
              {condition}
            </span>
          </div>
        )}

        {car.isSpecialOffer && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-500 text-white px-2.5 py-1 rounded-full flex items-center gap-1">
              <Tag size={9} /> Offer
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {(brand || category) && (
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">{brand}</span>
            {category && (
              <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase">{category}</span>
            )}
          </div>
        )}

        <h3 className="text-base font-bold text-gray-900 truncate mb-2">{car.title || 'Untitled Car'}</h3>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 border-t border-gray-50 pt-3">
          <span className="flex items-center gap-1"><Calendar size={12} /> {year || '—'}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1"><Fuel size={12} /> {fuelType || '—'}</span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1"><Settings2 size={12} /> {transmission || '—'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {car.isSpecialOffer && car.discountedPrice ? (
              <div className="flex items-baseline gap-1.5">
                <p className="text-lg font-black text-gray-900">£{car.discountedPrice.toLocaleString()}</p>
                <p className="text-xs text-gray-400 line-through">£{car.price?.toLocaleString()}</p>
              </div>
            ) : (
              <p className="text-lg font-black text-gray-900">
                {car.price ? `£${car.price.toLocaleString()}` : 'Price N/A'}
              </p>
            )}
          </div>
          <Link to={`/car/${car._id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 text-xs font-bold text-white rounded-xl bg-orange-500 hover:bg-orange-600 transition-all duration-300 hover:-translate-y-0.5">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;