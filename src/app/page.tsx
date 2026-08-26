'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ParticleBackground from '@/components/ParticleBackground';
import InitializingScreen from '@/components/InitializingScreen';
import { portfolioService, Achievement, Project, TimelineEvent, Profile } from '@/services/portfolioService';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const router = useRouter();
  const [secretClicks, setSecretClicks] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleSecretClick = () => {
    setSecretClicks((prev) => {
      const newClicks = prev + 1;
      if (newClicks >= 10) {
        router.push('/admin');
        return 0;
      }
      return newClicks;
    });
  };

  // Database states
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // System HUD states
  const [coreTemp, setCoreTemp] = useState(42);
  const [systemLoad, setSystemLoad] = useState(14);
  const [pingRate, setPingRate] = useState(18);
  const [authStatus, setAuthStatus] = useState('SECURED');
  const [activeSection, setActiveSection] = useState('hero');

  // Interactive Timeline and Projects Slider state
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  const navSections = [
    { id: 'hero', label: 'Overview' },
    { id: 'about', label: 'Research' },
    { id: 'skills', label: 'Expertise' },
    { id: 'experience', label: 'Timeline' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'contact', label: 'Contact' },
  ];

  // Auto-slide Featured Projects every 5 seconds
  useEffect(() => {
    if (featuredProjects.length <= 1) return;
    const interval = setInterval(() => {
      setActiveProjectIndex((prev) => (prev + 1) % featuredProjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredProjects.length]);

  // Form states
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Track page view and fetch data
  useEffect(() => {
    // Generate simple visitor session id
    let visitorId = localStorage.getItem('ds_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('ds_visitor_id', visitorId);
    }
    
    portfolioService.trackPageView('/', visitorId);

    async function loadData() {
      try {
        const [achData, projData, timelineData, profileData] = await Promise.all([
          portfolioService.getAchievements(),
          portfolioService.getProjects(),
          portfolioService.getTimelineEvents(),
          portfolioService.getProfile(),
        ]);
        setAchievements(achData);
        setFeaturedProjects(projData.filter((p) => p.featured));
        setTimelineEvents(timelineData);
        if (profileData && profileData.avatar_url) {
          if (profileData.avatar_url.includes('lh3.googleusercontent.com')) {
            setProfileImageUrl("https://i.postimg.cc/RhFFpxdP/Round-Profile-image.png");
          } else {
            setProfileImageUrl(profileData.avatar_url);
          }
        } else {
          setProfileImageUrl("https://i.postimg.cc/RhFFpxdP/Round-Profile-image.png");
        }
      } catch (err) {
        console.error('Failed to load portfolio homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Live System Metrics Updates
  useEffect(() => {
    // 1. Core Temp & System Load fluctuations
    const statsInterval = setInterval(() => {
      setCoreTemp(prev => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.min(46, Math.max(38, prev + delta));
      });
      setSystemLoad(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.min(25, Math.max(5, prev + delta));
      });
    }, 3000);

    // 2. Measure actual network ping rate
    const measurePing = async () => {
      try {
        const start = performance.now();
        await fetch('/?t=' + Date.now(), { method: 'HEAD', cache: 'no-store' });
        const latency = Math.round(performance.now() - start);
        setPingRate(latency);
      } catch (e) {
        setPingRate(Math.floor(Math.random() * 10) + 12);
      }
    };

    measurePing();
    const pingInterval = setInterval(measurePing, 5000);

    // 3. Auth status connection
    const checkAuthStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setAuthStatus('ADMIN');
        } else {
          setAuthStatus('SECURED');
        }
      } catch (e) {
        setAuthStatus('OFFLINE');
      }
    };
    checkAuthStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setAuthStatus('ADMIN');
      } else {
        setAuthStatus('SECURED');
      }
    });

    return () => {
      clearInterval(statsInterval);
      clearInterval(pingInterval);
      subscription.unsubscribe();
    };
  }, []);

  const isScrollingRef = React.useRef(false);

  // Luxurious smooth animation frame scroll helper (1000ms duration with soft cubic easing)
  const smoothScrollTo = (targetId: string, duration = 1000, onComplete?: () => void) => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      if (onComplete) onComplete();
      return;
    }

    const startY = window.scrollY;
    const targetY = targetElement.getBoundingClientRect().top + startY;
    const distance = targetY - startY;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);

      // Soft Ease In Out Cubic for gentle gliding section transitions
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo(0, targetY);
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(animation);
  };

  // Strictly Single-Scroll Section Wheel Engine with Inertia Lock
  useEffect(() => {
    const sections = ['hero', 'about', 'skills', 'experience', 'achievements', 'projects', 'contact'];

    const handleWheel = (e: WheelEvent) => {
      // Allow natural touch & momentum scrolling on mobile viewports
      if (window.innerWidth < 768) return;

      const target = e.target as HTMLElement;
      if (target.closest('textarea') || target.closest('input')) return;

      // Always prevent default native scroll momentum on desktop to avoid jitter
      e.preventDefault();

      // STRICT LOCK: If already animating or in inertia cooldown, IGNORE all extra wheel ticks
      if (isScrollingRef.current) return;

      if (Math.abs(e.deltaY) < 15) return;

      const currentScroll = window.scrollY;
      let currentIdx = 0;
      let minDistance = Infinity;

      sections.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const dist = Math.abs(currentScroll - top);
          if (dist < minDistance) {
            minDistance = dist;
            currentIdx = idx;
          }
        }
      });

      let targetIdx = currentIdx;
      if (e.deltaY > 15 && currentIdx < sections.length - 1) {
        targetIdx = currentIdx + 1;
      } else if (e.deltaY < -15 && currentIdx > 0) {
        targetIdx = currentIdx - 1;
      }

      if (targetIdx !== currentIdx) {
        isScrollingRef.current = true;
        const targetId = sections[targetIdx];
        setActiveSection(targetId);

        smoothScrollTo(targetId, 1000, () => {
          // Additional 400ms inertia buffer after animation before unlocking
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 400);
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Handle Contact Form Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail || !formMessage) {
      setFormStatus({ type: 'error', message: 'Comms signal failed: Identity, Protocol, and Transmission are required.' });
      return;
    }

    setSubmitting(true);
    setFormStatus({ type: 'idle', message: '' });

    try {
      const res = await portfolioService.submitContactForm({
        name: formName,
        email: formEmail,
        subject: formSubject || 'No Subject Specified',
        message: formMessage,
      });

      if (res.success) {
        setFormStatus({ type: 'success', message: 'Transmission received. Connection established successfully.' });
        setFormName('');
        setFormEmail('');
        setFormSubject('');
        setFormMessage('');
      } else {
        setFormStatus({ type: 'error', message: `Transmission failed: ${res.error || 'Unknown network error'}` });
      }
    } catch (err: any) {
      setFormStatus({ type: 'error', message: `Transmission failed: ${err.message || err}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {isInitializing && (
        <InitializingScreen onComplete={() => setIsInitializing(false)} />
      )}
      <ParticleBackground />

      {/* Floating Side Dot Navigation Bar for Page-by-Page Snapping */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 bg-[#0a0b10]/60 backdrop-blur-md px-3 py-4 rounded-full border border-white/10 shadow-2xl">
        {navSections.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveSection(item.id);
              smoothScrollTo(item.id, 1100);
            }}
            className="group relative flex items-center"
            title={item.label}
          >
            {/* Tooltip Hover Label */}
            <span className="absolute right-8 px-2.5 py-1 rounded bg-[#0a0b10] border border-white/10 text-white font-mono text-[10px] uppercase font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap shadow-lg">
              {item.label}
            </span>
            {/* Dot indicator */}
            <span
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-primary-fixed scale-125 shadow-[0_0_12px_rgba(0,240,255,0.8)]'
                  : 'bg-white/20 group-hover:bg-white/50'
              }`}
            />
          </a>
        ))}
      </div>

      {/* Hero Section: Exact Design Matching User Reference Image */}
      <section id="hero" className="page-snap-section relative min-h-screen flex flex-col justify-center pt-16 md:pt-20 pb-8 px-margin-mobile md:px-margin-desktop overflow-hidden">
        
        {/* Background Ambient Glow & Neural Particle Lattice Grid */}
        <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-primary-fixed/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-[1440px] w-full mx-auto z-10 relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4">
          
          {/* Left Column: 3D Metallic Headline & Hero Copy */}
          <div className="lg:col-span-7 space-y-5 text-left flex flex-col items-start">
            
            {/* Main Headline with Metallic 3D Silver Gradient & Bevel Glow */}
            <div className="space-y-1">
              <h1 className="font-display-lg text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-black leading-none uppercase bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_10px_25px_rgba(255,255,255,0.15)] break-words">
                DEEPINDER
              </h1>
              <h1 className="font-display-lg text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight font-black leading-none uppercase bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_10px_25px_rgba(255,255,255,0.15)] break-words">
                SINGH
              </h1>
            </div>

            {/* Subtitle */}
            <h2 className="font-headline-md text-base sm:text-xl md:text-2xl text-slate-300 font-bold uppercase tracking-widest pt-0.5">
              NEURAL ARCHITECT &amp; ENGINEER
            </h2>

            {/* Bio Paragraph with 10-Click Secret Admin Gate (Hidden & Invisible) */}
            <p className="font-body-lg text-xs sm:text-sm md:text-base text-slate-400 max-w-xl leading-relaxed">
              Pioneering{' '}
              <span 
                onClick={handleSecretClick} 
                className="cursor-text select-text text-slate-400"
              >
                next-generation
              </span>{' '}
              cognitive compute fabrics, neural integrations, and intelligent systems for enterprise-grade solutions in the neural age.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
              <a 
                href="/#contact"
                className="btn-premium px-7 py-3 rounded-full text-on-primary-fixed font-label-md text-xs font-extrabold tracking-widest uppercase shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:shadow-[0_0_40px_rgba(0,240,255,0.5)] transition-all text-center w-full sm:w-[180px]"
              >
                INITIATE CONTACT
              </a>
              <Link 
                href="/archive" 
                className="px-7 py-3 rounded-full bg-white/5 border border-white/20 text-slate-200 hover:bg-white/10 hover:border-white/40 transition-all font-label-md text-xs font-extrabold tracking-widest uppercase text-center w-full sm:w-[180px] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
              >
                EXPLORE ARCHIVE
              </Link>
            </div>

          </div>

          {/* Right Column: Floating Glassmorphic Profile HUD Card (Compact & Shifted Up) */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="glass-card backdrop-blur-2xl rounded-3xl p-5 border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative w-full max-w-md text-left bg-[#090b14]/85">
              
              {/* Header: Photo + Profile Overview */}
              <div className="flex items-center gap-3.5 pb-3.5 border-b border-white/10">
                <div className="w-16 h-16 rounded-2xl border border-white/20 overflow-hidden shadow-xl flex-shrink-0 bg-surface-container-high">
                  <img 
                    src={profileImageUrl || "https://i.postimg.cc/RhFFpxdP/Round-Profile-image.png"} 
                    alt="Deepinder Singh" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
                    PROFILE OVERVIEW
                  </span>
                  <span className="font-mono text-[9px] text-slate-400 uppercase font-semibold mt-0.5">
                    CURRENT ROLE
                  </span>
                  <span className="text-[11px] font-semibold text-white leading-tight mt-0.5">
                    Neural Architect at CGC Jhanjeri &amp; Zanqir Startup
                  </span>
                </div>
              </div>

              {/* CORE TECHNOLOGIES Section */}
              <div className="py-3 border-b border-white/10 space-y-2">
                <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  CORE TECHNOLOGIES
                </span>
                
                {/* Tech 1: Python */}
                <div className="space-y-0.5">
                  <div className="flex justify-between font-mono text-[11px] text-slate-300">
                    <span>Python</span>
                    <span className="text-primary-fixed font-bold">[95%]</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 w-[95%]" />
                  </div>
                </div>

                {/* Tech 2: Neural Networks & SQL */}
                <div className="space-y-0.5">
                  <div className="flex justify-between font-mono text-[11px] text-slate-300">
                    <span>Neural Networks <span className="text-primary-fixed font-bold">[92%]</span>, SQL</span>
                    <span className="text-primary-fixed font-bold">[88%]</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 w-[90%]" />
                  </div>
                </div>

                {/* Tech 3: Tableau & Power BI */}
                <div className="space-y-0.5">
                  <div className="flex justify-between font-mono text-[11px] text-slate-300">
                    <span>Tableau <span className="text-secondary font-bold">[85%]</span>, Power BI</span>
                    <span className="text-secondary font-bold">[80%]</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 w-[83%]" />
                  </div>
                </div>

                {/* Tech 4: Node.js */}
                <div className="space-y-0.5">
                  <div className="flex justify-between font-mono text-[11px] text-slate-300">
                    <span>Node.js</span>
                    <span className="text-primary-fixed font-bold">[78%]</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-teal-400 w-[78%]" />
                  </div>
                </div>
              </div>

              {/* VENTURES & PROJECTS Section */}
              <div className="py-3 border-b border-white/10 space-y-2">
                <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  VENTURES &amp; PROJECTS
                </span>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Zanqir Startup Graph */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    {/* SVG Wave Sparkline */}
                    <svg className="w-full h-6 text-secondary" viewBox="0 0 100 30" fill="none">
                      <path d="M0 25 Q25 5 50 18 T100 5" stroke="currentColor" strokeWidth="2.5" fill="none" />
                      <path d="M0 25 Q25 5 50 18 T100 5 L100 30 L0 30 Z" fill="rgba(168,85,247,0.15)" />
                    </svg>
                    <div className="text-[10px] font-mono">
                      <p className="font-bold text-white leading-none">Zanqir Startup</p>
                      <p className="text-[9px] text-emerald-400 font-semibold">[Growth: +120%]</p>
                    </div>
                  </div>

                  {/* Capgemini CA Graph */}
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                    {/* SVG Bar Chart */}
                    <div className="flex items-end justify-between h-6 px-1 pb-0.5">
                      <div className="w-2 h-[40%] bg-primary-fixed/40 rounded-t" />
                      <div className="w-2 h-[60%] bg-primary-fixed/60 rounded-t" />
                      <div className="w-2 h-[35%] bg-primary-fixed/40 rounded-t" />
                      <div className="w-2 h-[85%] bg-primary-fixed rounded-t" />
                      <div className="w-2 h-[100%] bg-primary-fixed rounded-t shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                    </div>
                    <div className="text-[10px] font-mono">
                      <p className="font-bold text-white leading-none">Capgemini CA</p>
                      <p className="text-[9px] text-primary-fixed font-semibold">[Impact: Global]</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* COMPUTE STATUS Section */}
              <div className="pt-3 space-y-2">
                <span className="font-mono text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                  COMPUTE STATUS
                </span>

                <div className="grid grid-cols-3 gap-2 text-center">
                  
                  {/* Gauge 1: Core Temp */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-cyan-400" strokeDasharray={`${(coreTemp / 60) * 100}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute font-mono text-[9px] font-bold text-white">{coreTemp}°C</span>
                    </div>
                    <span className="font-mono text-[8px] text-slate-400 uppercase mt-0.5">Core Temp</span>
                  </div>

                  {/* Gauge 2: System Load */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-purple-400" strokeDasharray={`${systemLoad}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute font-mono text-[9px] font-bold text-white">{systemLoad}%</span>
                    </div>
                    <span className="font-mono text-[8px] text-slate-400 uppercase mt-0.5">System Load</span>
                  </div>

                  {/* Gauge 3: Auth Status */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <svg className="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-emerald-400" strokeDasharray="100, 100" strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute font-mono text-[7px] font-bold text-emerald-400">{authStatus}</span>
                    </div>
                    <span className="font-mono text-[8px] text-slate-400 uppercase mt-0.5">Auth Status</span>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* About Section (Research) - Slightly Larger */}
      <section className="page-snap-section py-8 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto scroll-mt-24 w-full flex flex-col justify-center min-h-screen" id="about">
        <div className="grid grid-cols-1 md:grid-cols-[400px_1fr] lg:grid-cols-[450px_1fr] gap-8 md:gap-12 items-center max-w-6xl mx-auto w-full">
          <div className="relative group max-w-[360px] sm:max-w-[400px] mx-auto w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-fixed to-secondary rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative glass-card aspect-[4/5] max-h-[420px] md:max-h-[460px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl hover:border-primary-fixed/40 hover:shadow-[0_0_35px_rgba(0,240,255,0.2)] transition-all duration-500">
              {/* Cybernetic Corner Brackets - Fitted Directly to Image Frame */}
              <div className="absolute top-2.5 left-2.5 w-5 h-5 border-t-2 border-l-2 border-primary-fixed z-20 pointer-events-none"></div>
              <div className="absolute top-2.5 right-2.5 w-5 h-5 border-t-2 border-r-2 border-primary-fixed z-20 pointer-events-none"></div>
              <div className="absolute bottom-2.5 left-2.5 w-5 h-5 border-b-2 border-l-2 border-primary-fixed z-20 pointer-events-none"></div>
              <div className="absolute bottom-2.5 right-2.5 w-5 h-5 border-b-2 border-r-2 border-primary-fixed z-20 pointer-events-none"></div>

              <img 
                alt="Deepinder Singh Professional Portrait" 
                className="w-full h-full object-cover transition-all duration-700 scale-100 group-hover:scale-105" 
                src={profileImageUrl || "https://i.postimg.cc/RhFFpxdP/Round-Profile-image.png"}
              />
            </div>
          </div>
          <div className="text-left space-y-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container/10 border border-secondary/30 text-secondary text-xs font-mono font-bold uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-secondary blink-dot"></span>
                Executive Intelligence Profile
              </div>
              <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface font-extrabold tracking-tight">Pioneering the Neural Frontier</h2>
            </div>
            
            <p className="font-body-lg text-base md:text-lg text-on-surface-variant leading-relaxed">
              Deepinder Singh is an AI &amp; Data Science student at CGC Jhanjeri, Founder &amp; CEO @ Zanqir Systems, and Capgemini Campus Ambassador. Specializing in high-throughput cognitive systems, machine learning architectures, and scalable web solutions.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-y border-white/10 py-3.5">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="font-display-lg text-xl md:text-2xl font-black text-primary-fixed">15+</p>
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Projects</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="font-display-lg text-xl md:text-2xl font-black text-secondary">3+</p>
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Hackathons</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-center">
                <p className="font-display-lg text-xl md:text-2xl font-black text-emerald-400">99.9%</p>
                <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">System Reliability</p>
              </div>
            </div>

            <div className="pt-1 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-container/10 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed">
                  <span className="material-symbols-outlined text-sm">school</span>
                </div>
                <span className="font-label-md text-xs md:text-sm font-semibold text-on-surface">B.Tech AI &amp; Data Science @ CGC Jhanjeri</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary-container/10 border border-secondary/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-sm">rocket_launch</span>
                </div>
                <span className="font-label-md text-xs md:text-sm font-semibold text-on-surface">Founder &amp; CEO @ Zanqir Systems</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Stack Bento Grid - Compact to Fit 100vh */}
      <section className="page-snap-section py-8 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto scroll-mt-24 w-full flex flex-col justify-center min-h-screen" id="skills">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center mb-6 space-y-1.5">
            <span className="px-3.5 py-1 rounded-full bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed text-xs font-mono font-bold uppercase tracking-wider">
              Technical Competencies
            </span>
            <h2 className="font-headline-lg text-2xl md:text-4xl font-extrabold tracking-tight text-on-surface">Expertise Stack</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Programming */}
            <div className="glass-card p-5 md:p-6 rounded-2xl md:col-span-2 border border-white/10 hover:border-primary-fixed/40 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl">terminal</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg md:text-xl font-bold text-on-surface">Core Programming</h3>
                  <p className="font-mono text-[11px] text-on-surface-variant/60">High-performance algorithms &amp; systems code</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.1)]">Python</span>
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.1)]">C / C++</span>
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.1)]">SQL</span>
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.1)]">Node.js / React</span>
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.1)]">TypeScript</span>
              </div>
            </div>

            {/* AI & Machine Learning */}
            <div className="glass-card p-5 md:p-6 rounded-2xl md:col-span-2 border border-white/10 hover:border-secondary/40 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/20 border border-secondary/30 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl">psychology</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg md:text-xl font-bold text-on-surface">Artificial Intelligence</h3>
                  <p className="font-mono text-[11px] text-on-surface-variant/60">Neural architectures &amp; LLM orchestration</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-secondary-container/10 border border-secondary/30 text-secondary rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.1)]">Deep Neural Networks</span>
                <span className="px-3 py-1.5 bg-secondary-container/10 border border-secondary/30 text-secondary rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.1)]">LLMs &amp; APIs</span>
                <span className="px-3 py-1.5 bg-secondary-container/10 border border-secondary/30 text-secondary rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.1)]">PyTorch / TensorFlow</span>
                <span className="px-3 py-1.5 bg-secondary-container/10 border border-secondary/30 text-secondary rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.1)]">Model Deployment</span>
              </div>
            </div>

            {/* Data Science */}
            <div className="glass-card p-5 md:p-6 rounded-2xl md:col-span-2 border border-white/10 hover:border-primary-fixed/40 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl">monitoring</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg md:text-xl font-bold text-on-surface">Data Science &amp; Analytics</h3>
                  <p className="font-mono text-[11px] text-on-surface-variant/60">Business intelligence &amp; data modeling</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider">Power BI</span>
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider">Tableau</span>
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider">Advanced Excel</span>
                <span className="px-3 py-1.5 bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed rounded-xl text-xs font-bold uppercase tracking-wider">Pandas / NumPy</span>
              </div>
            </div>

            {/* Strategic Leadership */}
            <div className="glass-card p-5 md:p-6 rounded-2xl md:col-span-2 border border-white/10 hover:border-white/30 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-on-surface group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl">hub</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg md:text-xl font-bold text-on-surface">Strategic Leadership</h3>
                  <p className="font-mono text-[11px] text-on-surface-variant/60">Venture direction &amp; team execution</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider">Product Architecture</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider">Public Speaking</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider">Team Leadership</span>
                <span className="px-3 py-1.5 bg-white/5 border border-white/10 text-on-surface rounded-xl text-xs font-bold uppercase tracking-wider">Agile Strategy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline: Interactive Horizontal Neural Pipeline */}
      <section className="page-snap-section py-8 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto scroll-mt-24 w-full flex flex-col justify-center min-h-screen" id="experience">
        <div className="w-full max-w-6xl mx-auto space-y-7">
          <div className="text-center mb-4">
            <span className="px-3.5 py-1 rounded-full bg-secondary-container/10 border border-secondary/30 text-secondary text-xs font-mono font-bold uppercase tracking-wider">
              Operational Sequence
            </span>
            <h2 className="font-headline-lg text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mt-2">Operational Timeline</h2>
          </div>

          {(() => {
            const defaultTimeline: Omit<TimelineEvent, 'id'>[] = [
              { role: 'Founder & CEO', company: 'Zanqir Systems', description: 'Leading executive strategy, core neural product development, and high-throughput AI architecture.', order_index: 0 },
              { role: 'Campus Ambassador', company: 'Capgemini', description: 'Bridging enterprise technology innovations and academic talent through technical webinars & leadership.', order_index: 1 },
              { role: 'Associate Member', company: 'CodeZen', description: 'Contributing to open source frameworks, algorithmic problem solving, and community coding workshops.', order_index: 2 },
              { role: 'Professional Member', company: 'Wiztron', description: 'Participating in technical system deployments, full-stack builds, and infrastructure optimization.', order_index: 3 },
            ];
            const displayTimeline = timelineEvents.length > 0 ? timelineEvents : defaultTimeline;
            const currentItem = displayTimeline[activeTimelineIndex] || displayTimeline[0];

            return (
              <div className="space-y-7">
                {/* Single-Row Horizontal Cybernetic Beam */}
                <div className="relative py-3">
                  {/* Glowing Connection Line */}
                  <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-gradient-to-r from-primary-fixed/20 via-primary-fixed to-secondary/30 rounded-full z-0"></div>

                  {/* Single Line Flex Track for All Nodes (Touch Scrollable on Mobile) */}
                  <div className="relative z-10 flex items-center justify-start md:justify-between gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar px-2 py-1">
                    {displayTimeline.map((item, idx) => {
                      const isActive = activeTimelineIndex === idx;
                      return (
                        <button
                          key={(item as any).id || idx}
                          onClick={() => setActiveTimelineIndex(idx)}
                          className={`group flex-1 min-w-[120px] md:min-w-[140px] flex flex-col items-center gap-2 p-3 md:p-3.5 rounded-2xl transition-all duration-300 ${
                            isActive
                              ? 'bg-white/10 border border-primary-fixed/40 shadow-[0_0_20px_rgba(0,240,255,0.25)] scale-105'
                              : 'bg-white/5 border border-white/5 hover:border-white/20'
                          }`}
                        >
                          {/* Glowing Node Pin */}
                          <div
                            className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center font-mono font-bold text-xs md:text-sm transition-all duration-300 ${
                              isActive
                                ? 'bg-primary-fixed text-background scale-110 shadow-[0_0_12px_#00f0ff]'
                                : 'bg-[#0a0b10] text-slate-400 group-hover:text-primary-fixed border border-white/10'
                            }`}
                          >
                            {`0${idx + 1}`}
                          </div>
                          <div className="text-center">
                            <p className={`font-mono text-xs md:text-sm uppercase font-extrabold tracking-wider truncate max-w-[110px] ${isActive ? 'text-primary-fixed' : 'text-slate-300'}`}>
                              {item.company}
                            </p>
                            <p className="font-sans text-[11px] md:text-xs text-slate-400 truncate max-w-[110px]">{item.role}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Node Detail Card HUD */}
                <div className="glass-card p-6 md:p-8 rounded-2xl border-white/10 shadow-2xl relative overflow-hidden transition-all duration-500 min-h-[190px]">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary-fixed to-secondary"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4 pb-3.5 border-b border-white/10">
                    <div>
                      <span className="px-3 py-1 rounded-full bg-primary-container/20 border border-primary-fixed/40 text-primary-fixed text-xs font-mono font-bold uppercase tracking-widest">
                        {currentItem.role}
                      </span>
                      <h3 className="font-headline-lg text-2xl md:text-3xl font-extrabold text-on-surface mt-1.5">
                        {currentItem.company}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Active Sequence Matrix</span>
                    </div>
                  </div>
                  <p className="font-body-lg text-sm md:text-base text-on-surface-variant leading-relaxed mb-5">
                    {currentItem.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-300">
                      Phase {activeTimelineIndex + 1} of {displayTimeline.length}
                    </span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-300">
                      Verified Operational Record
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Dynamic/Fallback Achievements Section */}
      <section id="achievements" className="page-snap-section py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto scroll-mt-24">
        <h2 className="font-headline-lg text-3xl md:text-4xl mb-xl text-center">Competitive Achievements</h2>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-4 border-primary-fixed border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.length > 0 ? (
              achievements.map((ach) => (
                <div key={ach.id} className="glass-card p-6 rounded-xl flex items-start gap-4 glow-hover">
                  <div className="w-14 h-14 rounded-full bg-primary-fixed/20 flex items-center justify-center border border-primary-fixed/40 shrink-0">
                    <span className="material-symbols-outlined text-primary-fixed text-2xl">emoji_events</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg md:text-xl font-bold">{ach.title}</h3>
                    <p className="font-label-md text-xs text-primary-fixed mt-0.5">{ach.date}</p>
                    <p className="font-body-md text-sm text-on-surface-variant mt-2">{ach.description}</p>
                  </div>
                </div>
              ))
            ) : (
              // Default Fallback achievements if DB is empty
              <>
                <div className="glass-card p-6 rounded-xl flex items-start gap-4 glow-hover">
                  <div className="w-14 h-14 rounded-full bg-primary-fixed/20 flex items-center justify-center border border-primary-fixed/40 shrink-0">
                    <span className="material-symbols-outlined text-primary-fixed text-2xl">emoji_events</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg md:text-xl font-bold">Vault Heist</h3>
                    <p className="font-label-md text-xs text-primary-fixed mt-0.5">Finalist / Top Tier Rank</p>
                    <p className="font-body-md text-sm text-on-surface-variant mt-2">Successfully solved high-complexity security and data puzzles.</p>
                  </div>
                </div>
                <div className="glass-card p-6 rounded-xl flex items-start gap-4 glow-hover">
                  <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary/40 shrink-0">
                    <span className="material-symbols-outlined text-secondary text-2xl">trophy</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-lg md:text-xl font-bold">Hack-N-Win 3.0</h3>
                    <p className="font-label-md text-xs text-secondary mt-0.5">Secured Position</p>
                    <p className="font-body-md text-sm text-on-surface-variant mt-2">Built innovative AI prototype within 36-hour sprint.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Featured Projects Showcase Section: Smooth Horizontal Auto-Slider */}
      {featuredProjects.length > 0 && (
        <section id="projects" className="page-snap-section py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto scroll-mt-24 w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-primary-container/10 border border-primary-fixed/30 text-primary-fixed text-xs font-mono font-bold uppercase tracking-wider">
                Flagship Builds
              </span>
              <h2 className="font-headline-lg text-3xl md:text-5xl font-extrabold tracking-tight text-on-surface mt-2">Featured Projects</h2>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveProjectIndex((prev) => (prev === 0 ? featuredProjects.length - 1 : prev - 1))}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-primary-fixed/40 flex items-center justify-center text-slate-300 hover:text-primary-fixed transition-all"
                title="Previous Build"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <span className="font-mono text-xs text-slate-400">
                {activeProjectIndex + 1} / {featuredProjects.length}
              </span>
              <button
                onClick={() => setActiveProjectIndex((prev) => (prev + 1) % featuredProjects.length)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-primary-fixed/40 flex items-center justify-center text-slate-300 hover:text-primary-fixed transition-all"
                title="Next Build"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Active Featured Project Display Card */}
          {(() => {
            const project = featuredProjects[activeProjectIndex] || featuredProjects[0];
            return (
              <div className="glass-card rounded-2xl p-6 md:p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative overflow-hidden transition-all duration-700">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-primary-container/10 text-primary-fixed border border-primary-fixed/30 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
                      Build 0{activeProjectIndex + 1}
                    </span>
                    <div className="flex gap-3">
                      {project.github_url && (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-primary-fixed hover:border-primary-fixed/40 transition-colors"
                          title="View Repository"
                        >
                          <span className="material-symbols-outlined text-sm">code</span>
                        </a>
                      )}
                      {project.live_url && (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-xl bg-primary-container/20 border border-primary-fixed/40 flex items-center justify-center text-primary-fixed hover:scale-105 transition-transform"
                          title="Launch Production Build"
                        >
                          <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="font-headline-lg text-2xl md:text-4xl text-on-surface font-extrabold tracking-tight">
                    {project.title}
                  </h3>

                  <p className="font-body-lg text-sm md:text-base text-on-surface-variant leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech_stack.map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-mono text-slate-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden border border-white/10 group">
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={project.image_url}
                    alt={project.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <span className="font-mono text-xs text-slate-300 bg-[#0a0b10]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      Live Neural Interface
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Slide Indicator Dots */}
          <div className="flex justify-center items-center gap-2 mt-6">
            {featuredProjects.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveProjectIndex(idx)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  activeProjectIndex === idx
                    ? 'w-8 bg-primary-fixed shadow-[0_0_10px_#00f0ff]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="page-snap-section py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto mb-xl scroll-mt-24" id="contact">
        <div className="glass-card p-6 md:p-12 rounded-2xl border-white/10 relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div>
              <h2 className="font-headline-lg text-3xl md:text-4xl mb-4">Initiate Collaboration</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Ready to discuss your next breakthrough? Reach out via the transmission link or social nexus.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary-fixed">mail</span>
                  <a href="mailto:singdeepinder416@gmail.com" className="font-label-md text-sm md:text-base text-on-surface hover:text-primary-fixed transition-colors">
                    singdeepinder416@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-primary-fixed">location_on</span>
                  <span className="font-label-md text-sm md:text-base">Mohali, India | Global Remote</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              {formStatus.message && (
                <div className={`p-4 rounded-lg text-sm font-semibold border ${
                  formStatus.type === 'success' 
                    ? 'bg-primary-container/10 border-primary-fixed text-primary-fixed' 
                    : 'bg-error-container/15 border-error text-error'
                }`}>
                  {formStatus.message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-sm text-xs text-on-surface-variant ml-1">Identity</label>
                  <input 
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all text-on-surface text-sm" 
                    placeholder="Your Name" 
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-sm text-xs text-on-surface-variant ml-1">Comms Protocol</label>
                  <input 
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all text-on-surface text-sm" 
                    placeholder="email@address.com" 
                    type="email"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="font-label-sm text-xs text-on-surface-variant ml-1">Subject</label>
                <input 
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all text-on-surface text-sm" 
                  placeholder="Subject of transmission" 
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-sm text-xs text-on-surface-variant ml-1">Transmission</label>
                <textarea 
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full bg-surface-container-low border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all text-on-surface text-sm" 
                  placeholder="Brief project overview or inquiry..." 
                  rows={4}
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-3 bg-primary-container text-on-primary-container rounded-lg font-label-md text-sm font-bold tracking-widest hover:shadow-[0_0_20px_rgba(0,219,233,0.3)] active:scale-95 transition-all disabled:opacity-50 uppercase"
              >
                {submitting ? 'SENDING SIGNAL...' : 'SEND SIGNAL'}
              </button>
            </form>
          </div>
          {/* Decorative Light Leak */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-white/5 bg-surface-container-lowest mt-16">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-headline-sm text-lg text-on-surface mb-1 font-bold">DEEPINDER SINGH</h4>
            <p className="font-label-sm text-xs text-on-surface-variant">© 2024 DEEPINDER SINGH. BUILT FOR THE NEURAL AGE.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            <a className="font-label-sm text-xs text-on-surface-variant hover:text-primary-fixed transition-colors" href="https://www.linkedin.com/in/deepinder-singh-april2007/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="font-label-sm text-xs text-on-surface-variant hover:text-primary-fixed transition-colors" href="https://github.com/Singh08042007" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a className="font-label-sm text-xs text-on-surface-variant hover:text-primary-fixed transition-colors" href="https://www.instagram.com/deep__cheema__2007/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="font-label-sm text-xs text-on-surface-variant hover:text-primary-fixed transition-colors" href="https://www.youtube.com/@cheema3364" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a className="font-label-sm text-xs text-on-surface-variant hover:text-primary-fixed transition-colors" href="https://www.hackerrank.com/profile/Singh2007" target="_blank" rel="noopener noreferrer">HackerRank</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
