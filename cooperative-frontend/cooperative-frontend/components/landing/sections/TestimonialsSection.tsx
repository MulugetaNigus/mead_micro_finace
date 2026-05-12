'use client';

import { useReveal } from '@/hooks/useReveal';
import SectionTitle from '@/components/landing/ui/SectionTitle';

export default function TestimonialsSection() {
  const reveal = useReveal();

  return (
    <section className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <SectionTitle eyebrow="Member Voices" title="What Our Members Say"
          subtitle="Real stories from the Woldia University community." />

        <div ref={reveal.ref} className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Dr. Abebe Kebede', role: 'Faculty of Engineering', text: 'Joining Ma\'ed was the best financial decision I\'ve made. The returns are consistent and the service is impeccable.' },
            { name: 'Ato Dawit Hailu', role: 'Administration Staff', text: 'The loan process was incredibly smooth. I had the funds I needed within days, not weeks. Truly member-first service.' },
            { name: 'W/ro Tigist Mulu', role: 'Research Coordinator', text: 'I love the digital platform. Checking my balance and making deposits from my phone is a game changer.' },
          ].map((t, i) => (
            <div key={i} className={`relative p-8 rounded-2xl bg-gray-50/50 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-xl transition-all duration-500 stagger-${i + 1} ${reveal.revealed ? 'revealed' : ''} reveal`}
              style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 text-[#FFD600]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A2E5C] to-[#00B8D4] flex items-center justify-center text-white text-sm font-bold">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
