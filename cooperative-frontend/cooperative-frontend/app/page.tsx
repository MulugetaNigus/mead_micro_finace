'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useAppSelector } from '@/lib/store/hooks';
import { ROUTES } from '@/constants/app';

import Navbar from '@/components/landing/sections/Navbar';
import HeroSection from '@/components/landing/sections/HeroSection';
import AboutSection from '@/components/landing/sections/AboutSection';
import ServicesSection from '@/components/landing/sections/ServicesSection';
import ProcessSection from '@/components/landing/sections/ProcessSection';
import StatsSection from '@/components/landing/sections/StatsSection';
import TestimonialsSection from '@/components/landing/sections/TestimonialsSection';
import CTASection from '@/components/landing/sections/CTASection';
import LocationSection from '@/components/landing/sections/LocationSection';
import ContactSection from '@/components/landing/sections/ContactSection';
import FooterSection from '@/components/landing/sections/FooterSection';

const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), { ssr: false });

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignIn = useCallback(() => {
    if (isAuthenticated) router.push(ROUTES.DASHBOARD);
    else setShowModal(true);
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-white relative">
      {/* ── Floating blur orbs (hero only) ── */}
      <div className="absolute top-0 left-0 w-full h-[900px] overflow-hidden pointer-events-none z-0">
        <div className="blur-orb float-orb" style={{ width: 400, height: 400, background: 'rgba(10,46,92,0.07)', top: -80, left: '10%' }} />
        <div className="blur-orb float-orb-2" style={{ width: 300, height: 300, background: 'rgba(0,184,212,0.08)', top: 120, right: '5%' }} />
        <div className="blur-orb float-orb-3" style={{ width: 250, height: 250, background: 'rgba(0,200,83,0.05)', top: 400, left: '40%' }} />
      </div>

      <Navbar
        isScrolled={isScrolled}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        handleSignIn={handleSignIn}
        mounted={mounted}
        isAuthenticated={isAuthenticated}
      />
      <HeroSection handleSignIn={handleSignIn} />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection handleSignIn={handleSignIn} />
      <LocationSection />
      <ContactSection />
      <FooterSection />

      {/* Auth Modal */}
      {mounted && showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
