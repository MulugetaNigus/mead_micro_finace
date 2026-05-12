'use client';

import { useReveal } from '@/hooks/useReveal';
import SectionTitle from '@/components/landing/ui/SectionTitle';
import { IconSparkles, IconChart, IconCheck, IconUsers, IconShield } from '@/components/landing/ui/Icons';

export default function AboutSection() {
  const reveal1 = useReveal();
  const reveal2 = useReveal();

  return (
    <section id="about" className="py-24 md:py-32 px-6 bg-white relative">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Who We Are" title="About Ma'ed Cooperative"
          subtitle="Established to serve the financial needs of Woldia University staff with integrity, transparency, and innovation." />

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Mission & Vision */}
          <div ref={reveal1.ref} className={`space-y-6 ${reveal1.revealed ? 'revealed' : ''} reveal-left`}>
            {[
              { label: 'Mission', title: 'Empower Through Finance', desc: 'To provide accessible, transparent, and reliable financial services that enable university staff to build wealth and secure their futures.', color: '#0A2E5C', icon: <IconSparkles className="w-5 h-5" /> },
              { label: 'Vision', title: 'Financial Dignity for All', desc: 'To become the trusted financial partner for university staff, recognized for excellence in service delivery and member satisfaction.', color: '#00B8D4', icon: <IconChart className="w-5 h-5" /> },
            ].map((item, i) => (
              <div key={i} className="group relative p-8 rounded-2xl bg-gray-50/60 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: item.color }}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.label}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Core Values */}
          <div ref={reveal2.ref} className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${reveal2.revealed ? 'revealed' : ''} reveal-right`}>
            {[
              { label: 'Transparency', desc: 'Open communication and honest operations in all transactions', icon: <IconCheck className="w-5 h-5" /> },
              { label: 'Community', desc: 'Supporting collective growth and member welfare', icon: <IconUsers className="w-5 h-5" /> },
              { label: 'Innovation', desc: 'Embracing digital solutions for member convenience', icon: <IconSparkles className="w-5 h-5" /> },
              { label: 'Reliability', desc: 'Consistent performance and institutional stability', icon: <IconShield className="w-5 h-5" /> },
            ].map((v, i) => (
              <div key={i} className={`gradient-border p-6 rounded-2xl transition-all hover:-translate-y-1 hover:shadow-xl stagger-${i + 1} ${reveal2.revealed ? 'revealed' : ''} reveal-scale`}
                style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] flex items-center justify-center text-[#0A2E5C] mb-4">
                  {v.icon}
                </div>
                <h4 className="font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins' }}>{v.label}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
