import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const cars = [
  { tag: '2026 Model', name: 'BMW',  image: '/bm.jpg',  desc: 'The ultimate driving machine.', price: '$85,000', id: null, color: '#e85d04', justify: 'left'  },
  { tag: '2026 Model', name: 'Audi', image: '/audi.jpg', desc: 'Electric innovation redefined.', price: '$60,000', id: null, color: '#e85d04', justify: 'right' },
];

const Sliders = () => {
  const [current, setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);
  const navigate  = useNavigate();
  const timerRef  = useRef(null);

  const go = (idx) => {
    const next = (idx + cars.length) % cars.length;
    setAnimating(false);
    setTimeout(() => { setCurrent(next); setAnimating(true); }, 10);
  };

  useEffect(() => {
    setAnimating(true);
    timerRef.current = setInterval(() => go(current + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const car = cars[current];

  return (
    <div className="relative w-full h-[520px] overflow-hidden bg-gray-900">

      {/* Background image with slow zoom */}
      <img
        key={car.image}
        src={car.image}
        alt={car.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ animation: 'fadeIn 1s ease forwards, kenburns 6s ease-out forwards' }}
      />

      {/* Subtle gradient only on the text side, for readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: car.justify === 'right'
            ? 'linear-gradient(to left, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)',
        }}
      />

      {/* Slide number */}
      <div className="absolute top-6 right-6 text-xs tracking-widest text-white/40 font-medium">
        {String(current + 1).padStart(2, '0')} / {String(cars.length).padStart(2, '0')}
      </div>

      {/* Content */}
      <div className={`absolute inset-0 flex items-center px-[5%] ${car.justify === 'right' ? 'justify-end' : 'justify-start'}`}>
        <div key={current} style={{ animation: animating ? 'slideIn 0.7s ease forwards' : 'none', maxWidth: '440px' }}>
          <span className="inline-block text-[13px] font-bold tracking-[0.15em] mb-4 px-3 py-1 border border-orange-500 rounded-full text-white">
            {car.tag}
          </span>
          <h2 className="text-[64px] font-black text-white italic leading-none mb-3">{car.name}</h2>
          <p className="text-white/70 text-base font-light leading-relaxed mb-6">{car.desc}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-white">{car.price}</span>
            <span className="text-xs uppercase tracking-widest text-white/50 font-medium">/ mo</span>
          </div>
          <button
            onClick={() => car.id && navigate(`/car/${car.id}`)}
            style={{ background: car.color }}
            className="mt-7 px-7 py-3 text-white text-xs font-bold rounded-full tracking-widest transition-all duration-300 hover:brightness-110 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30">
            View details
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-[5%] flex gap-2">
        {cars.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            style={{ width: i === current ? '40px' : '28px', height: '3px', background: i === current ? car.color : 'rgba(255,255,255,0.3)', transition: 'all 0.4s', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>

      {/* Arrows */}
      <div className="absolute bottom-4 right-[5%] flex gap-2">
        <button onClick={() => go(current - 1)}
          className="w-10 h-10 flex items-center justify-center text-white border border-white/30 bg-white/5 hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 rounded">
          <ChevronLeft size={20} />
        </button>
        <button onClick={() => go(current + 1)}
          className="w-10 h-10 flex items-center justify-center text-white border border-white/30 bg-white/5 hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 rounded">
          <ChevronRight size={20} />
        </button>
      </div>

      <style>{`
        @keyframes fadeIn   { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn  { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.08); } }
      `}</style>
    </div>
  );
};

export default Sliders;