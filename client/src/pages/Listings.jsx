import React, { useState, useEffect } from 'react';
import api from "../api/axios.js" // Ensure this matches your actual filename
import CarCard from '../components/CarCard';

const Listings = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state to manage how many cars are shown
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get('/cars'); 
        setCars(response.data?.cars || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching cars:", err);
        setError("Failed to load cars.");
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Function to show 8 more cars
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (loading) return <div className="p-10 text-center text-xl">Loading inventory...</div>;
  if (error) return <div className="p-10 text-center text-red-500 font-bold">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Available Car Listings</h1>
      
      {cars.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* slice(0, visibleCount) limits the array to the current state count */}
            {cars.slice(0, visibleCount).map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>

          {/* Show More Button logic */}
          {visibleCount < cars.length && (
            <div className="flex justify-center mt-12">
              <button 
                onClick={handleShowMore}
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Show More Cars
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <p>No cars currently available.</p>
        </div>
      )}
    </div>
  );
};

export default Listings;