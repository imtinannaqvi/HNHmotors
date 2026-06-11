import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Award, Users, Car } from 'lucide-react';
import useReveal from '../hooks/useReveal.js';

const stats = [
  { icon: Car,         value: '500+',   label: 'Cars Sold' },
  { icon: Users,       value: '1,200+', label: 'Happy Customers' },
  { icon: Award,       value: '12',     label: 'Years in Business' },
  { icon: ShieldCheck, value: '100%',   label: 'Quality Checked' },
];

const values = [
  { title: 'Trusted Quality', des: 'Every vehicle passes a thorough multi-point inspection before it reaches our showroom floor.' },
  { title: 'Fair Pricing',    des: 'Transparent, competitive pricing with no hidden fees — what you see is what you pay.' },
  { title: 'Customer First',  des: 'Our team is here to guide you through every step, from browsing to driving away.' },
  { title: 'Wide Selection',  des: 'From family SUVs to performance coupes, we stock vehicles to suit every lifestyle.' },
];

const AboutUs = () => {
  const statsRef  = useReveal();
  const storyRef  = useReveal();
  const valuesRef = useReveal();

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-4">About HNH Motors</h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-0.5 w-12 bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="h-0.5 w-12 bg-orange-500" />
          </div>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. For over a decade, HNH Motors
            has been helping drivers find the right car at the right price. This is placeholder text —
            replace it with the real company story.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4">
        <div ref={statsRef} className="reveal max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={i}
              className="animate-fade-up border border-gray-100 rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1.5"
              style={{ animationDelay: `${i * 90}ms`, animationFillMode: 'backwards' }}>
              <div className="w-14 h-14 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center mx-auto mb-3 transition-colors duration-300 group-hover:bg-orange-500">
                <Icon size={24} className="text-orange-500" />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4 bg-gray-50">
        <div ref={storyRef} className="reveal max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Our Story</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-0.5 w-12 bg-orange-500" />
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <div className="h-0.5 w-12 bg-orange-500" />
            </div>
          </div>
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            This is placeholder content. Replace it with the real history, mission, and values of HNH Motors before going live.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div ref={valuesRef} className="reveal max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">What We Stand For</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-0.5 w-12 bg-orange-500" />
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <div className="h-0.5 w-12 bg-orange-500" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {values.map(({ title, des }, i) => (
              <div key={i}
                className="animate-fade-up w-[300px] group border border-gray-100 rounded-2xl p-3 transition-all duration-300 hover:shadow-xl hover:border-orange-200 hover:-translate-y-1"
                style={{ animationDelay: `${i * 90}ms`, animationFillMode: 'backwards' }}>
                <h3 className="text-sm font-black uppercase tracking-wide text-gray-900 mb-2">{title}</h3>
                <div className="w-8 h-0.5 bg-orange-500 mb-3 transition-all duration-300 group-hover:w-12" />
                <p className="text-md text-gray-500 leading-relaxed">{des}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-gray-900 text-white text-center mb-3">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-3">Ready to find your next car?</h2>
          <p className="text-gray-400 text-sm mb-6">Browse our latest listings or get in touch with our team today.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/"
              className="px-6 py-3 bg-orange-500 text-white text-sm font-bold uppercase tracking-wide rounded-xl transition-all duration-300 hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg">
              View Listings
            </Link>
            <Link to="/contact"
              className="px-6 py-3 border border-gray-700 text-white text-sm font-bold uppercase tracking-wide rounded-xl transition-all duration-300 hover:bg-gray-800 hover:-translate-y-0.5">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;