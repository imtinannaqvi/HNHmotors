import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import useReveal from '../hooks/useReveal.js';

const faqs = [
  { q: 'Do you offer financing options?', a: 'Yes. Our finance department works with multiple lenders to find a plan that fits your budget, including options for a range of credit situations.' },
  { q: 'Can I trade in my current vehicle?', a: 'Absolutely. We accept trade-ins and will give you a fair valuation that can be put toward your next car.' },
  { q: 'Are your vehicles inspected before sale?', a: 'Every vehicle goes through a thorough multi-point inspection before it is listed, so you can buy with confidence.' },
  { q: 'Do you deliver cars?', a: 'We offer delivery to many areas. Get in touch with the stock ID of the car you are interested in and we will confirm availability and cost.' },
  { q: 'How do I enquire about a specific car?', a: 'Open the car listing and use the enquiry form or the WhatsApp button. We will get back to you quickly with all the details.' },
  { q: 'What documents do I need to buy a car?', a: 'Typically a valid ID, proof of address, and if financing, proof of income. We will guide you through the exact requirements for your situation.' },
  { q: 'Do the cars come with a warranty?', a: 'Many of our vehicles include a warranty. The coverage varies by car, so check the listing details or ask us directly.' },
  { q: 'Can I reserve a car before visiting?', a: 'Yes. Contact us with the stock ID and we can hold the vehicle for a short period while you arrange a viewing.' },
  { q: 'Do you buy cars as well as sell them?', a: 'We do. If you want to sell your vehicle, send us the details and we will make you an offer.' },
  { q: 'Are the prices negotiable?', a: 'Our listed prices are competitive, but feel free to make an enquiry and we will discuss the best deal we can offer.' },
  { q: 'What payment methods do you accept?', a: 'We accept bank transfers, card payments, and approved financing. Cash payments may be subject to limits.' },
  { q: 'Can I test drive before buying?', a: 'Yes, test drives are welcome by appointment. Bring a valid driving licence and we will arrange it.' },
  { q: 'Are the mileage and history accurate?', a: 'We verify mileage and history where possible and disclose what we know. You are also welcome to run your own checks.' },
  { q: 'Do you sell to customers outside the local area?', a: 'Yes. We regularly arrange sales and delivery to customers further afield. Contact us to discuss logistics.' },
  { q: 'How often is new stock added?', a: 'New vehicles are added regularly. Check the listings page often or enquire about a specific model you are after.' },
  { q: 'What happens after I submit an enquiry?', a: 'A member of our team reviews it and gets back to you by phone or email, usually within a working day.' },
  { q: 'Can I see more photos of a vehicle?', a: 'Each listing has a photo gallery. If you would like additional angles, just ask in your enquiry and we will send more.' },
  { q: 'Do you offer part-exchange?', a: 'Yes, part-exchange is available. We will value your current vehicle and apply it against the car you want.' },
  { q: 'Is my deposit refundable?', a: 'Deposit terms depend on the agreement. We will explain the conditions clearly before you commit.' },
  { q: 'How can I contact you?', a: 'Use the enquiry form on any listing, the WhatsApp button, or the phone and email shown across the site.' },
];

const Faqs = () => {
  const [open, setOpen] = useState(0);
  const revealRef = useReveal();

  return (
    <section className="bg-white py-16 px-4 min-h-screen">
      <div ref={revealRef} className="reveal max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Frequently Asked Questions</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-0.5 w-12 bg-orange-500" />
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <div className="h-0.5 w-12 bg-orange-500" />
          </div>
          <p className="text-sm text-gray-500 mt-4 max-w-xl mx-auto">
            Everything you need to know about buying, selling, and financing with us. Can't find your answer? Get in touch.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i}
                className={`animate-fade-up border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-orange-200 shadow-lg' : 'border-gray-100 hover:border-orange-100'}`}
                style={{ animationDelay: `${Math.min(i, 8) * 50}ms`, animationFillMode: 'backwards' }}>
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
      </div>
    </section>
  );
};

export default Faqs;