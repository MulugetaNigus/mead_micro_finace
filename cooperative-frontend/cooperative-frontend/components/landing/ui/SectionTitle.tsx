'use client';

import { useReveal } from '@/hooks/useReveal';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  light?: boolean;
}

export default function SectionTitle({ eyebrow, title, subtitle, light = false }: SectionTitleProps) {
  const { ref, revealed } = useReveal();
  return (
    <div ref={ref} className={`text-center mb-16 ${revealed ? 'revealed' : ''} reveal`}>
      <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
        style={{ background: light ? 'rgba(255,255,255,0.1)' : '#E0F2FE', color: light ? '#bae6fd' : '#0A2E5C' }}>
        {eyebrow}
      </span>
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 leading-tight ${light ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Poppins' }}>
        {title}
      </h2>
      <div className="flex justify-center mb-5">
        <div className="h-1 w-16 rounded-full" style={{ background: 'linear-gradient(90deg, #0A2E5C, #00B8D4)' }} />
      </div>
      <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${light ? 'text-blue-100' : 'text-gray-600'}`}>{subtitle}</p>
    </div>
  );
}
