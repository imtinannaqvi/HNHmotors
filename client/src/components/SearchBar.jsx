import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const CATEGORIES = ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Truck', 'Van', 'Convertible'];

const SearchBar = () => {
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query)    params.set('search',   query);
    if (category) params.set('category', category);
    navigate(`/?${params.toString()}`);
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-md shadow-sm p-3">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">

        {/* Search input */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by make, model, title..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-400 transition"
          />
        </div>

        {/* Category dropdown */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-600 outline-none focus:border-gray-400 transition bg-white">
          <option value="">All categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Submit */}
        <button type="submit"
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-black transition">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;