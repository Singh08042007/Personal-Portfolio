'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { portfolioService, Project, Certification } from '@/services/portfolioService';

// Default Fallback Projects (if DB is empty) categorized into 3 sections
const defaultProjects: Project[] = [
  // 🚀 FLAGSHIP PROJECTS (Built with a lot of time and effort)
  {
    id: 'default-1',
    title: 'College Life Management App (Zanqir ERP)',
    description: 'A comprehensive ERP-inspired ecosystem built with months of architectural planning for students to manage schedules, academic resources, and campus integration.',
    tech_stack: ['React Native', 'Firebase', 'Tailwind CSS', 'Python', 'Node.js'],
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2MQ76j0MMaVaJQHK837OGgOrvO2CY6Qzq2uwXvnkvxrEjB3dB8v95wucVVOJ2d92Ny8iiyq8PBJMUiTLLI3zZ_Ww59wlQ08Yvk04_PkG9bPwdzxyiTFLQPcQH1YC15cqEBIfc-HFZrtTTnvAwvCbMvZLlseg-yLXh-CYFx09sUcxZFCz2OHZftPaBrhY0-fbWvejCONScoGuvpB4La7y2BqC4UZ1PUMm2iIY2xATxplNSYU9DnSuF3dc1fVv5T9iYiwaXNajje4',
    featured: true,
    category: 'flagship',
    live_url: '#',
    github_url: 'https://github.com/Singh08042007'
  },
  {
    id: 'default-2',
    title: 'FinPilot AI Financial Copilot',
    description: 'Autonomous financial intelligence assistant for micro-investing and portfolio optimization using predictive analytics, risk modeling, and machine learning.',
    tech_stack: ['Python', 'Scikit-learn', 'FastAPI', 'React', 'PostgreSQL'],
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    featured: true,
    category: 'flagship',
    live_url: '#',
    github_url: 'https://github.com/Singh08042007'
  },

  // ⚡ HACKATHON BUILDS (Built in hackathons)
  {
    id: 'default-3',
    title: 'Neural Chess AI Engine',
    description: 'Built during Hack-N-Win 3.0 (36-Hour Sprint): Unity-based 3D chess simulator with a custom alpha-beta pruning AI engine adversary.',
    tech_stack: ['Unity 3D', 'C#', 'Minimax AI', 'WebGL'],
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrkkaFlPoWBaz3zuzW0hvyvCZCNDsBdkNf0CAXBZKdgw-_m9XmqjS3_oT-2DfmNZsPKGN_ad1uEmt2cukbrRZc5gcyHKb_cC-hd43QcstQvXtB02nDhy1cuKB60rYEFBNjh25XaJzO5bY1GxD910Cwae3fYCTdbV2qD2KfJBZ2Dv7h1-s8YNs19OI1jvAc-8aKf8g8fWkc710vdUcxp2PNMp1Qt_44yWDom9IqDCzZ5m6cwIb1VqzjjiU7JSTrhEJbELRnu3rRx48',
    featured: false,
    category: 'hackathon',
    live_url: '#',
    github_url: 'https://github.com/Singh08042007'
  },
  {
    id: 'default-4',
    title: 'Vault Heist Security Protocol',
    description: 'Created for Vault Heist Competition: High-speed cryptographic solver and automated security payload analysis tool built under 24-hour sprint.',
    tech_stack: ['Python', 'Cryptography', 'Node.js', 'Sockets'],
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    featured: false,
    category: 'hackathon',
    live_url: '#',
    github_url: 'https://github.com/Singh08042007'
  },

  // 🧪 SMALL PROJECTS (Built for fun and practice only)
  {
    id: 'default-5',
    title: 'Vector Velocity WebGL Playground',
    description: 'Built for fun & graphics practice: High-speed 3D WebGL space racing game engine focusing on particle systems, GLSL shaders, and custom physics.',
    tech_stack: ['WebGL', 'Three.js', 'GLSL Shaders', 'JavaScript'],
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLZobGPRpElDvJN7xzga9UvEaQTp4H7JiQzota2xge8xNtEjdU-2cdxGHL4es1QfscbXjRcZLWwSn7fFZGCsS73vgmcRBZWEtDixC1IKryLYVQkA64VQ2P7j70TRZY77_SSBJS5xmRW9F9VwPhVIJmFPioU7PZoC-GxG3EPh-TAMx1SL5ac8ttgVdXdVtb-q5bS6wTcKxg-DmSDhqaBgfit0YMY7HhSSAem4AbWwSyzihnB8eLsTVHHYnQt2jHd8QAhUW12jIZreU',
    featured: false,
    category: 'small',
    live_url: '#',
    github_url: 'https://github.com/Singh08042007'
  },
  {
    id: 'default-6',
    title: 'Engineering Notes Repository',
    description: 'Built for practice & documentation: A centralized repository of markdown-based technical documentation and interactive notes for core CS subjects.',
    tech_stack: ['Markdown', 'Docusaurus', 'Git', 'React'],
    image_url: 'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=1000&auto=format&fit=crop',
    featured: false,
    category: 'small',
    live_url: '#',
    github_url: 'https://github.com/Singh08042007'
  }
];

