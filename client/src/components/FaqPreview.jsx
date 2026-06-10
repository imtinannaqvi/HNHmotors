import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useReveal from '../hooks/useReveal.js';

const homeFaqs = [
  { q: 'Do you offer financing options?',           a: 'Yes. Our finance department works with multiple lenders to find a plan that fits your budget, including options for a range of credit situations.' },
  { q: 'Can I trade in my current vehicle?',         a: 'Absolutely. We accept trade-ins and will give you a fair valuation that can be put toward your next car.' },
  { q: 'Are your vehicles inspected before sale?',   a: 'Every vehicle goes through a thorough multi-point inspection before it is listed, so you can buy with confidence.' },
  { q: 'Do you deliver cars?',                       a: 'We offer delivery to many areas. Get in touch with the stock ID of the car you are interested in and we will confirm availability and cost.' },
  { q: 'How do I enquire about a specific car?',     a: 'Open the car listing and use the enquiry form or the WhatsApp button. We will get back to you quickly with all the details.' },
];

const FaqPreview = () => {
  const [open, setOpen] = useState(0);
  const revealRef = useReveal();

  return (
    <section className="bg-white py-16 px-4">
      <div ref={revealRef} className="reveal max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Frequently Asked Questions</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-0.5 w-12 bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="h-0.5 w-12 bg-orange-500" />
          </div>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {homeFaqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-orange-200 shadow-lg' : 'border-gray-100 hover:border-orange-100'}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left">
                  <span className="text-sm font-black uppercase tracking-wide text-gray-900">{item.q}</span>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-orange-500 text-white rotate-45' : 'bg-orange-50 text-orange-500'}`}>
                    <Plus size={16} />
                  </span>
                </button>
                <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <div className="px-6 pb-5">
                      <div className="w-8 h-0.5 bg-orange-500 mb-3" />
                      <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View all */}
        <div className="text-center mt-10">
          <Link to="/faqs"
            className="inline-block px-8 py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-wide rounded-xl transition-all duration-300 hover:bg-black hover:-translate-y-0.5 hover:shadow-lg">
            View all FAQs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FaqPreview;