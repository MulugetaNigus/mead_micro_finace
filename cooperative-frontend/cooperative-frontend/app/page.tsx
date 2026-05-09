'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/lib/store/hooks';
import { ROUTES } from '@/constants/app';
import AnimatedLineChart from '@/components/AnimatedLineChart';

const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), { ssr: false });

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
        
        if (isVisible && !visibleElements.has(el.id)) {
          const animateClass = el.getAttribute('data-animate');
          el.classList.add(animateClass || 'animate-scroll-in-bottom');
          setVisibleElements(prev => new Set(prev).add(el.id));
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleElements]);

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
      {/* Navigation Header */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${isScrolled ? 'nav-blur shadow-md border-gray-100' : 'bg-white border-gray-50'}`}>
        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0A2E5C' }}>
              <span className="text-white font-bold text-base" style={{ fontFamily: 'Poppins' }}>M</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Poppins' }}>Ma&apos;ed</span>
              <span className="text-xs text-gray-500">Cooperative</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              About Us
            </a>
            <a href="#services" onClick={(e) => handleScroll(e, 'services')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Services
            </a>
            <a href="#how-it-works" onClick={(e) => handleScroll(e, 'how-it-works')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Process
            </a>
            <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSignIn}
              className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-lg text-gray-700 hover:border-gray-400 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={handleSignIn}
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-lg"
              style={{ backgroundColor: '#0A2E5C' }}
            >
              {mounted && isAuthenticated ? 'Dashboard' : 'Get Started'}
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative py-28 px-6 overflow-hidden bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in-up" data-animate="animate-slide-in-left" id="hero-content">
              <div className="mb-8">
                <div className="inline-block px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
                  <span className="text-xs font-semibold text-gray-700">Financial Cooperative for University Staff</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Poppins' }}>
                  Smart Savings,
                  <br />
                  Secure Future
                </h1>
                <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-xl">
                  Ma&apos;ed Cooperative delivers transparent financial solutions with competitive returns, flexible lending, and institutional-grade security for Woldia University community.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={handleSignIn}
                  className="px-8 py-3 text-base font-semibold text-white rounded-lg transition-all hover:shadow-lg hover:scale-105"
                  style={{ backgroundColor: '#0A2E5C' }}
                >
                  Open Account
                </button>
                <button
                  className="px-8 py-3 text-base font-semibold text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Learn More
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins' }}>500+</div>
                  <p className="text-sm text-gray-600">Active Members</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'Poppins' }}>7%</div>
                  <p className="text-sm text-gray-600">Monthly Return Rate</p>
                </div>
              </div>
            </div>

            {/* Right Analytics - Animated Chart */}
            <div className="relative h-96 md:h-full min-h-96 flex items-center justify-center" data-animate="animate-slide-in-right" id="hero-analytics">
              <div className="relative w-full h-full">
                <AnimatedLineChart />

                {/* Floating Stats Card */}
                <div className="absolute bottom-6 left-6 bg-white rounded-xl p-6 shadow-xl" style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  width: '240px',
                  boxShadow: '0 20px 40px rgba(10, 46, 92, 0.12)'
                }}>
                  <div className="text-sm text-gray-600 mb-2">Total Member Savings</div>
                  <div className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>ETB 5M+</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-600">Growth</span>
                      <span className="font-semibold text-gray-900">+18%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: '#0A2E5C' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-animate="animate-scroll-in-top" id="about-title">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              About Ma&apos;ed Cooperative
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '3px',
                width: '50px',
                backgroundColor: '#0A2E5C',
                borderRadius: '2px',
              }} />
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Established to serve the financial needs of Woldia University staff with integrity, transparency, and innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Mission & Vision */}
            <div className="space-y-8" data-animate="animate-slide-in-left" id="mission-vision">
              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Mission</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>Empower Through Finance</h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide accessible, transparent, and reliable financial services that enable university staff to build wealth and secure their futures.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
                <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Vision</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>Financial Dignity</h3>
                <p className="text-gray-700 leading-relaxed">
                  To become the trusted financial partner for university staff, recognized for excellence in service delivery and member satisfaction.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div className="space-y-4" data-animate="animate-slide-in-right" id="core-values">
              {[
                { label: 'Transparency', desc: 'Open communication and honest operations in all transactions' },
                { label: 'Community', desc: 'Supporting collective growth and member welfare' },
                { label: 'Innovation', desc: 'Embracing digital solutions for member convenience' },
                { label: 'Reliability', desc: 'Consistent performance and institutional stability' },
              ].map((value, idx) => (
                <div key={idx} className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>{value.label}</h4>
                  <p className="text-sm text-gray-700">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-animate="animate-scroll-in-top" id="services-title">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Our Services
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '3px',
                width: '50px',
                backgroundColor: '#0A2E5C',
                borderRadius: '2px',
              }} />
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Comprehensive financial solutions designed for university staff
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Savings Accounts',
                description: 'Flexible deposit options with competitive interest rates. Build wealth through regular or voluntary savings with guaranteed returns.',
                icon: '💾',
              },
              {
                title: 'Loan Services',
                description: 'Quick, transparent lending with minimal documentation. Competitive rates and flexible repayment schedules tailored to your needs.',
                icon: '📊',
              },
              {
                title: 'Digital Management',
                description: 'Secure online platform for account management, transactions, and document handling. 24/7 access to your financial information.',
                icon: '🔒',
              },
            ].map(({ title, description, icon }, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow" data-animate="animate-scroll-in-bottom" id={`service-${idx}`}>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>
                  {title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-animate="animate-scroll-in-top" id="process-title">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Getting Started
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '3px',
                width: '50px',
                backgroundColor: '#0A2E5C',
                borderRadius: '2px',
              }} />
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Simple steps to join our cooperative community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Registration',
                description: 'Complete online registration with basic information and university verification',
              },
              {
                step: 2,
                title: 'Account Setup',
                description: 'Establish your savings account and set up secure login credentials',
              },
              {
                step: 3,
                title: 'Start Saving',
                description: 'Begin deposits and access all cooperative benefits and services',
              },
            ].map(({ step, title, description }, idx) => (
              <div key={idx} className="relative" data-animate="animate-scroll-in-bottom" id={`process-${idx}`}>
                <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 h-full">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#0A2E5C', fontFamily: 'Poppins' }}>
                      {step}
                    </div>
                    {idx < 2 && (
                      <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">→</div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>{title}</h3>
                  <p className="text-sm text-gray-700">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 px-6" style={{ backgroundColor: '#0A2E5C' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '500+', label: 'Active Members' },
              { value: 'ETB 5M+', label: 'Assets Under Management' },
              { value: '7%', label: 'Annual Return Rate' },
              { value: '99%', label: 'Member Satisfaction' },
            ].map((stat, idx) => (
              <div key={idx} className="text-white" data-animate="animate-scroll-in-bottom" id={`stat-${idx}`}>
                <div className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Poppins' }}>{stat.value}</div>
                <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-animate="animate-scroll-in-top" id="location-title">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Visit Us
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '3px',
                width: '50px',
                backgroundColor: '#0A2E5C',
                borderRadius: '2px',
              }} />
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Located at Woldia University, we welcome members during business hours
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Map */}
            <div className="rounded-lg overflow-hidden shadow-lg" style={{
              boxShadow: '0 15px 50px rgba(10, 46, 92, 0.1)',
              borderRadius: '12px',
              height: '400px'
            }} data-animate="animate-slide-in-left" id="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3921.8597653242516!2d39.61!3d11.86!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164aad2da50e2621%3A0x1!2sWoldia%20University!5e0!3m2!1sen!2set!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Contact Details */}
            <div className="space-y-6" data-animate="animate-slide-in-right" id="location-details">
              <div className="bg-white rounded-lg p-8 border border-gray-200 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>Main Office</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Woldia, Ethiopia<br />
                    Woldia University Compound<br />
                    Zone 3, North Wollo Region
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Office Hours</p>
                  <p className="text-sm text-gray-900 font-medium">Monday - Friday</p>
                  <p className="text-xs text-gray-600">8:00 AM - 5:00 PM</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Phone</p>
                  <p className="text-sm text-gray-900 font-medium">+251 (0) XXX XXX</p>
                  <p className="text-xs text-gray-600">Weekdays 9AM-4PM</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Email</p>
                  <p className="text-sm text-gray-900 font-medium">info@maedcoop.et</p>
                  <p className="text-xs text-gray-600">24-hour response</p>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Staff</p>
                  <p className="text-sm text-gray-900 font-medium">5+ Professionals</p>
                  <p className="text-xs text-gray-600">Dedicated Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12" data-animate="animate-scroll-in-top" id="contact-title">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
              Get in Touch
            </h2>
            <div className="flex justify-center mb-6">
              <div style={{
                height: '3px',
                width: '50px',
                backgroundColor: '#0A2E5C',
                borderRadius: '2px',
              }} />
            </div>
            <p className="text-lg text-gray-700">
              Have questions? We&apos;re here to help
            </p>
          </div>

          <form className="space-y-6 bg-gray-50 rounded-lg p-8 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 text-sm resize-none"
                rows={5}
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-all hover:shadow-lg"
              style={{ backgroundColor: '#0A2E5C' }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6" style={{ backgroundColor: '#051E3A' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            {/* Logo & Description */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0A2E5C' }}>
                  <span className="text-white font-bold text-sm" style={{ fontFamily: 'Poppins' }}>M</span>
                </div>
                <span className="font-semibold text-white text-sm" style={{ fontFamily: 'Poppins' }}>Ma&apos;ed</span>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Serving university staff with transparent and reliable financial solutions since establishment.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: 'Poppins' }}>Navigation</h4>
              <ul className="space-y-3">
                <li><a href="#about" className="text-blue-100 hover:text-white text-sm transition-colors">About Us</a></li>
                <li><a href="#services" className="text-blue-100 hover:text-white text-sm transition-colors">Services</a></li>
                <li><a href="#how-it-works" className="text-blue-100 hover:text-white text-sm transition-colors">How It Works</a></li>
                <li><a href="#contact" className="text-blue-100 hover:text-white text-sm transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: 'Poppins' }}>Services</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Savings Accounts</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Loan Services</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Account Management</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: 'Poppins' }}>Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="text-blue-100 hover:text-white text-sm transition-colors">Compliance</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-semibold text-white mb-4 text-sm" style={{ fontFamily: 'Poppins' }}>Newsletter</h4>
              <p className="text-blue-100 text-sm mb-4">Stay updated with news and announcements</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  className="flex-1 px-3 py-2 rounded text-sm bg-blue-900 border border-blue-800 text-white placeholder-blue-200 focus:outline-none"
                  placeholder="Your email"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded text-sm font-medium text-white transition-all hover:bg-blue-700"
                  style={{ backgroundColor: '#0A2E5C' }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-blue-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-blue-100 text-sm">
            <p>&copy; 2024 Ma&apos;ed Cooperative Society. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="hover:text-white transition-colors">Twitter</a>
              <a href="#" className="hover:text-white transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      {mounted && showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
