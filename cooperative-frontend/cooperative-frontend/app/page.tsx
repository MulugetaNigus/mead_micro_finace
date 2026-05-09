'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/lib/store/hooks';
import { ROUTES } from '@/constants/app';

const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), { ssr: false });

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignIn = () => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    } else {
      setShowModal(true);
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm transition-all">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#0A2E5C' }}>
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Poppins' }}>M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Poppins' }}>Ma&apos;ed</span>
              <span className="text-xs text-gray-600">Cooperative</span>
            </div>
          </div>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-12">
            <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              About
            </a>
            <a href="#services" onClick={(e) => handleScroll(e, 'services')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Services
            </a>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              How It Works
            </a>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSignIn}
              className="px-4 py-2 text-sm font-semibold border-2 rounded-lg transition-all"
              style={{
                borderColor: '#0A2E5C',
                color: '#0A2E5C',
              }}
            >
              Member Login
            </button>
            <button
              onClick={handleSignIn}
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
              style={{ backgroundColor: '#0A2E5C' }}
            >
              {mounted && isAuthenticated ? 'Dashboard' : 'Join Now'}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #009A44 0%, transparent 50%), radial-gradient(circle at 80% 80%, #FEDD00 0%, transparent 50%)',
        }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#009A44', borderRadius: '2px' }} />
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#FEDD00', borderRadius: '2px' }} />
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#DA291C', borderRadius: '2px' }} />
                </div>
                <span className="text-xs font-semibold text-gray-700">Ma&apos;ed Cooperative</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
                Your Savings.
                <br />
                Your Future.
                <br />
                <span style={{ color: '#0A2E5C' }}>Digitally Secured.</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-xl">
                Ma&apos;ed Cooperative brings transparent savings, easy loans, and smart financial management to Woldia University staff—all in one modern platform.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleSignIn}
                  className="px-8 py-3 text-base font-semibold text-white rounded-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: '#0A2E5C' }}
                >
                  Get Started
                </button>
                <a
                  href="#about"
                  onClick={(e) => handleScroll(e, 'about')}
                  className="px-8 py-3 text-base font-semibold border-2 rounded-lg transition-colors"
                  style={{
                    borderColor: '#0A2E5C',
                    color: '#0A2E5C',
                  }}
                >
                  Learn More
                </a>
              </div>
              <div className="flex gap-8 mt-12">
                <div>
                  <div className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>500+</div>
                  <div className="text-sm text-gray-600">Active Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>7%</div>
                  <div className="text-sm text-gray-600">Monthly Interest</div>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative h-96 md:h-full min-h-96 flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 rounded-3xl" style={{
                  backgroundColor: '#0A2E5C',
                  opacity: 0.1,
                  transform: 'rotate(6deg)',
                }} />
                <div className="absolute inset-8 rounded-3xl bg-white border-2" style={{ borderColor: '#0A2E5C' }}>
                  <div className="h-full flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 rounded-full mb-6" style={{ backgroundColor: '#009A44', opacity: 0.1 }} />
                    <div className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>ETB 5M+</div>
                    <div className="text-gray-600 text-center">Total Savings Managed</div>
                    <div className="mt-8 w-full">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: '#009A44' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Who We Are
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '4px',
                width: '60px',
                backgroundColor: '#009A44',
                borderRadius: '2px',
              }} />
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Ma&apos;ed Basic Money and Saving Credit Cooperative Society is dedicated to empowering Woldia University staff through transparent, accessible financial services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: History */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>Our Story</h3>
                <p className="text-gray-700 leading-relaxed">
                  Founded to serve the unique financial needs of Woldia University employees, Ma&apos;ed Cooperative has grown to become a trusted financial partner, managing over ETB 5 million in collective savings and providing fair-priced loans to qualified members.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To promote financial inclusion, savings culture, and sustainable economic empowerment within the Woldia University community through innovative, digital-first solutions.
                </p>
              </div>
            </div>

            {/* Right: Values */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: '✓', title: 'Transparency', desc: 'Complete visibility into all financial activities' },
                { icon: '👥', title: 'Community', desc: 'Serving our members with dedication and care' },
                { icon: '⚡', title: 'Innovation', desc: 'Modern technology for seamless experiences' },
                { icon: '🛡️', title: 'Reliability', desc: 'Secure, stable financial management' },
              ].map(({ icon, title, desc }, idx) => (
                <div key={idx} className="p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>{title}</h4>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Modern Cooperative, Digital Convenience
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '4px',
                width: '60px',
                backgroundColor: '#0A2E5C',
                borderRadius: '2px',
              }} />
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Comprehensive financial solutions designed specifically for our members
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Savings Management',
                description: 'Regular & voluntary deposits, real-time balance, 7% monthly interest on your savings.',
                icon: '💰',
                color: '#009A44',
              },
              {
                title: 'Smart Loan Services',
                description: 'Online application, automatic eligibility checks, fast approval within 5 days, and flexible repayment.',
                icon: '📋',
                color: '#FEDD00',
              },
              {
                title: 'Member Dashboard',
                description: 'Complete profile, transaction history, loan tracking, and secure document uploads.',
                icon: '📊',
                color: '#DA291C',
              },
            ].map(({ title, description, icon, color }, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow group">
                <div className="text-5xl mb-6">{icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
                  {title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-6">{description}</p>
                <button
                  className="text-sm font-semibold transition-colors"
                  style={{ color: color }}
                >
                  Learn More →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Join in Three Simple Steps
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '4px',
                width: '60px',
                backgroundColor: '#0A2E5C',
                borderRadius: '2px',
              }} />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines */}
            <div className="hidden md:block absolute top-20 left-1/3 right-1/3 h-1 bg-gradient-to-r from-gray-300 via-gray-300 to-gray-300" style={{ top: '80px' }} />

            {[
              {
                step: '1',
                title: 'Register Online',
                description: 'Fill out the membership form, sign consent for salary deduction, and purchase your initial shares.',
              },
              {
                step: '2',
                title: 'Start Saving',
                description: 'Receive your account, make deposits, and watch your savings grow with 7% monthly interest.',
              },
              {
                step: '3',
                title: 'Apply for a Loan',
                description: 'After 6 months of membership, apply online, upload documents, and get approved quickly.',
              },
            ].map(({ step, title, description }, idx) => (
              <div key={idx} className="relative">
                <div className="text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl"
                    style={{ backgroundColor: '#0A2E5C' }}
                  >
                    {step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>
                    {title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#0A2E5C' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: '1,200+', label: 'Members Served' },
              { value: 'ETB 5M+', label: 'Total Savings' },
              { value: 'ETB 2.5M+', label: 'Loans Disbursed' },
              { value: '98%', label: 'Satisfaction Rate' },
            ].map(({ value, label }, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Poppins' }}>
                  {value}
                </div>
                <p className="text-gray-300">{label}</p>
                <div className="flex justify-center mt-4">
                  <div style={{
                    height: '3px',
                    width: '40px',
                    backgroundColor: '#009A44',
                    borderRadius: '2px',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins' }}>
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-lg text-gray-700 mb-10 leading-relaxed">
            Join hundreds of Woldia University staff members who are growing their savings and building financial security through Ma&apos;ed Cooperative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              onClick={handleSignIn}
              className="px-8 py-4 text-lg font-semibold text-white rounded-lg transition-transform hover:scale-105"
              style={{ backgroundColor: '#0A2E5C' }}
            >
              Create Account
            </button>
            <button
              className="px-8 py-4 text-lg font-semibold border-2 rounded-lg transition-colors"
              style={{
                borderColor: '#0A2E5C',
                color: '#0A2E5C',
              }}
            >
              Talk to an Officer
            </button>
          </div>
          <p className="text-gray-600">
            Already a member?{' '}
            <button
              onClick={handleSignIn}
              className="font-semibold transition-colors"
              style={{ color: '#0A2E5C' }}
            >
              Login
            </button>
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Get in Touch
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '4px',
                width: '60px',
                backgroundColor: '#009A44',
                borderRadius: '2px',
              }} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
                  Office Information
                </h3>
              </div>

              {[
                { label: 'Address', value: 'Woldia, Ethiopia\nWoldia University Compound', icon: '📍' },
                { label: 'Phone', value: '+251 (0) XXX XXX XXX', icon: '📞' },
                { label: 'Email', value: 'info@maedcoop.et', icon: '✉️' },
                { label: 'Hours', value: 'Monday - Friday\n8:00 AM - 5:00 PM', icon: '🕒' },
              ].map(({ label, value, icon }, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="text-3xl">{icon}</div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{label}</p>
                    <p className="text-gray-700 whitespace-pre-line">{value}</p>
                  </div>
                </div>
              ))}

              {/* Social Links */}
              <div className="pt-4">
                <p className="font-semibold text-gray-900 mb-4">Follow Us</p>
                <div className="flex gap-4">
                  {['f', 't', 'in'].map((social, idx) => (
                    <button
                      key={idx}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-transform hover:scale-110"
                      style={{ backgroundColor: '#0A2E5C' }}
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: 'Poppins' }}>
                Send us a Message
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" style={{ '--tw-ring-color': '#0A2E5C' } as any} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2" style={{ '--tw-ring-color': '#0A2E5C' } as any} placeholder="Your email" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                  <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 resize-none" style={{ '--tw-ring-color': '#0A2E5C' } as any} rows={4} placeholder="Your message" />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 text-white font-semibold rounded-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: '#0A2E5C' }}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ backgroundColor: '#051E3A' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 mb-8 pb-8 border-b border-gray-700">
            {/* Column 1: Logo & Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
                  <span className="text-gray-900 font-bold" style={{ fontFamily: 'Poppins' }}>M</span>
                </div>
                <span className="font-bold text-white" style={{ fontFamily: 'Poppins' }}>Ma&apos;ed</span>
              </div>
              <p className="text-sm text-gray-400">
                Empowering Woldia University staff through modern financial cooperation.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h4 className="font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cooperative Rules</a></li>
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h4 className="font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Woldia, Ethiopia</li>
                <li>+251 (0) XXX XXX XXX</li>
                <li>info@maedcoop.et</li>
              </ul>
            </div>

            {/* Column 5: Newsletter */}
            <div>
              <h4 className="font-bold text-white mb-4" style={{ fontFamily: 'Poppins' }}>Newsletter</h4>
              <p className="text-sm text-gray-400 mb-3">Subscribe for updates</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-lg text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-white font-semibold rounded-lg transition-colors"
                  style={{ backgroundColor: '#009A44' }}
                >
                  →
                </button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center pt-8">
            <div className="flex justify-center gap-4 mb-4">
              <div style={{ height: '2px', width: '30px', backgroundColor: '#009A44' }} />
              <div style={{ height: '2px', width: '30px', backgroundColor: '#FEDD00' }} />
              <div style={{ height: '2px', width: '30px', backgroundColor: '#DA291C' }} />
            </div>
            <p className="text-sm text-gray-400">
              © {mounted ? new Date().getFullYear() : '2026'} Ma&apos;ed Basic Money and Saving Credit Cooperative Society. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
