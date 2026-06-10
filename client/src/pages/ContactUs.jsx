import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import useReveal from '../hooks/useReveal.js';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const bodyRef = useReveal();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', form);  // TODO: wire to backend later
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  const info = [
    { icon: MapPin, label: 'Address', value: '1840 E Garvey Ave South, West Covina, CA 91791' },
    { icon: Phone,  label: 'Phone',   value: '+44 7000 000000' },
    { icon: Mail,   label: 'Email',   value: 'info@hnhmotors.com' },
    { icon: Clock,  label: 'Hours',   value: 'Mon–Sat: 9:00 AM – 6:00 PM · Sun: Closed' },
  ];

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Contact Us</h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-0.5 w-12 bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="h-0.5 w-12 bg-orange-500" />
          </div>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Have a question about a vehicle or need a hand finding the right car? Reach out — our team
            is happy to help. (Placeholder text.)
          </p>
        </div>
      </section>

      {/* Info + Form */}
      <section className="py-16 px-4">
        <div ref={bodyRef} className="reveal max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3">Get in touch</h2>
            <div className="w-10 h-0.5 bg-orange-500 mb-6" />
            <div className="space-y-5">
              {info.map(({ icon: Icon, label, value }, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-full bg-orange-50 border-2 border-orange-100 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-orange-500">
                    <Icon size={18} className="text-orange-500 transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
                    <p className="text-sm font-semibold text-gray-700">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="border border-gray-100 rounded-2xl shadow-sm p-6 transition-shadow duration-300 hover:shadow-lg">
            <h2 className="text-sm font-black uppercase tracking-wide text-gray-900 mb-1">Send a message</h2>
            <div className="w-8 h-0.5 bg-orange-500 mb-5" />

            {sent ? (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm font-medium animate-fade-up">
                Thanks! Your message has been sent.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Your name"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Your email"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition" />
                <textarea name="message" value={form.message} onChange={handleChange} rows={4} required placeholder="How can we help?"
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none" />
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 text-white text-sm font-bold uppercase tracking-wide py-3 rounded-xl transition-all duration-300 hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg">
                  <Send size={15} /> Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-72 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium">Map placeholder — embed Google Maps here</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;