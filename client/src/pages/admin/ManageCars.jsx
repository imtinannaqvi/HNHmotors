import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../../api/axios.js";
import { Pencil, Trash2, Car, Plus, Search } from 'lucide-react';

const ManageCars = () => {
  const [cars,    setCars]    = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/cars'); // ✅ fixed
      setCars(data.cars || []);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`/cars/${id}`); // ✅ fixed
      setCars(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert('Error deleting car');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-7 h-7 border-2 border-gray-200 border-t-gray-700 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Manage Inventory</h1>
          <p className="text-sm text-gray-400 mt-0.5">{cars.length} vehicles listed</p>
        </div>
        <button
          onClick={() => navigate('/admin/add-car')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-md hover:bg-black transition">
          <Plus size={15} /> Add Vehicle
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-md shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Vehicle</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">SEO</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Brand</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Price</th>
              <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {cars.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center">
                  <Car size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-medium">No vehicles found</p>
                  <button
                    onClick={() => navigate('/admin/add-car')}
                    className="mt-3 text-xs text-gray-900 underline underline-offset-2 font-medium">
                    Add your first listing
                  </button>
                </td>
              </tr>
            ) : cars.map(car => (
              <tr key={car._id} className="hover:bg-gray-50/60 transition-colors align-top">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Image or placeholder */}
                    <div className="w-11 h-11 bg-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center border border-gray-100">
                      {car.thumbnail || car.images?.[0] ? (
                        <img
                          src={`/${car.thumbnail || car.images[0]}`}
                          alt={car.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Car size={16} className="text-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{car.title}</p>
                      <p className="text-xs text-gray-400">{car.year || '—'} · {car.mileage ? `${car.mileage.toLocaleString()} km` : '—'}</p>
                    </div>
                  </div>
                </td>

                {/* ── SEO column ── */}
                <td className="px-6 py-4 max-w-[260px]">
                  {car.seoTitle || car.seoDescription ? (
                    <div className="space-y-1">
                      {car.seoTitle && (
                        <p
                          title={car.seoTitle}
                          className="text-xs font-semibold text-gray-700 truncate flex items-center gap-1">
                          <Search size={11} className="text-gray-300 shrink-0" />
                          {car.seoTitle}
                        </p>
                      )}
                      {car.seoDescription && (
                        <p
                          title={car.seoDescription}
                          className="text-[11px] text-gray-400 line-clamp-2 leading-snug">
                          {car.seoDescription}
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-300 italic">No SEO set</span>
                  )}
                </td>

                <td className="px-6 py-4 text-sm text-gray-600 font-medium">{car.brand || '—'}</td>
                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                  £{car.price?.toLocaleString() || '0'}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    car.status === 'available' ? 'bg-green-50 text-green-600' :
                    car.status === 'sold'      ? 'bg-red-50 text-red-500'    :
                                                  'bg-amber-50 text-amber-600'
                  }`}>
                    {car.status || 'available'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => navigate(`/admin/edit-car/${car._id}`)}
                      className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => deleteCar(car._id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCars;