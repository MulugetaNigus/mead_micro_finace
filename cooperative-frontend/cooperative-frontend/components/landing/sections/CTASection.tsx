'use client';

import { useReveal } from '@/hooks/useReveal';
import { scrollToId } from '@/components/landing/utils';

interface CTASectionProps {
  handleSignIn: () => void;
}

export default function CTASection({ handleSignIn }: CTASectionProps) {
  const reveal = useReveal();

  return (
    <section className="py-24 md:py-32 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #051E3A 0%, #0A2E5C 100%)' }}>
      <div className="blur-orb float-orb-2" style={{ width: 350, height: 350, background: 'rgba(0,184,212,0.08)', top: -100, right: '10%' }} />
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div ref={reveal.ref} className={`${reveal.revealed ? 'revealed' : ''} reveal`}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
            Ready to Build Your <span className="shimmer-text">Financial Future?</span>
          </h2>
          <p className="text-lg text-blue-100/80 mb-10 max-w-2xl mx-auto">
            Join 500+ university staff who trust Ma&apos;ed Cooperative for their savings and lending needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleSignIn}
              className="px-10 py-4 text-base font-semibold text-[#0A2E5C] bg-white rounded-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 btn-shine">
              Join Now — It&apos;s Free
            </button>
            <button onClick={() => scrollToId('contact')}
              className="px-10 py-4 text-base font-semibold text-white border border-white/30 rounded-xl hover:bg-white/10 transition-all">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
