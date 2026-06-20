import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/axios.js';
import CarCard from '../components/CarCard';
import { Search, ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';

const API_BASE = '';

// ── Helpers (module scope) ──
const getDetail = (car, key) => {
  if (!car.details || typeof car.details !== 'object') return '';
  const entry = Object.entries(car.details).find(([k]) => k.toLowerCase() === key.toLowerCase());
  return entry ? String(entry[1]) : '';
};

const toNumber = (val) => {
  if (val == null) return NaN;
  return Number(String(val).replace(/[^0-9.]/g, ''));
};

const AccordionSection = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-gray-100 last:border-0">
    <button onClick={onToggle}
      className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-800 hover:text-orange-500 transition-colors duration-200">
      {title}
      {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
    </button>
    {isOpen && <div className="pb-3">{children}</div>}
  </div>
);

const OptionRow = ({ label, active, onClick, logo }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active ? 'bg-orange-500 text-white' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:translate-x-0.5'
    }`}>
    {logo && (
      <img src={`${API_BASE}/${logo}`} alt=""
        className={`h-12 w-12 rounded-full object-contain bg-white border border-gray-200 p-1 flex-shrink-0 ${active ? 'brightness-0 invert' : ''}`} />
    )}
    {label}
  </button>
);

const Listings = () => {
  const [cars,         setCars]         = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [showAll,      setShowAll]      = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState('');
  const [brand,     setBrand]     = useState('');
  const [minPrice,  setMinPrice]  = useState('');
  const [maxPrice,  setMaxPrice]  = useState('');

  const [openSections, setOpenSections] = useState({ category: true, brand: true, price: false });
  const toggleSection = (key) => setOpenSections(p => ({ ...p, [key]: !p[key] }));

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get('/cars', { params: { limit: 100 } });
        setCars(data?.cars || []);
      } catch (err) {
        setError('Failed to load cars.');
      } finally {
        setLoading(false);
      }
    };
    setLoading(true);
    fetchCars();
  }, []);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    cars.forEach(c => { const v = getDetail(c, 'category'); if (v) set.add(v); });
    return [...set].sort();
  }, [cars]);

  const brandOptions = useMemo(() => {
    const map = {};
    cars.forEach(c => {
      const v = getDetail(c, 'brand');
      if (!v) return;
      if (!(v in map)) map[v] = '';
      if (!map[v] && c.brandLogo) map[v] = c.brandLogo;
    });
    return Object.entries(map)
      .map(([name, logo]) => ({ name, logo }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [cars]);

  const filteredCars = useMemo(() => {
    const min = minPrice === '' ? null : toNumber(minPrice);
    const max = maxPrice === '' ? null : toNumber(maxPrice);

    return cars.filter(c => {
      const price = toNumber(c.price);
      if (search && !c.title?.toLowerCase().includes(search.toLowerCase())) return false;
      if (category && getDetail(c, 'category').toLowerCase() !== category.toLowerCase()) return false;
      if (brand && getDetail(c, 'brand').toLowerCase() !== brand.toLowerCase()) return false;
      if (min != null && !isNaN(min) && !(price >= min)) return false;
      if (max != null && !isNaN(max) && !(price <= max)) return false;
      return true;
    });
  }, [cars, search, category, brand, minPrice, maxPrice]);

  const clearFilters = () => { setSearch(''); setCategory(''); setBrand(''); setMinPrice(''); setMaxPrice(''); };
  const hasFilters = category || brand || minPrice || maxPrice;
  const visibleCars = showAll ? filteredCars : filteredCars.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Available Listings</h1>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
          <SlidersHorizontal size={15} /> Filters
          {hasFilters && <span className="w-2 h-2 rounded-full bg-orange-500" />}
        </button>
      </div>

      <div className="flex gap-6">
        <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
          <div className="w-full">
            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cars..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                  <X size={13} />
                </button>
              )}
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
              {hasFilters && (
                <button onClick={clearFilters}
                  className="w-full mb-3 text-xs font-semibold text-red-500 hover:text-red-600 flex items-center justify-center gap-1 transition">
                  <X size={12} /> Clear all filters
                </button>
              )}

              <AccordionSection title="Category" isOpen={openSections.category} onToggle={() => toggleSection('category')}>
                {categoryOptions.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {categoryOptions.map(c => (
                      <OptionRow key={c} label={c} active={category === c} onClick={() => setCategory(category === c ? '' : c)} />
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400 px-3">No categories available</p>}
              </AccordionSection>

              <AccordionSection title="Brand" isOpen={openSections.brand} onToggle={() => toggleSection('brand')}>
                {brandOptions.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {brandOptions.map(b => (
                      <OptionRow key={b.name} label={b.name} logo={b.logo}
                        active={brand === b.name}
                        onClick={() => setBrand(brand === b.name ? '' : b.name)} />
                    ))}
                  </div>
                ) : <p className="text-xs text-gray-400 px-3">No brands available</p>}
              </AccordionSection>

              <AccordionSection title="Price range" isOpen={openSections.price} onToggle={() => toggleSection('price')}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Min £"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 transition" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Max £"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 transition" />
                </div>
              </AccordionSection>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-7 h-7 border-2 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-red-500 py-20">{error}</p>
          ) : filteredCars.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg font-semibold mb-2">No cars found</p>
              <p className="text-sm">Try adjusting your filters</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-4 text-sm text-orange-500 underline underline-offset-2">Clear filters</button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {visibleCars.map((car, i) => (
                  <div key={car._id} className="animate-fade-up" style={{ animationDelay: `${(i % 6) * 70}ms`, animationFillMode: 'backwards' }}>
                    <CarCard car={car} />
                  </div>
                ))}
              </div>

              {filteredCars.length > 6 && (
                <div className="flex justify-center mt-10">
                  <button onClick={() => setShowAll(p => !p)}
                    className="px-8 py-3 bg-gray-900 text-white text-sm font-bold rounded-md transition-all duration-300 hover:bg-black hover:-translate-y-0.5 hover:shadow-lg">
                    {showAll ? 'Show less' : `Show more `}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;