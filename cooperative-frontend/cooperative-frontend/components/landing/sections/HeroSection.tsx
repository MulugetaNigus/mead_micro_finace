'use client';

import { scrollToId } from '@/components/landing/utils';

interface HeroSectionProps {
  handleSignIn: () => void;
}

export default function HeroSection({ handleSignIn }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden hero-mesh">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-gray-200/60 shadow-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
              <span className="text-xs font-semibold text-gray-700 tracking-wide">Financial Cooperative for University Staff</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]" style={{ fontFamily: 'Poppins' }}>
              Smart Savings,{' '}
              <span className="underline-draw shimmer-text">Secure Future</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              Ma&apos;ed Cooperative delivers transparent financial solutions with competitive returns, flexible lending, and institutional-grade security for the Woldia University community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-14">
              <button onClick={handleSignIn}
                className="px-8 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:shadow-2xl hover:-translate-y-0.5 btn-shine"
                style={{ backgroundColor: '#0A2E5C' }}>
                Open Account
              </button>
              <button onClick={() => scrollToId('about')}
                className="px-8 py-3.5 text-base font-semibold text-gray-900 border border-gray-200 rounded-xl hover:bg-white hover:border-gray-300 transition-all backdrop-blur-sm bg-white/50">
                Learn More
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200/70">
              {[
                { n: '500+', l: 'Active Members' },
                { n: '7%', l: 'Monthly Return' },
                { n: 'ETB 5M+', l: 'Total Savings' },
              ].map((s, i) => (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${0.3 + i * 0.15}s` }}>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>{s.n}</div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Overlapping Flip Cards */}
          <div className="relative h-[500px] md:h-[620px] flex items-center justify-center select-none">
            <div className="relative w-full h-full max-w-xl mx-auto">

              {/* Card 1 (back / offset) — Pink/Purple */}
              <div className="absolute top-4 right-0 md:top-6 md:right-4 w-[340px] md:w-[440px] h-[215px] md:h-[275px] transition-transform duration-500 hover:scale-105">
                <div className="flip-card w-full h-full">
                  <div className="flip-card-inner">
                    {/* Front */}
                    <div className="flip-card-front rounded-2xl p-6 md:p-7 shadow-2xl"
                      style={{
                        background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #F43F5E 100%)',
                        boxShadow: '0 25px 60px -15px rgba(124,58,237,0.35)',
                      }}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-8 rounded-md bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-80" />
                        <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h16.5M12 3.75v16.5" />
                        </svg>
                      </div>
                      <div className="text-white/90 text-base md:text-lg tracking-[0.2em] font-mono mb-5">5678 9012 3456 7890</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[11px] text-white/50 uppercase tracking-wider mb-1">Card Holder</div>
                          <div className="text-white text-sm md:text-base font-medium tracking-wide">ABEBE KEBEDE</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-white/50 uppercase tracking-wider mb-1">Expires</div>
                          <div className="text-white text-sm md:text-base font-medium">10/28</div>
                        </div>
                      </div>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back rounded-2xl p-6 md:p-7 shadow-2xl flex flex-col items-center justify-center gap-4"
                      style={{
                        background: 'linear-gradient(135deg, #4C1D95 0%, #BE185D 100%)',
                        boxShadow: '0 25px 60px -15px rgba(124,58,237,0.35)',
                      }}>
                      <div className="w-full h-12 bg-black/40 rounded-md mb-2" />
                      <div className="w-full flex justify-end px-4">
                        <span className="text-white/80 text-base font-mono tracking-widest">CVV 842</span>
                      </div>
                      <div className="mt-3 text-white/40 text-xs uppercase tracking-widest">Ma&apos;ed Member Card</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 (front) — Navy/Teal */}
              <div className="absolute top-28 left-0 md:top-32 md:left-2 w-[340px] md:w-[440px] h-[215px] md:h-[275px] transition-transform duration-500 hover:scale-105">
                <div className="flip-card w-full h-full">
                  <div className="flip-card-inner">
                    {/* Front */}
                    <div className="flip-card-front rounded-2xl p-6 md:p-7 shadow-2xl"
                      style={{
                        background: 'linear-gradient(135deg, #0A0E1A 0%, #0A2E5C 40%, #00B8D4 100%)',
                        boxShadow: '0 30px 70px -15px rgba(10,46,92,0.4)',
                      }}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-8 rounded-md bg-gradient-to-r from-yellow-200 to-yellow-400 opacity-90" />
                        <svg className="w-7 h-7 text-white/70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h16.5M12 3.75v16.5" />
                        </svg>
                      </div>
                      <div className="text-white/90 text-base md:text-lg tracking-[0.2em] font-mono mb-5">1234 5678 9000 0000</div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-[11px] text-white/50 uppercase tracking-wider mb-1">Card Holder</div>
                          <div className="text-white text-sm md:text-base font-medium tracking-wide">TIGIST MULU</div>
                        </div>
                        <div>
                          <div className="text-[11px] text-white/50 uppercase tracking-wider mb-1">Expires</div>
                          <div className="text-white text-sm md:text-base font-medium">12/27</div>
                        </div>
                      </div>
                      {/* Mastercard-ish circles */}
                      <div className="absolute bottom-6 right-6 flex">
                        <div className="w-7 h-7 rounded-full bg-white/30 -mr-2" />
                        <div className="w-7 h-7 rounded-full bg-white/50" />
                      </div>
                    </div>
                    {/* Back */}
                    <div className="flip-card-back rounded-2xl p-6 md:p-7 shadow-2xl flex flex-col items-center justify-center gap-4"
                      style={{
                        background: 'linear-gradient(135deg, #020D1A 0%, #064E3B 100%)',
                        boxShadow: '0 30px 70px -15px rgba(10,46,92,0.4)',
                      }}>
                      <div className="w-full h-12 bg-black/40 rounded-md mb-2" />
                      <div className="w-full flex justify-end px-4">
                        <span className="text-white/80 text-base font-mono tracking-widest">CVV 361</span>
                      </div>
                      <div className="mt-3 text-white/40 text-xs uppercase tracking-widest">Ma&apos;ed Member Card</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
