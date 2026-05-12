'use client';

import { useReveal } from '@/hooks/useReveal';
import SectionTitle from '@/components/landing/ui/SectionTitle';
import { IconShield, IconChart, IconLock } from '@/components/landing/ui/Icons';

export default function ServicesSection() {
  const reveal = useReveal();

  return (
    <section id="services" className="py-24 md:py-32 px-6 relative dot-grid">
      <div className="max-w-7xl mx-auto relative z-10">
        <SectionTitle eyebrow="What We Offer" title="Our Services"
          subtitle="Comprehensive financial solutions designed exclusively for university staff." />

        <div ref={reveal.ref} className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'Savings Accounts', desc: 'Flexible deposit options with competitive interest rates. Build wealth through regular or voluntary savings with guaranteed returns.', icon: <IconShield className="w-7 h-7" />, gradient: 'from-[#0A2E5C] to-[#1A4A8A]' },
            { title: 'Loan Services', desc: 'Quick, transparent lending with minimal documentation. Competitive rates and flexible repayment schedules tailored to your needs.', icon: <IconChart className="w-7 h-7" />, gradient: 'from-[#00B8D4] to-[#0097A7]' },
            { title: 'Digital Management', desc: 'Secure online platform for account management, transactions, and document handling. 24/7 access to your financial information.', icon: <IconLock className="w-7 h-7" />, gradient: 'from-[#00C853] to-[#009624]' },
          ].map((s, i) => (
            <div key={i} className={`group relative p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 card-3d stagger-${i + 1} ${reveal.revealed ? 'revealed' : ''} reveal`}
              style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {s.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>{s.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{s.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#0A2E5C] opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                <span>Learn more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" /></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
