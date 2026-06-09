import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  // 1. Guard clause: If car data is missing, don't render and prevent crash
  if (!car) return null;

  const API_BASE_URL = "http://localhost:5000"; 

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Thumbnail Image */}
      <div className="h-56 w-full overflow-hidden">
        <img 
          // 2. Use optional chaining (?.) and fallback to prevent undefined errors
          src={car.thumbnail ? `${API_BASE_URL}/${car.thumbnail}` : '/placeholder.jpg'} 
          alt={car.title || 'Car Image'} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Card Body */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 truncate">{car.title || 'Untitled Car'}</h3>
          <span className="text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-2 py-1 rounded">
            {car.condition || 'N/A'}
          </span>
        </div>

        <p className="text-2xl font-black text-gray-900 mb-4">
          {car.price ? `$${car.price.toLocaleString()}` : 'Price N/A'}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">Year:</span> {car.year || 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">Fuel:</span> {car.fuelType || 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">Trans:</span> {car.transmission || 'N/A'}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">Body:</span> {car.category || 'N/A'}
          </div>
        </div>

        <Link 
          to={`/car/${car._id}`} 
          className="block w-full text-center bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition-colors duration-300"
        >
          View Full Details
        </Link>
      </div>
    </div>
  );
};

export default CarCard;