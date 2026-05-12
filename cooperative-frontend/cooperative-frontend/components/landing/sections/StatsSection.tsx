'use client';

import { useReveal } from '@/hooks/useReveal';
import { useCountUp } from '@/hooks/useCountUp';

export default function StatsSection() {
  const reveal = useReveal();
  const stat1 = useCountUp(500, 2000, '+');
  const stat2 = useCountUp(5, 2000, 'M+');
  const stat3 = useCountUp(7, 2000, '%');
  const stat4 = useCountUp(99, 2000, '%');

  const stats = [
    { ref: stat1.ref, count: stat1.count, suffix: stat1.suffix, label: 'Active Members' },
    { ref: stat2.ref, count: stat2.count, suffix: stat2.suffix, label: 'Assets Managed' },
    { ref: stat3.ref, count: stat3.count, suffix: stat3.suffix, label: 'Annual Return' },
    { ref: stat4.ref, count: stat4.count, suffix: stat4.suffix, label: 'Satisfaction' },
  ];

  return (
    <section className="py-24 md:py-32 px-6 dark-glow relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div ref={reveal.ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => (
            <div key={i} ref={stat.ref} className={`stagger-${i + 1} ${reveal.revealed ? 'revealed' : ''} reveal`} style={{ transitionDelay: `${i * 0.15}s` }}>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins' }}>
                {stat.count}{stat.suffix}
              </div>
              <p className="text-blue-200/70 text-sm font-medium tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