// Default Fallback Certifications
const defaultCertifications: Certification[] = [
  {
    id: 'cert-1',
    title: 'Deep Neural Networks Specialist',
    issuer: 'NVIDIA Deep Learning Institute',
    issue_date: '2024-03-12',
    certificate_url: 'https://nvidia.com',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyB9X50QvwbEbdA3ShSw42G-dJ7eWQeAY3XyDusKiYLsJc43E_yiODxX3yUcj09NyNNNOuDMP5ASnHGSqLmwGWn1bwAUz7y0DSRqyRfjeKp6xYelyp6knRvdCmoNymc-LG6OvJyHh9R_PFXdhPL19RSntY6K90Rghgle1teA9plpbuGswp5IbvkUTIPTr5kqQTxSaFw9Gugto_veG9j9uxrrJo4n_VsGVoMFt1SL6b8BSKD2eO3cIXd0Tuy_OGHvoDYbd686YcFAc',
    created_at: 'ai'
  },
  {
    id: 'cert-2',
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    issue_date: '2024-02-18',
    certificate_url: 'https://aws.amazon.com',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJzx22mtvwgNfDLwhoYlsU6UPb0eqy7Nb2sqifuXJmGx4EFWADQUdudtHjivisY3ikNTbJhwJilLUFteVPZu_1bx8wfGFmElVI0IsaL6n0D3cZEA4ltfUCbZm7pDCOO6iivsYuecSuztq0w9bQKpBvrL_fso-OwVFO-mT6Yl5aZ50PyRPhGehdRKTmMNLonCb3H1geBNP68nSugYbsqFpOJa-P8aGlabKy6qVVjv01Dzmo9SKP2_9I-WpakpFmykvZREhPEcvxFQ8',
    created_at: 'cloud'
  },
  {
    id: 'cert-3',
    title: 'Full-Stack Engineering',
    issuer: 'Meta Professional Certification',
    issue_date: '2023-11-05',
    certificate_url: 'https://coursera.org',
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOnIC0wJKkx8I6EcU8MGMB9aTGRCzZSVJjlH7Y7GqWzXCa4Hi6g2iRr164JqsZKwbVZGH0B4aIlRbYDs4QW00_76KnmlAWGVyjnWTcoqRq8hEj4Qrs7PY6FskDJeovUzZRkxzvjupQAACFtHhaZ5Crc79e-Ru9U3_7LG6lnP1uir_EX7eSmIcFDrmnLDcpzmUeDzSBCfPOISdUac8bpgPUvQsRfHDei-slD_aGgbCXKe89209WiH5kWR6lid1P8drI8sMO5rSAab8',
    created_at: 'web-dev'
  },
  {
    id: 'cert-4',
    title: 'TensorFlow Developer Certificate',
    issuer: 'Google Brain / TensorFlow',
    issue_date: '2023-09-20',
    certificate_url: 'https://tensorflow.org',
    image_url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop',
    created_at: 'ai'
  },
  {
    id: 'cert-5',
    title: 'Data Science & Machine Learning',
    issuer: 'IBM Professional Certification',
    issue_date: '2023-07-15',
    certificate_url: 'https://ibm.com',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    created_at: 'ai'
  }
];

