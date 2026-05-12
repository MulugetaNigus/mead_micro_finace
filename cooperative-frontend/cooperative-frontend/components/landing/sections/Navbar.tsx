'use client';

import { scrollToId } from '@/components/landing/utils';

interface NavbarProps {
  isScrolled: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  handleSignIn: () => void;
  mounted: boolean;
  isAuthenticated: boolean;
}

export default function Navbar({ isScrolled, mobileOpen, setMobileOpen, handleSignIn, mounted, isAuthenticated }: NavbarProps) {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToId(id);
  };

  const navLinks = [
    { label: 'About Us', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Process', id: 'how-it-works' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'nav-glass shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: '#0A2E5C' }}>
            <span className="text-white font-bold text-base" style={{ fontFamily: 'Poppins' }}>M</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 text-sm leading-none" style={{ fontFamily: 'Poppins' }}>Ma&apos;ed</span>
            <span className="text-[11px] text-gray-500 leading-tight">Cooperative</span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => handleNavClick(e, l.id)}
              className="relative text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors py-1 group">
              {l.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 rounded-full bg-[#0A2E5C] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSignIn} className="hidden sm:block px-5 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all">
            Sign In
          </button>
          <button onClick={handleSignIn} className="px-5 py-2 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-xl btn-shine"
            style={{ backgroundColor: '#0A2E5C' }}>
            {mounted && isAuthenticated ? 'Dashboard' : 'Get Started'}
          </button>
          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 px-6 py-4 space-y-3 animate-fade-in-up">
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`} onClick={(e) => handleNavClick(e, l.id)} className="block text-sm font-medium text-gray-700 hover:text-[#0A2E5C] transition-colors py-2">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
