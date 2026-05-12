'use client';

import SectionTitle from '@/components/landing/ui/SectionTitle';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 md:py-32 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <SectionTitle eyebrow="Reach Out" title="Get in Touch"
          subtitle="Have questions? We're here to help and guide you every step of the way." />

        <form className="space-y-6 bg-gray-50/60 rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0A2E5C] focus:ring-2 focus:ring-[#0A2E5C]/10 text-sm transition-all" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0A2E5C] focus:ring-2 focus:ring-[#0A2E5C]/10 text-sm transition-all" placeholder="john@university.edu" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0A2E5C] focus:ring-2 focus:ring-[#0A2E5C]/10 text-sm transition-all" placeholder="How can we help?" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#0A2E5C] focus:ring-2 focus:ring-[#0A2E5C]/10 text-sm resize-none transition-all" rows={5} placeholder="Tell us more about your inquiry..." />
          </div>
          <button type="submit" className="w-full py-3.5 px-6 text-white font-semibold rounded-xl transition-all hover:shadow-xl btn-shine"
            style={{ backgroundColor: '#0A2E5C' }}>
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