export default function ArchivePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai' | 'web-dev' | 'cloud'>('all');

  // Lightbox modal state
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  useEffect(() => {
    // Session visitor ID
    let visitorId = localStorage.getItem('ds_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('ds_visitor_id', visitorId);
    }
    
    portfolioService.trackPageView('/archive', visitorId);

    async function loadData() {
      try {
        const [projData, certData] = await Promise.all([
          portfolioService.getProjects(),
          portfolioService.getCertificates(),
        ]);

        const rawProjects = projData.length > 0 ? projData : defaultProjects;
        
        let localCategories: Record<string, string> = {};
        try {
          localCategories = JSON.parse(localStorage.getItem('ds_project_categories') || '{}');
        } catch (e) {}

        const mergedProjects = rawProjects.map((p) => ({
          ...p,
          category: (localCategories[p.id] || p.category) as any,
        }));

        setProjects(mergedProjects);
        
        // Match Supabase's certifications logic
        // If Supabase doesn't specify categories directly, we can check title keywords
        const parsedCerts = certData.map(c => {
          let category = 'web-dev';
          const titleLower = c.title.toLowerCase();
          const issuerLower = c.issuer.toLowerCase();
          if (titleLower.includes('neural') || titleLower.includes('ai') || titleLower.includes('intelligence') || titleLower.includes('learning')) {
            category = 'ai';
          } else if (titleLower.includes('aws') || titleLower.includes('cloud') || titleLower.includes('azure') || issuerLower.includes('amazon')) {
            category = 'cloud';
          }
          return { ...c, created_at: category }; // Store category temporarily in created_at mapping
        });

        setCertifications(parsedCerts.length > 0 ? parsedCerts : defaultCertifications);
      } catch (err) {
        console.error('Failed to load archive data:', err);
        setProjects(defaultProjects);
        setCertifications(defaultCertifications);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleProjectClick = (projectId: string) => {
    let visitorId = localStorage.getItem('ds_visitor_id');
    portfolioService.trackProjectView(projectId, visitorId || 'anonymous');
  };

  // Categorization filter state for projects
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<'all' | 'flagship' | 'hackathon' | 'small'>('all');

  const getProjectCategory = (p: Project): 'flagship' | 'hackathon' | 'small' => {
    if (p.category === 'flagship' || p.category === 'hackathon' || p.category === 'small') {
      return p.category;
    }
    const descLower = (p.description || '').toLowerCase();
    const titleLower = (p.title || '').toLowerCase();
    if (descLower.includes('hackathon') || descLower.includes('sprint') || titleLower.includes('hack') || descLower.includes('vault heist')) {
      return 'hackathon';
    }
    if (p.featured || descLower.includes('erp') || descLower.includes('comprehensive') || descLower.includes('flagship') || descLower.includes('copilot')) {
      return 'flagship';
    }
    return 'small';
  };

  const flagshipProjects = projects.filter(p => getProjectCategory(p) === 'flagship');
  const hackathonProjects = projects.filter(p => getProjectCategory(p) === 'hackathon');
  const smallProjects = projects.filter(p => getProjectCategory(p) === 'small');

  // Filter certifications based on search query and category tab
  const filteredCerts = certifications.filter((cert) => {
    const certCategory = cert.created_at || 'all'; // using created_at hack to hold category
    const matchesCategory = activeFilter === 'all' || certCategory === activeFilter;
    
    const matchesSearch = 
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sliding Certificate Carousel state
  const [certSlideIndex, setCertSlideIndex] = useState(0);
  const [isCertPaused, setIsCertPaused] = useState(false);
  const [certViewMode, setCertViewMode] = useState<'slider' | 'grid'>('slider');

  // Auto-play sliding effect (moves to the right every 3.5 seconds)
  useEffect(() => {
    if (isCertPaused || filteredCerts.length <= 1 || certViewMode !== 'slider') return;
    const timer = setInterval(() => {
      setCertSlideIndex((prev) => (prev + 1) % filteredCerts.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isCertPaused, filteredCerts.length, certViewMode]);

  const handleNextCert = () => {
    if (filteredCerts.length === 0) return;
    setCertSlideIndex((prev) => (prev + 1) % filteredCerts.length);
  };

  const handlePrevCert = () => {
    if (filteredCerts.length === 0) return;
    setCertSlideIndex((prev) => (prev - 1 + filteredCerts.length) % filteredCerts.length);
  };

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto min-h-screen">
      {/* Page Title */}
      <section className="mb-16">
        <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface mb-2 font-extrabold tracking-tight">Neural Archive</h1>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">A curated collection of research, engineering feats, and technical certifications representing the intersection of artificial intelligence and systems design.</p>
      </section>

      {/* Certificates Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-headline-lg text-2xl md:text-3xl text-primary-fixed font-bold">Certificates</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-primary-container/10 border border-primary-fixed/30 text-[10px] font-mono font-bold text-primary-fixed uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed blink-dot"></span>
                {certViewMode === 'slider' ? 'Auto-Sliding' : 'Grid View'}
              </span>
            </div>
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider">Validated technical proficiency • Hover to pause slide</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search credentials..."
                className="w-full sm:w-56 bg-surface-container-low/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 font-label-md text-xs focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all search-glow"
              />
            </div>
            
            {/* Filters Tabs */}
            <div className="flex gap-1.5">
              {(['all', 'ai', 'web-dev', 'cloud'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => { setActiveFilter(filter); setCertSlideIndex(0); }}
                  className={`px-3 py-1 rounded-lg font-label-sm text-[11px] font-semibold uppercase tracking-wider transition-colors border ${
                    activeFilter === filter 
                      ? 'bg-primary-container/20 text-primary-fixed border-primary-fixed'
                      : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-primary-fixed/40'
                  }`}
                >
                  {filter === 'web-dev' ? 'Web Dev' : filter}
                </button>
              ))}
            </div>

            {/* Slider / Grid View Toggle & Controls */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-3">
              <button 
                onClick={() => setCertViewMode(certViewMode === 'slider' ? 'grid' : 'slider')}
                title={certViewMode === 'slider' ? 'Switch to Grid View' : 'Switch to Sliding View'}
                className="p-2 rounded-lg bg-surface-container-low border border-white/10 text-on-surface-variant hover:text-primary-fixed hover:border-primary-fixed/30 transition-all"
              >
                <span className="material-symbols-outlined text-sm">{certViewMode === 'slider' ? 'grid_view' : 'view_carousel'}</span>
              </button>

              {certViewMode === 'slider' && (
                <div className="flex items-center gap-1">
                  <button 
                    onClick={handlePrevCert}
                    title="Previous Certificate"
                    className="p-2 rounded-lg bg-surface-container-low border border-white/10 text-on-surface-variant hover:text-primary-fixed hover:border-primary-fixed/30 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                  </button>
                  <button 
                    onClick={handleNextCert}
                    title="Next Certificate"
                    className="p-2 rounded-lg bg-surface-container-low border border-white/10 text-on-surface-variant hover:text-primary-fixed hover:border-primary-fixed/30 transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Certificates Showcase Container */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary-fixed border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="col-span-full text-center py-12 glass-card rounded-xl">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
            <p className="text-on-surface-variant font-body-md">No credentials found matching your parameters.</p>
          </div>
        ) : certViewMode === 'slider' ? (
          /* 🚀 SEAMLESS CONTINUOUS INFINITE MARQUEE LOOP VIEW MODE */
          <div 
            className="relative overflow-hidden w-full py-4 mask-gradient group/marquee"
            onMouseEnter={() => setIsCertPaused(true)}
            onMouseLeave={() => setIsCertPaused(false)}
          >
            {/* Left and Right Fade Overlays for Elegant Edge Transition */}
            <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#030305] to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#030305] to-transparent z-10 pointer-events-none" />

            {/* Continuous Marquee Track */}
            <div 
              className="animate-infinite-marquee flex gap-6"
              style={{
                animationPlayState: isCertPaused ? 'paused' : 'running'
              }}
            >
              {/* Duplicate array 3x to guarantee 100% smooth infinite continuous loop */}
              {[...filteredCerts, ...filteredCerts, ...filteredCerts].map((cert, index) => (
                <div 
                  key={`${cert.id}-loop-${index}`} 
                  onClick={() => setSelectedCert(cert)}
                  className="w-[320px] md:w-[380px] lg:w-[420px] shrink-0 glass-card rounded-2xl group cursor-pointer border border-white/10 hover:border-primary-fixed/60 hover:shadow-[0_0_30px_rgba(0,240,255,0.25)] transition-all duration-300"
                >
                  <div className="relative h-56 overflow-hidden bg-black/50 border-b border-white/5">
                    <img 
                      src={cert.image_url} 
                      alt={cert.title} 
                      className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 bg-primary-fixed/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary-fixed/20 border border-primary-fixed flex items-center justify-center text-primary-fixed backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                        <span className="material-symbols-outlined text-2xl">zoom_in</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] text-primary-fixed uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-primary-container/10 border border-primary-fixed/20">
                        {cert.created_at === 'ai' ? 'AI & Machine Learning' : cert.created_at === 'cloud' ? 'Cloud Computing' : 'Web Development'}
                      </span>
                      <span className="font-mono text-[10px] text-on-surface-variant/60 font-semibold">
                        {cert.issue_date}
                      </span>
                    </div>
                    <h3 className="font-headline-md text-base md:text-lg font-bold text-on-surface group-hover:text-primary-fixed transition-colors line-clamp-1">{cert.title}</h3>
                    <p className="font-body-md text-xs text-on-surface-variant mt-1.5 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm text-primary-fixed/80">verified</span>
                      {cert.issuer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtitle Status Banner */}
            <div className="flex justify-center items-center gap-3 mt-6">
              <span className="font-mono text-[11px] text-on-surface-variant/70 uppercase tracking-widest flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isCertPaused ? 'bg-amber-400' : 'bg-emerald-400 blink-dot'}`}></span>
                {isCertPaused ? 'PAUSED ON HOVER (CLICK CARD TO VIEW)' : 'INFINITE SEAMLESS LOOP ACTIVE'}
              </span>
            </div>
          </div>
        ) : (
          /* 📱 STANDARD GRID VIEW MODE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.map((cert) => (
              <div 
                key={cert.id} 
                onClick={() => setSelectedCert(cert)}
                className="glass-card rounded-xl group cursor-pointer border border-white/10 hover:border-primary-fixed/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)] transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-black/40">
                  <img 
                    src={cert.image_url} 
                    alt={cert.title} 
                    className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary-fixed/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-fixed text-4xl">zoom_in</span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="font-label-sm text-xs text-primary-fixed uppercase tracking-wider font-bold">
                    {cert.created_at === 'ai' ? 'AI & Machine Learning' : cert.created_at === 'cloud' ? 'Cloud Computing' : 'Web Development'}
                  </span>
                  <h3 className="font-headline-md text-lg font-bold text-on-surface mt-1 group-hover:text-primary-fixed transition-colors">{cert.title}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant mt-2">{cert.issuer}</p>
                  <p className="font-label-md text-xs text-on-surface-variant/60 mt-1">Issued: {cert.issue_date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Neural Forge: Projects Section */}
      <section className="mb-20" id="projects">
        {/* Section Header & Filter Pills */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-semibold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-secondary blink-dot"></span>
              Neural Forge Repository
            </div>
            <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface font-extrabold tracking-tight">Neural Forge: Projects</h2>
            <p className="font-body-md text-sm md:text-base text-on-surface-variant max-w-xl mt-1">
              Curated software systems categorized by architectural depth, hackathon sprints, and skill practice.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Projects', icon: 'grid_view' },
              { id: 'flagship', label: 'Flagship Builds', icon: 'rocket_launch' },
              { id: 'hackathon', label: 'Hackathon Builds', icon: 'bolt' },
              { id: 'small', label: 'Small & Practice', icon: 'science' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setProjectCategoryFilter(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
                  projectCategoryFilter === tab.id
                    ? 'bg-primary-container/20 text-primary-fixed border-primary-fixed shadow-[0_0_15px_rgba(0,219,233,0.25)]'
                    : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-20">
            {/* 🚀 SECTION 1: FLAGSHIP PROJECTS */}
            {(projectCategoryFilter === 'all' || projectCategoryFilter === 'flagship') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-primary-fixed/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-container/20 border border-primary-fixed/40 flex items-center justify-center text-primary-fixed shadow-[0_0_15px_rgba(0,219,233,0.25)]">
                      <span className="material-symbols-outlined text-xl">rocket_launch</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-xl md:text-2xl text-on-surface font-bold">Flagship Projects</h3>
                      <p className="font-label-md text-xs text-primary-fixed font-semibold">Built with extensive time, deep effort, and production-grade architecture</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 bg-primary-container/10 border border-primary-fixed/30 rounded-full text-[10px] font-mono text-primary-fixed font-bold uppercase tracking-wider">
                    {flagshipProjects.length} Flagship {flagshipProjects.length === 1 ? 'Build' : 'Builds'}
                  </span>
                </div>

                {flagshipProjects.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {flagshipProjects.map((project) => (
                      <div 
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        className="glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer border border-primary-fixed/20 hover:border-primary-fixed/60 hover:shadow-[0_0_30px_rgba(0,219,233,0.2)] transition-all duration-500"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="bg-primary-container/20 text-primary-fixed border border-primary-fixed/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,219,233,0.2)]">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed blink-dot"></span>
                              Flagship Project
                            </span>
                            <div className="flex gap-3">
                              {project.github_url && (
                                <a 
                                  href={project.github_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors p-1.5 rounded-lg hover:bg-white/5"
                                >
                                  code
                                </a>
                              )}
                              {project.live_url && (
                                <a 
                                  href={project.live_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors p-1.5 rounded-lg hover:bg-white/5"
                                >
                                  open_in_new
                                </a>
                              )}
                            </div>
                          </div>
                          <h4 className="font-display-lg text-2xl md:text-3xl text-on-surface mb-3 font-bold group-hover:text-primary-fixed transition-colors">{project.title}</h4>
                          <p className="font-body-lg text-sm md:text-base text-on-surface-variant mb-6 leading-relaxed">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {project.tech_stack.map((tech, i) => (
                              <span key={i} className="px-3 py-1 bg-primary-container/10 border border-primary-fixed/20 text-primary-fixed rounded-lg text-xs font-mono font-semibold">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="relative h-64 w-full rounded-xl overflow-hidden mt-2 bg-black/40 border border-white/5">
                          <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 left-3 px-3 py-1 bg-background/80 backdrop-blur-md rounded-md text-[10px] font-mono text-primary-fixed border border-white/10 font-bold uppercase tracking-widest">
                            Production Ready
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant text-sm py-4 italic">No flagship projects found.</p>
                )}
              </div>
            )}

            {/* ⚡ SECTION 2: HACKATHON BUILDS */}
            {(projectCategoryFilter === 'all' || projectCategoryFilter === 'hackathon') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-secondary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/15 border border-secondary/40 flex items-center justify-center text-secondary shadow-[0_0_15px_rgba(236,178,255,0.25)]">
                      <span className="material-symbols-outlined text-xl">bolt</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-xl md:text-2xl text-on-surface font-bold">Hackathon Builds</h3>
                      <p className="font-label-md text-xs text-secondary font-semibold">Rapid prototypes built in hackathons under intense time limits & pressure</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 bg-secondary/10 border border-secondary/30 rounded-full text-[10px] font-mono text-secondary font-bold uppercase tracking-wider">
                    {hackathonProjects.length} Hackathon {hackathonProjects.length === 1 ? 'Build' : 'Builds'}
                  </span>
                </div>

                {hackathonProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hackathonProjects.map((project) => (
                      <div 
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        className="glass-card rounded-2xl p-6 flex flex-col justify-between group cursor-pointer border border-secondary/20 hover:border-secondary/60 hover:shadow-[0_0_25px_rgba(236,178,255,0.2)] transition-all duration-300"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="bg-secondary/15 text-secondary border border-secondary/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-xs">timer</span>
                              Hackathon Build
                            </span>
                            <div className="flex gap-2">
                              {project.github_url && (
                                <a 
                                  href={project.github_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors p-1 rounded hover:bg-white/5"
                                >
                                  code
                                </a>
                              )}
                              {project.live_url && (
                                <a 
                                  href={project.live_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors p-1 rounded hover:bg-white/5"
                                >
                                  open_in_new
                                </a>
                              )}
                            </div>
                          </div>
                          <h4 className="font-headline-md text-lg md:text-xl text-on-surface mb-2 font-bold group-hover:text-secondary transition-colors">{project.title}</h4>
                          <p className="font-body-md text-xs md:text-sm text-on-surface-variant mb-4 line-clamp-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.tech_stack.map((tech, i) => (
                              <span key={i} className="px-2.5 py-0.5 bg-secondary/10 text-secondary border border-secondary/20 rounded text-[10px] font-mono font-semibold">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-auto">
                          {project.image_url && (
                            <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black/40 border border-white/5">
                              <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant text-sm py-4 italic">No hackathon builds found.</p>
                )}
              </div>
            )}

            {/* 🧪 SECTION 3: SMALL PROJECTS (FUN & PRACTICE ONLY) */}
            {(projectCategoryFilter === 'all' || projectCategoryFilter === 'small') && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(0,245,160,0.25)]">
                      <span className="material-symbols-outlined text-xl">science</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-xl md:text-2xl text-on-surface font-bold">Small Projects</h3>
                      <p className="font-label-md text-xs text-emerald-400 font-semibold">Built for fun and practice only • Experimental tools & mini-engines</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    {smallProjects.length} Small {smallProjects.length === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                {smallProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {smallProjects.map((project) => (
                      <div 
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        className="glass-card rounded-2xl p-6 flex flex-col justify-between group cursor-pointer border border-emerald-500/20 hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(0,245,160,0.2)] transition-all duration-300"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-xs">sentiment_satisfied</span>
                              Fun & Practice
                            </span>
                            <div className="flex gap-2">
                              {project.github_url && (
                                <a 
                                  href={project.github_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="material-symbols-outlined text-on-surface-variant hover:text-emerald-400 transition-colors p-1 rounded hover:bg-white/5"
                                >
                                  code
                                </a>
                              )}
                              {project.live_url && (
                                <a 
                                  href={project.live_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()}
                                  className="material-symbols-outlined text-on-surface-variant hover:text-emerald-400 transition-colors p-1 rounded hover:bg-white/5"
                                >
                                  open_in_new
                                </a>
                              )}
                            </div>
                          </div>
                          <h4 className="font-headline-md text-lg md:text-xl text-on-surface mb-2 font-bold group-hover:text-emerald-400 transition-colors">{project.title}</h4>
                          <p className="font-body-md text-xs md:text-sm text-on-surface-variant mb-4 line-clamp-3">{project.description}</p>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.tech_stack.map((tech, i) => (
                              <span key={i} className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-mono font-semibold">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-auto">
                          {project.image_url && (
                            <div className="relative h-36 w-full rounded-xl overflow-hidden bg-black/40 border border-white/5">
                              <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-on-surface-variant text-sm py-4 italic">No small projects found.</p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Lightbox Modal for Certificate Viewer */}
      {selectedCert && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-2xl flex items-center justify-center p-6 transition-all duration-300">
          <button 
            onClick={() => setSelectedCert(null)}
            className="absolute top-6 right-6 text-on-surface hover:text-primary-fixed transition-colors flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">close</span>
          </button>
          
          <div className="max-w-4xl w-full glass-card rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <div className="relative aspect-video max-h-[500px] bg-black/60 flex items-center justify-center overflow-hidden">
              <img 
                src={selectedCert.image_url} 
                alt={selectedCert.title} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="p-6 md:p-8 bg-surface-container-lowest">
              <h2 className="font-headline-lg text-xl md:text-3xl text-primary-fixed mb-1 font-bold">{selectedCert.title}</h2>
              <p className="font-body-md text-sm md:text-base text-on-surface mb-2 font-medium">{selectedCert.issuer}</p>
              <p className="font-label-md text-xs text-on-surface-variant mb-6">Issued date: {selectedCert.issue_date}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center border-t border-white/5 pt-6">
                <p className="font-body-md text-xs text-on-surface-variant max-w-xl">
                  {selectedCert.id.startsWith('cert-') 
                    ? `Professional-grade certification validating technical competence, system architectures, and implementations.` 
                    : `Verified credential recorded on Supabase network registry.`}
                </p>
                {selectedCert.certificate_url && (
                  <a 
                    href={selectedCert.certificate_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-primary-container text-on-primary-container text-xs font-bold uppercase rounded-lg hover:shadow-[0_0_15px_rgba(0,219,233,0.3)] transition-all flex items-center gap-1.5 whitespace-nowrap self-stretch sm:self-auto text-center justify-center"
                  >
                    <span>Verify Credential</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
