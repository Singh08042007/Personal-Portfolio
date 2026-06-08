'use client';

import React, { useState, useEffect } from 'react';
import { portfolioService } from '@/services/portfolioService';

const screenshots = [
  {
    num: '01',
    title: 'NEURAL DIAGNOSTICS HUB',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrVr0wVSq0pb9yQ87zE9-4R0ykfUIcKrigtDylUiSsQ1Yol-lpg35IekDKo_6Rpi38yhAiud-oUUYMXsqZpEuoqhMGHOPXnKm8JaiXSkEh2LKH3U4LASxMjWe98MGZ3sTtTpXLueRFJaVjNfCzs1c6oW5sSYdrb3idY-MyJfBBw1Wh6I7uYtfQs5wSbWqEs-TkYs-BJJKkF1Qrkjq4RWLbx87bLlt3-TDL6l2CsvMXPS4wiufZeuXhLcKDLqftceJfnRue7RNR-eI',
    alt: 'Neural operating system dashboard displaying brain maps and purple neon data flows.'
  },
  {
    num: '02',
    title: 'CORE ARCHITECTURE MAPPING',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1N96V3u5_3mb04FIFcwDvEXthLYjh0brd0B3bewA9apL245Dn2eAt7t6CIY71y5Nf4gTxsWjeKcUrvuJm-vODhvZf_r6QRB9Nouza5cbIzFCSRcY_SrJ10wls5MEnkYYO43MU2J7rqCo6Lofmpfpi_yXEQna2GibSIVDhXOrUwo5XqTsMiWaicVDuU9nSVicoSW3NpOKyXtPUUvXNkmvm0c7HrCK17qRw81CjvrebMhc9SSa_zdlEUPA7uOSvUw1nI3b8rwKgajY',
    alt: 'Microscopic neural processor chip glowing with electric purple energy.'
  },
  {
    num: '03',
    title: 'PLANETARY CONSCIOUSNESS GRID',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgJUTcaMP_NEQ8LEZWxvU92X0zJkthBMNTMvmyMpIROjF0qT2bJUWkxLtOVlYLH3Kgvnd9DfYPe7GlP0q7UKNUfKDhjtp59BYK3t05ObYX2YPRaleCUS6xxCevJy0907YhILYZoiO49Cc2b2gXmCs0zqegHfjgR7lGSCak1U8DhU9ZBSRLuDk5PExuSmSYjtDRCjSIcXQovcPvrXuR_KX8YAZVDxakeunY3Yfe6DZengfiLs8Pz_quMadjHCAtd2OCJhMIngig8HE',
    alt: 'Global network map with connected data nodes across a dark Earth.'
  }
];

export default function ZanqirPage() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [betaEmail, setBetaEmail] = useState('');
  const [betaStatus, setBetaStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Track page view
  useEffect(() => {
    let visitorId = localStorage.getItem('ds_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('ds_visitor_id', visitorId);
    }
    portfolioService.trackPageView('/zanqir', visitorId);
  }, []);

  const handleNext = () => {
    setCarouselIndex((prev) => (prev + 1) % screenshots.length);
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const handleBetaSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!betaEmail) return;

    setSubmitting(true);
    setBetaStatus({ type: 'idle', message: '' });

    try {
      const res = await portfolioService.submitContactForm({
        name: 'Zanqir Beta Signature',
        email: betaEmail,
        subject: 'Zanqir Beta Sign Up',
        message: 'Requesting early private beta access to cognitive compute nodes.'
      });

      if (res.success) {
        setBetaStatus({ type: 'success', message: 'Neural signature recorded. Early access pending validation.' });
        setBetaEmail('');
      } else {
        setBetaStatus({ type: 'error', message: `Registration failed: ${res.error || 'Unknown network error'}` });
      }
    } catch (err: any) {
      setBetaStatus({ type: 'error', message: `Registration error: ${err.message || err}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background antialiased flex flex-col justify-between">
      {/* Side Navigation Bar (Desktop Only) */}
      <aside className="fixed left-0 top-0 h-full w-64 hidden lg:flex flex-col bg-surface-container-low/40 backdrop-blur-2xl border-r border-white/5 py-6 gap-2 z-40 mt-20">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center border border-primary-fixed/30 overflow-hidden">
              <img 
                alt="Deepinder Singh" 
                className="w-full h-full object-cover" 
                src="https://i.postimg.cc/RhFFpxdP/Round-Profile-image.png"
              />
            </div>
            <div>
              <p className="font-headline-md text-base text-primary-fixed leading-none font-bold">Zanqir</p>
              <p className="font-label-sm text-[10px] text-on-surface-variant opacity-60">Neural Systems</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-1 px-3">
          <a className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-200" href="#dashboard">
            <span className="material-symbols-outlined font-variation-settings-fill">dashboard</span>
            <span className="font-label-md text-sm">Dashboard</span>
          </a>
          <a className="flex items-center gap-3 p-3 rounded-lg bg-primary-container/20 text-primary-fixed border-r-4 border-primary-fixed transition-all duration-200" href="#intelligence">
            <span className="material-symbols-outlined font-variation-settings-fill">psychology</span>
            <span className="font-label-md text-sm">Intelligence</span>
          </a>
          <a className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-200" href="#nexus">
            <span className="material-symbols-outlined">hub</span>
            <span className="font-label-md text-sm">Nexus</span>
          </a>
          <a className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-200" href="#terminal">
            <span className="material-symbols-outlined">terminal</span>
            <span className="font-label-md text-sm">Terminal</span>
          </a>
        </nav>
        <div className="px-3 mt-auto mb-20">
          <a className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all duration-200" href="#settings">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-sm">Settings</span>
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="lg:ml-64 pt-24 min-h-screen px-margin-mobile md:px-margin-desktop pb-20 overflow-hidden flex-grow">
        
        {/* Hero Section: Startup Vision */}
        <section className="max-w-[1200px] mx-auto py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container/20 border border-secondary/30 text-secondary font-label-sm text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-sm font-variation-settings-fill">auto_awesome</span>
                NEURAL STARTUP OF THE YEAR
              </div>
              <h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-gradient-zanqir leading-tight font-extrabold tracking-tight">
                Zanqir: The Future of Cognitive Compute
              </h1>
              <p className="font-body-lg text-lg text-on-surface-variant max-w-xl">
                Revolutionizing human-AI interaction through direct neural integration and distributed intelligence systems. Zanqir isn't just software; it's the bridge to the next stage of human evolution.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#cta"
                  className="btn-premium px-8 py-3.5 rounded-xl font-label-md text-sm font-bold text-on-primary-fixed uppercase tracking-wider text-center"
                >
                  Join Waiting List
                </a>
                <button className="glass-panel px-8 py-3.5 rounded-xl font-label-md text-sm font-bold text-on-surface hover:bg-white/10 transition-colors border border-white/10">
                  Download Pitch
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 bg-secondary/10 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="glass-panel rounded-2xl overflow-hidden p-2.5 neon-glow-purple border border-secondary/20 rotate-3 group hover:rotate-0 transition-transform duration-500">
                <img 
                  className="w-full h-auto rounded-xl" 
                  alt="Zanqir Neural Compute Device"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApWcyl4k2XPupG5ZT9K9Ev7qTH6hWyZoqJ8_PsPs37pefqk5daPxDuBX4c_xpa6RP2F_TFpLV6ikovli44pXP3874RbxWgR27xlz6EQ2ejrLm-zGBrAKBdKUlaB_8twUffqyRARS4uJRNf6_ny_IxAkg3x7uxDM_R9LSv20_HsKBswXS0hHELu1OL1owJ1PQetslA3lXsPKmdT3-y5W2pXGLI_tzcwNvmDphWMV17Y6A9SvBlbMascfpsQZeib8uGlhYuLI8H7K_M" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Bento Grid */}
        <section className="max-w-[1200px] mx-auto mb-20 scroll-mt-24" id="intelligence">
          <div className="text-center mb-12 space-y-2">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface font-bold">Core Technologies</h2>
            <p className="font-body-md text-sm md:text-base text-on-surface-variant max-w-2xl mx-auto opacity-70">
              Engineered with proprietary architectures designed for extreme low-latency and high-density neural data processing.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Synaptic Bridge Card */}
            <div className="md:col-span-2 glass-panel p-8 rounded-2xl border border-primary-fixed/10 neon-border-hover transition-all group">
              <span className="material-symbols-outlined text-4xl text-primary-fixed mb-6 block transition-transform group-hover:scale-110 font-variation-settings-fill">neurology</span>
              <h3 className="font-headline-md text-xl md:text-2xl text-on-surface mb-3 font-bold">Synaptic Bridge V2</h3>
              <p className="font-body-md text-sm md:text-base text-on-surface-variant mb-6 leading-relaxed">
                Our flagship API enables sub-10ms latency communication between biological thought patterns and LLM execution cores. Built on a decentralized fabric that ensures total privacy and data sovereignty.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3.5 py-1 bg-primary-container/10 rounded-full text-primary-fixed text-xs font-semibold border border-primary-fixed/20">99.9% Sync Accuracy</span>
                <span className="px-3.5 py-1 bg-primary-container/10 rounded-full text-primary-fixed text-xs font-semibold border border-primary-fixed/20">End-to-End Encryption</span>
              </div>
            </div>
            
            {/* Nexus Grid Card */}
            <div className="glass-panel p-8 rounded-2xl border border-secondary/10 neon-border-hover transition-all group flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-4xl text-secondary mb-6 block transition-transform group-hover:scale-110 font-variation-settings-fill">hub</span>
                <h3 className="font-headline-md text-xl md:text-2xl text-on-surface mb-3 font-bold">Nexus Grid</h3>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                  Connect multiple consciousness streams into a single workspace for unprecedented collaborative problem-solving.
                </p>
              </div>
              <div className="mt-6">
                <span className="px-3 py-1 bg-secondary-container/10 rounded-full text-secondary text-xs font-semibold border border-secondary/20">Shared Neural Nodes</span>
              </div>
            </div>

            {/* Small Grid Items */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 neon-border-hover transition-all group">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-4 block group-hover:text-primary-fixed font-variation-settings-fill">terminal</span>
              <h4 className="font-headline-sm text-base text-on-surface mb-1 font-bold">Void Terminal</h4>
              <p className="font-label-md text-xs text-on-surface-variant opacity-60">Zero-UI command interface for pure thought execution.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 neon-border-hover transition-all group">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-4 block group-hover:text-secondary font-variation-settings-fill">security</span>
              <h4 className="font-headline-sm text-base text-on-surface mb-1 font-bold">Guardian Protocol</h4>
              <p className="font-label-md text-xs text-on-surface-variant opacity-60">Real-time firewall for neural signal interference.</p>
            </div>
            <div className="glass-panel p-6 rounded-2xl border border-white/5 neon-border-hover transition-all group">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant mb-4 block group-hover:text-primary-fixed font-variation-settings-fill">rocket_launch</span>
              <h4 className="font-headline-sm text-base text-on-surface mb-1 font-bold">Orbit Deploy</h4>
              <p className="font-label-md text-xs text-on-surface-variant opacity-60">Instant scaling for planetary-scale consciousness nodes.</p>
            </div>
          </div>
        </section>

        {/* Screenshots Gallery - Interactive Carousel */}
        <section className="max-w-[1200px] mx-auto py-16 scroll-mt-24">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-headline-lg text-3xl text-on-surface font-bold">Interface Blueprints</h2>
              <p className="font-body-md text-sm text-on-surface-variant opacity-70 mt-1">A glimpse into the Zanqir Ecosystem UI.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors bg-surface-container-low/40"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors bg-surface-container-low/40"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden w-full rounded-2xl border border-white/10 glass-panel p-4">
            <div className="relative aspect-video max-h-[550px] w-full rounded-xl overflow-hidden bg-black/80 flex items-center justify-center">
              <img 
                src={screenshots[carouselIndex].img} 
                alt={screenshots[carouselIndex].title} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
            <div className="p-4 bg-surface-container-lowest/60 rounded-b-xl border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center mt-2">
              <div>
                <p className="font-label-md text-xs text-primary-fixed tracking-wider font-bold">
                  {screenshots[carouselIndex].num} — {screenshots[carouselIndex].title}
                </p>
                <p className="font-body-md text-xs text-on-surface-variant mt-1">
                  {screenshots[carouselIndex].alt}
                </p>
              </div>
              <div className="mt-2 md:mt-0 flex gap-1">
                {screenshots.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${carouselIndex === idx ? 'bg-primary-fixed w-6' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Beta CTA Section */}
        <section className="max-w-[1200px] mx-auto py-16 scroll-mt-24" id="cta">
          <div className="glass-panel rounded-3xl p-8 md:p-16 flex flex-col items-center text-center space-y-6 border-2 border-secondary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/5 to-secondary/5 pointer-events-none"></div>
            <div className="relative z-10 w-full max-w-2xl">
              <h2 className="font-display-lg text-3xl md:text-5xl text-on-surface mb-3 font-extrabold tracking-tight">Ready to transcend?</h2>
              <p className="font-body-lg text-base md:text-lg text-on-surface-variant mb-8 leading-relaxed">
                Join the waiting list for the next phase of the Zanqir Private Beta. Experience the pinnacle of neural engineering.
              </p>
              
              <form onSubmit={handleBetaSignup} className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-md mx-auto">
                <input 
                  type="email"
                  value={betaEmail}
                  onChange={(e) => setBetaEmail(e.target.value)}
                  placeholder="Enter neural signature (email)" 
                  className="flex-1 bg-surface-container-low border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none text-sm transition-all search-glow"
                  required
                  disabled={submitting}
                />
                <button 
                  type="submit"
                  disabled={submitting}
                  className="btn-premium px-8 py-3 rounded-xl font-label-md text-xs font-bold text-on-primary-fixed uppercase tracking-wider whitespace-nowrap disabled:opacity-50"
                >
                  {submitting ? 'Initializing...' : 'Initialize Access'}
                </button>
              </form>

              {betaStatus.message && (
                <p className={`mt-4 text-xs font-semibold ${betaStatus.type === 'success' ? 'text-primary-fixed' : 'text-error'}`}>
                  {betaStatus.message}
                </p>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-container-lowest border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="font-headline-sm text-lg text-on-surface mb-1 font-bold">ZANQIR</div>
            <p className="font-label-sm text-xs text-on-surface-variant opacity-60">© 2024 DEEPINDER SINGH. BUILT FOR THE NEURAL AGE.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <a className="text-on-surface-variant font-label-sm text-xs hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100" href="https://www.linkedin.com/in/deepinder-singh-april2007/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="text-on-surface-variant font-label-sm text-xs hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100" href="https://github.com/Singh08042007" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="text-on-surface-variant font-label-sm text-xs hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100" href="https://www.instagram.com/deep__cheema__2007/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="text-on-surface-variant font-label-sm text-xs hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100" href="https://www.youtube.com/@cheema3364" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a className="text-on-surface-variant font-label-sm text-xs hover:text-primary-fixed transition-colors opacity-80 hover:opacity-100" href="https://www.hackerrank.com/profile/Singh2007" target="_blank" rel="noopener noreferrer">HackerRank</a>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></div>
            <span className="font-label-sm text-[10px] text-primary-fixed font-bold uppercase tracking-wider">SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
