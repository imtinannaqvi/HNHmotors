import React from 'react';
import { DollarSign, Car, Users, Wrench } from 'lucide-react';
import useReveal from '../hooks/useReveal.js';

const icons = [DollarSign, Car, Users, Wrench];

const WhyChos = () => {
  const revealRef = useReveal();

  const ChosLists = [
    { title: 'Financing Made Easy',      des: 'Our stress-free finance department can find financial solutions to save you money.' },
    { title: 'Wide Range of Brands',     des: 'With a robust selection of popular vehicles on hand, as well as leading vehicles from BMW and Ford.' },
    { title: 'Trusted by Thousands',     des: '10 new offers every day. 350 offers on site, trusted by a community of thousands of users.' },
    { title: 'Car Service & Maintenance', des: 'Our service department maintains your car to stay safe on the road for many more years.' },
  ];

  return (
    <section className="bg-white py-16 px-4">
      <div ref={revealRef} className="reveal max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Why Choose Us</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-0.5 w-12 bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="h-0.5 w-12 bg-orange-500" />
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ChosLists.map(({ title, des }, i) => {
            const Icon = icons[i];
            return (
              <div key={i}
                className="animate-fade-up group border border-gray-100 rounded-2xl p-6 text-center flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1.5"
                style={{ animationDelay: `${i * 90}ms`, animationFillMode: 'backwards' }}>

                <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-100 group-hover:bg-orange-500 group-hover:border-orange-500 flex items-center justify-center mb-4 transition-all duration-300">
                  <Icon size={26} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
                </div>

                <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 mb-3">{title}</h3>
                <div className="w-8 h-0.5 bg-orange-500 mb-3 transition-all duration-300 group-hover:w-12" />
                <p className="text-sm text-gray-500 leading-relaxed">{des}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChos;