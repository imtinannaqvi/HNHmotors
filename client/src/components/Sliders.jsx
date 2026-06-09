import React, { useState, useEffect } from 'react';

const Sliders = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cars = [
    {
      name: "BMW",
      image: "/bmw.jpg",
      details: "The Ultimate Driving Machine.",
      price: "$85,000",
      justify: "justify-start" 
    },
    {
      name: "Tesla",
      image: "/testa.jpg",
      details: "Electric innovation redefined.",
      price: "$60,000",
      justify: "justify-end" 
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === cars.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] overflow-hidden bg-gray-900 flex items-center px-16">
      {/* Background Image */}
      <img 
        key={cars[currentIndex].image}
        src={cars[currentIndex].image} 
        alt={cars[currentIndex].name} 
        className="absolute inset-0 w-full h-full object-cover animate-fade-in" 
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

      {/* Content Container */}
      <div className={`relative w-full flex ${cars[currentIndex].justify} items-center transition-all duration-1000`}>
        
        {/* Modern Card Design */}
        <div className="w-[400px] bg-white/10 backdrop-blur-md p-8 border-l-4 border-blue-500 animate-slide-in">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400 mb-2 block">2026 Model</span>
          <h2 className="text-6xl font-black text-white mb-4 uppercase italic">{cars[currentIndex].name}</h2>
          <p className="text-gray-200 mb-6 text-lg font-light leading-relaxed">{cars[currentIndex].details}</p>
          
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{cars[currentIndex].price}</span>
            <span className="text-sm text-gray-300 font-medium uppercase">/ mo</span>
          </div>
          
          <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-widest text-sm transition-colors">
            View Details
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        .animate-slide-in { animation: slideIn 0.8s ease-out; }
      `}</style>
    </div>
  );
};

export default Sliders;