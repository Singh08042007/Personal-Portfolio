'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ParticleBackground from '@/components/ParticleBackground';
import { portfolioService, Achievement, Project, TimelineEvent, Profile } from '@/services/portfolioService';
import { supabase } from '@/lib/supabaseClient';

export default function HomePage() {
  const router = useRouter();
  const [secretClicks, setSecretClicks] = useState(0);

  const handleSecretClick = () => {
    setSecretClicks((prev) => {
      const newClicks = prev + 1;
      if (newClicks >= 5) {
        router.push('/login');
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
          setProfileImageUrl(profileData.avatar_url);
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
      <ParticleBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 px-margin-mobile md:px-margin-desktop overflow-hidden">
        {/* Asymmetrical Layout Container */}
        <div className="max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 relative py-12 md:py-24">
          
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-6 text-left flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed font-label-sm text-xs tracking-wider uppercase font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container blink-dot"></span>
              System Node // Online
            </div>
            
            <h1 className="font-display-lg text-5xl md:text-7xl lg:text-8xl tracking-tighter text-on-surface font-extrabold neon-text-glow leading-none uppercase">
              DEEPINDER<br />
              <span className="text-gradient-zanqir">SINGH</span>
            </h1>
            
            <div className="flex items-center gap-3">
              <span className="text-on-surface-variant font-body-md text-xs uppercase tracking-widest font-bold border-r border-white/10 pr-3">Node</span>
              <div className="title-rotator-container font-headline-md text-lg md:text-xl text-secondary-fixed-dim">
                <div className="rotating-list">
                  <p>AI & Data Science Student</p>
                  <p>Founder & CEO @ Zanqir</p>
                  <p>Campus Ambassador</p>
                  <p>Builder & Innovator</p>
                  <p>AI & Data Science Student</p>
                </div>
              </div>
            </div>
            
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
              Engineering the <span onClick={handleSecretClick} className="cursor-default select-none">next generation</span> of cognitive compute fabrics, neural integrations, and intelligent systems in the neural age.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full sm:w-auto pt-4">
              <a 
                href="/#contact"
                className="btn-premium px-8 py-3.5 rounded-xl text-on-primary-fixed font-label-md text-sm font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(0,219,233,0.25)] hover:shadow-[0_0_35px_rgba(0,219,233,0.45)] text-center"
              >
                Initiate Contact
              </a>
              <a 
                href="https://deepindersinghresume.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3.5 rounded-xl border border-secondary/35 text-secondary hover:border-secondary hover:bg-secondary/5 transition-all duration-300 font-label-md text-sm font-bold tracking-wider uppercase text-center"
              >
                Resume
              </a>
              <Link 
                href="/archive" 
                className="px-8 py-3.5 rounded-xl border border-primary-fixed/30 text-primary-fixed hover:border-primary-fixed hover:bg-primary-fixed/5 transition-all duration-300 font-label-md text-sm font-bold tracking-wider uppercase text-center"
              >
                Explore Archive
              </Link>
              <Link 
                href="/zanqir" 
                className="px-8 py-3.5 rounded-xl glass-card text-on-surface hover:bg-white/10 transition-all duration-300 font-label-md text-sm font-bold tracking-wider uppercase text-center"
              >
                Zanqir Startup
              </Link>
            </div>
          </div>
          
          {/* Right Column: High-Fidelity Terminal Console */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="glass-card scanlines w-full max-w-lg p-6 rounded-2xl border-white/10 shadow-2xl relative">
              
              {/* macOS Style Window Controls */}
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/5">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]"></span>
                </div>
                <span className="font-label-sm text-[10px] text-on-surface-variant/40 tracking-wider font-mono">deepinder_profile.sh</span>
                <span className="w-3"></span>
              </div>
              
              {/* Terminal Workspace with Syntax Highlighting */}
              <div className="font-mono text-xs md:text-sm space-y-2 select-none leading-relaxed text-left">
                <p className="tok-comment">// Operational Parameters</p>
                <p><span className="tok-keyword">const</span> <span className="tok-key">developer</span> = &#123;</p>
                <p className="pl-4"><span className="tok-key">identity</span>: <span className="tok-string">&quot;Deepinder Singh&quot;</span>,</p>
                <p className="pl-4"><span className="tok-key">status</span>: <span className="tok-string">&quot;Pioneering Neural Frontier&quot;</span>,</p>
                <p className="pl-4"><span className="tok-key">academic</span>: <span className="tok-string">&quot;B.Tech AI &amp; Data Science&quot;</span>,</p>
                <p className="pl-4"><span className="tok-key">host</span>: <span className="tok-string">&quot;CGC Jhanjeri&quot;</span>,</p>
                <p className="pl-4"><span className="tok-key">ventures</span>: [<span className="tok-string">&quot;Zanqir Startup&quot;</span>, <span className="tok-string">&quot;Capgemini CA&quot;</span>],</p>
                <p className="pl-4"><span className="tok-key">coreTech</span>: [</p>
                <p className="pl-8"><span className="tok-string">&quot;Python&quot;</span>, <span className="tok-string">&quot;Neural Networks&quot;</span>, <span className="tok-string">&quot;SQL&quot;</span>,</p>
                <p className="pl-8"><span className="tok-string">&quot;Tableau&quot;</span>, <span className="tok-string">&quot;Power BI&quot;</span>, <span className="tok-string">&quot;Node.js&quot;</span></p>
                <p className="pl-4">]</p>
                <p>&#125;;</p>
                
                {/* System Metrics HUD */}
                <div className="pt-4 mt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-[11px] text-on-surface-variant/60">
                  <div>
                    <p className="font-bold text-primary-fixed uppercase tracking-wider text-[9px] mb-1">Compute Status</p>
                    <p>Core Temp: <span className="text-on-surface transition-all duration-500">{coreTemp}°C</span></p>
                    <p>System Load: <span className="text-on-surface transition-all duration-500">{systemLoad}%</span></p>
                  </div>
                  <div>
                    <p className="font-bold text-secondary uppercase tracking-wider text-[9px] mb-1">Nexus Latency</p>
                    <p>Ping Rate: <span className="text-on-surface transition-all duration-500">{pingRate}ms</span></p>
                    <p>Auth Status: <span className="text-primary-fixed font-semibold uppercase transition-all duration-500">{authStatus}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Dynamic Ambient Background Glow Elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-fixed/5 rounded-full blur-[150px] pointer-events-none ambient-cyan"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[180px] pointer-events-none ambient-purple"></div>
      </section>

      {/* About Section */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto scroll-mt-24" id="about">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-fixed to-secondary rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            
            {/* Cybernetic Corner Brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary-fixed/40 z-20"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary-fixed/40 z-20"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary-fixed/40 z-20"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary-fixed/40 z-20"></div>

            <div className="relative glass-card aspect-square rounded-xl overflow-hidden border-white/5 shadow-2xl hover:border-primary-fixed/30 hover:shadow-[0_0_30px_rgba(0,219,233,0.15)] transition-all duration-500">
              <img 
                alt="Deepinder Singh Professional Portrait" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                src={profileImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBD7qPMu2tjuczyAR46HMu7L58vgIJCPl1yEG7rNDaHe8Abo-0onjjCDnpLwL5P2zXtXXiIYMeKKwzgzxfAcKpIWX81oRcmZmK9bfw2m1qxTsa0cMIuZahiZsL-vnTdY6ajUAXyKYPjiNpubiYKdkh4hau-x5yTOTkbOEbMPOummSdS_lDky--FLtANP_DrwSJ330ctVKyZco8h45iTgGeU2e-Ghdebo_v8PeYZt-KAydhBpNLhlAklc5dGRBvJBqhTHhfszcQMgfI"}
              />
            </div>
          </div>
          <div className="text-left">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-on-surface mb-md">Pioneering the Neural Frontier</h2>
            <div className="space-y-6 font-body-lg text-body-lg text-on-surface-variant">
              <p>I am a B.Tech Artificial Intelligence & Data Science student at <span className="text-primary-fixed font-semibold">CGC Jhanjeri</span>, driven by the challenge of turning complex data into actionable intelligence.</p>
              <p>As the <span className="text-secondary font-semibold">Founder of Zanqir</span>, I&apos;ve dedicated myself to building systems that bridge the gap between human intuition and machine precision. My journey is defined by a relentless pursuit of innovation and a passion for leading teams through uncharted technological territories.</p>
              <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary-fixed">school</span>
                  <span className="font-label-md text-sm md:text-base">B.Tech AI & Data Science @ CGC Jhanjeri</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span className="material-symbols-outlined text-secondary">rocket_launch</span>
                  <span className="font-label-md text-sm md:text-base">Founder & CEO @ Zanqir</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Stack Bento Grid */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto scroll-mt-24" id="skills">
        <h2 className="font-headline-lg text-3xl md:text-4xl text-center mb-xl">Expertise Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          {/* Programming */}
          <div className="glass-card p-6 rounded-xl glow-hover md:col-span-2">
            <div className="flex items-center gap-sm mb-4">
              <span className="material-symbols-outlined text-primary-fixed">terminal</span>
              <h3 className="font-headline-md text-xl md:text-2xl">Programming</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider">Python</span>
              <span className="px-4 py-1.5 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider">C / C++</span>
              <span className="px-4 py-1.5 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider">SQL</span>
              <span className="px-4 py-1.5 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider">Node.js / React</span>
            </div>
          </div>
          {/* AI */}
          <div className="glass-card p-6 rounded-xl glow-hover md:col-span-2">
            <div className="flex items-center gap-sm mb-4">
              <span className="material-symbols-outlined text-secondary">psychology</span>
              <h3 className="font-headline-md text-xl md:text-2xl">Artificial Intelligence</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-secondary-container/10 border border-secondary/20 text-secondary rounded-full text-xs font-semibold uppercase tracking-wider">Neural Networks</span>
              <span className="px-4 py-1.5 bg-secondary-container/10 border border-secondary/20 text-secondary rounded-full text-xs font-semibold uppercase tracking-wider">LLMs & APIs</span>
              <span className="px-4 py-1.5 bg-secondary-container/10 border border-secondary/20 text-secondary rounded-full text-xs font-semibold uppercase tracking-wider">Model Deployment</span>
            </div>
          </div>
          {/* Data */}
          <div className="glass-card p-6 rounded-xl glow-hover md:col-span-2">
            <div className="flex items-center gap-sm mb-4">
              <span className="material-symbols-outlined text-primary-fixed">monitoring</span>
              <h3 className="font-headline-md text-xl md:text-2xl">Data Science</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider">Power BI</span>
              <span className="px-4 py-1.5 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider">Tableau</span>
              <span className="px-4 py-1.5 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-full text-xs font-semibold uppercase tracking-wider">Advanced Excel</span>
            </div>
          </div>
          {/* Soft Skills */}
          <div className="glass-card p-6 rounded-xl glow-hover md:col-span-2">
            <div className="flex items-center gap-sm mb-4">
              <span className="material-symbols-outlined text-on-surface">hub</span>
              <h3 className="font-headline-md text-xl md:text-2xl">Strategic Leadership</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-on-surface-variant rounded-full text-xs font-semibold uppercase tracking-wider">Project Management</span>
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-on-surface-variant rounded-full text-xs font-semibold uppercase tracking-wider">Public Speaking</span>
              <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-on-surface-variant rounded-full text-xs font-semibold uppercase tracking-wider">Creative Direction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-xl bg-surface-container-lowest/30 relative scroll-mt-24" id="experience">
        <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-lg text-3xl md:text-4xl mb-xl text-center">Operational Timeline</h2>
          <div className="relative max-w-4xl mx-auto pl-8 md:pl-0">
            {/* Center Line (Desktop) */}
            <div className="hidden md:block absolute left-1/2 -translate-x-1/2 h-full w-px timeline-line"></div>
            {/* Left Line (Mobile) */}
            <div className="md:hidden absolute left-0 h-full w-px timeline-line"></div>
            
            {(() => {
              const defaultTimeline: Omit<TimelineEvent, 'id'>[] = [
                { role: 'Founder & CEO', company: 'Zanqir', description: 'Leading the development of AI-driven solutions and operational strategy.', order_index: 0 },
                { role: 'Campus Ambassador', company: 'Capgemini', description: 'Driving corporate-academic engagement and tech awareness.', order_index: 1 },
                { role: 'Associate Member', company: 'CodeZen', description: 'Contributing to community-driven coding excellence and projects.', order_index: 2 },
                { role: 'Professional Role', company: 'Wiztron', description: 'Strategic involvement in technical implementations and systems.', order_index: 3 },
              ];
              const displayTimeline = timelineEvents.length > 0 ? timelineEvents : defaultTimeline;
              return displayTimeline.map((item, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div key={(item as any).id || index} className={`relative mb-12 md:w-1/2 ${isEven ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}`}>
                    <div className={`md:absolute ${isEven ? 'md:right-[-42px]' : 'md:left-[-42px]'} md:top-4 w-5 h-5 rounded-full ${isEven ? 'bg-primary-fixed shadow-[0_0_10px_#00dbe9]' : 'bg-secondary shadow-[0_0_10px_#ecb2ff]'} z-10`}></div>
                    <div className="glass-card p-6 rounded-xl glow-hover">
                      <span className={`font-label-sm text-xs ${isEven ? 'text-primary-fixed' : 'text-secondary'} block mb-1 uppercase tracking-wider font-semibold`}>
                        {item.role}
                      </span>
                      <h3 className="font-headline-md text-xl mb-1">{item.company}</h3>
                      <p className="font-body-md text-sm text-on-surface-variant">{item.description}</p>
                    </div>
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* Dynamic/Fallback Achievements Section */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
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

      {/* Featured Projects Showcase Section (Dynamic if added in Admin) */}
      {featuredProjects.length > 0 && (
        <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto scroll-mt-24">
          <div className="mb-lg">
            <h2 className="font-headline-lg text-3xl md:text-4xl text-primary-fixed">Featured Projects</h2>
            <p className="font-label-md text-on-surface-variant">Flagship engineering builds</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary-container/10 text-primary-fixed border border-primary-fixed/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Featured Build
                    </span>
                    <div className="flex gap-2">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors">
                          code
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors">
                          open_in_new
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display-lg text-xl md:text-2xl text-on-surface mb-2 font-bold">{project.title}</h3>
                  <p className="font-body-lg text-sm text-on-surface-variant mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {project.tech_stack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-surface-container-highest rounded text-xs text-on-surface">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative h-48 w-full rounded-xl overflow-hidden mt-2">
                  <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={project.image_url} alt={project.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-xl px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto mb-xl scroll-mt-24" id="contact">
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
