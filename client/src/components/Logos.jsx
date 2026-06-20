import React from 'react'

// Replace these with your real logo image paths later
const logos = [
  { name: 'Logo 1', src: '/03a942b024ccd71e656af9f59b47530b.jpg' },
  { name: 'Logo 2', src: '/154ec0194501da6147407ebd3404bb7d.jpg' },
  { name: 'Logo 3', src: '/0744c784583201384da13936e73de25b.jpg' },
  { name: 'Logo 4', src: '/785eae3a6dffb885c77a18e3ba5dd824.jpg' },
  { name: 'Logo 5', src: '/71145e9502b93079b94708dae27653bb.jpg' },
  { name: 'Logo 6', src: '/dae4795475a45eb2d3a7ce361683aa21.jpg' },
  { name: 'Logo 7', src: '/4ce92925689dc37f39593a5bbcca1326.jpg' },
]

const Logos = () => {
  // Duplicate the list so the loop is seamless (no gap when it restarts)
  const loopLogos = [...logos, ...logos]

  return (
    <section className="bg-white py-15 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-3xl font-bold italic text-black mb-8">
          Brands We Have
        </p>

        {/* Marquee track */}
        <div className="relative w-full overflow-hidden">
          {/* fade edges (optional) */}
          <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex w-max animate-marquee gap-16">
            {loopLogos.map((logo, i) => (
              <div key={i} className="flex items-center justify-center flex-shrink-0">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-22 w-auto object-contain transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  )
}

export default Logos