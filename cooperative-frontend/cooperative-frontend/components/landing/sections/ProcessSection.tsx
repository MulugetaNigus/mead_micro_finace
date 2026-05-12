'use client';

import { useReveal } from '@/hooks/useReveal';
import SectionTitle from '@/components/landing/ui/SectionTitle';

export default function ProcessSection() {
  const reveal = useReveal();

  return (
    <section id="how-it-works" className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Simple Steps" title="Getting Started"
          subtitle="Join our cooperative community in three easy steps." />

        <div ref={reveal.ref} className="grid md:grid-cols-3 gap-8 relative">
          {/* connecting line on desktop */}
          <div className="hidden md:block absolute top-[60px] left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-[#0A2E5C] via-[#00B8D4] to-[#00C853] opacity-20" />

          {[
            { step: '01', title: 'Registration', desc: 'Complete online registration with basic information and university verification', color: '#0A2E5C' },
            { step: '02', title: 'Account Setup', desc: 'Establish your savings account and set up secure login credentials', color: '#00B8D4' },
            { step: '03', title: 'Start Saving', desc: 'Begin deposits and access all cooperative benefits and services', color: '#00C853' },
          ].map((item, i) => (
            <div key={i} className={`relative text-center stagger-${i + 1} ${reveal.revealed ? 'revealed' : ''} reveal`} style={{ transitionDelay: `${i * 0.2}s` }}>
              <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 rounded-2xl text-white text-xl font-bold shadow-lg mb-6 mx-auto"
                style={{ backgroundColor: item.color, fontFamily: 'Poppins' }}>
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
