'use client';

import { scrollToId } from '@/components/landing/utils';

export default function FooterSection() {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <footer className="py-16 px-6" style={{ backgroundColor: '#020D1A' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#0A2E5C' }}>
                <span className="text-white font-bold text-base" style={{ fontFamily: 'Poppins' }}>M</span>
              </div>
              <span className="font-semibold text-white text-lg" style={{ fontFamily: 'Poppins' }}>Ma&apos;ed Cooperative</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Serving university staff with transparent and reliable financial solutions. Building wealth together since establishment.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide" style={{ fontFamily: 'Poppins' }}>Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', id: 'about' },
                { label: 'Services', id: 'services' },
                { label: 'How It Works', id: 'how-it-works' },
                { label: 'Contact', id: 'contact' },
              ].map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} onClick={(e) => handleNavClick(e, l.id)} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide" style={{ fontFamily: 'Poppins' }}>Services</h4>
            <ul className="space-y-3">
              {['Savings Accounts', 'Loan Services', 'Digital Platform'].map((l) => (
                <li key={l}><span className="text-gray-400 text-sm">{l}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-5 text-sm tracking-wide" style={{ fontFamily: 'Poppins' }}>Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Stay updated with news and announcements.</p>
            <form className="flex gap-2">
              <input type="email" className="flex-1 px-3 py-2 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Your email" />
              <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:bg-[#1A4A8A]"
                style={{ backgroundColor: '#0A2E5C' }}>
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <p>&copy; 2024 Ma&apos;ed Cooperative Society. All rights reserved.</p>
          <div className="flex gap-6">
            {['LinkedIn', 'Twitter', 'Facebook'].map((s) => (
              <a key={s} href="#" className="hover:text-white transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
