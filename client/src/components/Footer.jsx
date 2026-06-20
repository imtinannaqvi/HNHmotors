import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios.js';
import { Mail, MessageCircle, ArrowUp } from 'lucide-react';
import useReveal from '../hooks/useReveal.js';

const API_BASE = '';

// Static lists to fill the footer (temporary display only)
const BRANDS     = ['Ford', 'Audi', 'Mercedes-Benz', 'Nissan'];
const CATEGORIES = ['SUV', 'Sedan', 'Hatchback', 'Electric'];

const Footer = () => {
  const [settings, setSettings] = useState(null);
  const revealRef = useReveal();

  useEffect(() => {
    axios.get('/settings')
      .then(({ data }) => setSettings(data))
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  const footer     = settings?.footer      || {};
  const socials    = settings?.socialLinks || {};
  const quickLinks = footer.quickLinks     || [];
  const logo       = footer.logo || settings?.navbar?.logo || '';

  const hasSocials = socials.facebook || socials.instagram || socials.twitter || socials.linkedin;
  const hasContact = footer.email || footer.whatsappNumber;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const SocialIcon = ({ href, label, children }) =>
    href ? (
      <a href={href} target="_blank" rel="noreferrer" aria-label={label}
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-500 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
        {children}
      </a>
    ) : null;

  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500" />

      <div ref={revealRef} className="reveal max-w-6xl mx-auto px-6 pt-14 pb-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

          {/* ── Brand (spans 2 cols on large screens) ── */}
          <div className="lg:col-span-2 md:max-w-xs">
            {logo ? (
              <img src={`${API_BASE}/${logo}`} alt="HNH Motors" className="h-14 w-auto object-contain mb-4" />
            ) : (
              <h3 className="text-gray-900 font-black text-2xl uppercase tracking-tight mb-1">HNH Motors</h3>
            )}
            <div className="w-10 h-0.5 bg-orange-500 mb-4" />

            {footer.description && (
              <p className="text-sm text-gray-500 font-medium leading-relaxed mb-5">{footer.description}</p>
            )}

            {hasSocials && (
              <div className="flex gap-3">
                <SocialIcon href={socials.facebook} label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </SocialIcon>
                <SocialIcon href={socials.instagram} label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
                </SocialIcon>
                <SocialIcon href={socials.twitter} label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </SocialIcon>
                <SocialIcon href={socials.linkedin} label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </SocialIcon>
              </div>
            )}
          </div>

          {/* ── Brands ── */}
          <div>
            <h4 className="text-gray-900 font-extrabold text-sm uppercase tracking-widest mb-3">Brands</h4>
            <div className="w-8 h-0.5 bg-orange-500 mb-4" />
            <ul className="space-y-3">
              {BRANDS.map(b => (
                <li key={b} className="text-md font-bold text-gray-600">{b}</li>
              ))}
            </ul>
          </div>

          {/* ── Categories ── */}
          <div>
            <h4 className="text-gray-900 font-extrabold text-sm uppercase tracking-widest mb-3">Categories</h4>
            <div className="w-8 h-0.5 bg-orange-500 mb-4" />
            <ul className="space-y-3">
              {CATEGORIES.map(c => (
                <li key={c} className="text-md font-bold text-gray-600">{c}</li>
              ))}
            </ul>
          </div>

          {/* ── Contact / Quick links ── */}
          <div>
            <h4 className="text-gray-900 font-extrabold text-sm uppercase tracking-widest mb-3">
              {quickLinks.length > 0 ? 'Quick Links' : 'Get in touch'}
            </h4>
            <div className="w-8 h-0.5 bg-orange-500 mb-4" />

            {quickLinks.length > 0 && (
              <ul className="space-y-3 mb-4">
                {quickLinks.map((link, i) => (
                  <li key={i}>
                    <Link to={`/${link.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-md font-bold text-gray-600 hover:text-orange-500 hover:translate-x-1 inline-block transition-all duration-200">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {hasContact && (
              <div className="space-y-3">
                {footer.email && (
                  <a href={`mailto:${footer.email}`}
                    className="flex items-center gap-2.5 text-md font-bold text-gray-600 hover:text-orange-500 transition-colors duration-200">
                    <Mail size={16} className="text-orange-500 flex-shrink-0" /> {footer.email}
                  </a>
                )}
                {footer.whatsappNumber && (
                  <a href={`https://wa.me/${footer.whatsappNumber}`} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2.5 text-md font-bold text-gray-600 hover:text-orange-500 transition-colors duration-200">
                    <MessageCircle size={16} className="text-orange-500 flex-shrink-0" /> {footer.whatsappNumber}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar — copyright centered */}
        <div className="border-t border-gray-100 pt-5 relative flex items-center justify-center">
          <p className="text-sm font-medium text-gray-400 text-center">
            © {new Date().getFullYear()} HNH Motors. All rights reserved.
          </p>
          <button onClick={scrollTop}
            className="absolute right-0 w-9 h-9 rounded-full bg-gray-100 hover:bg-orange-500 text-gray-500 hover:text-white flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
            aria-label="Back to top">
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;