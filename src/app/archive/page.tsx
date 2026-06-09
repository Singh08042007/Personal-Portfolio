'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { portfolioService, Project, Certification } from '@/services/portfolioService';

// Default Fallback Projects (if DB is empty)
const defaultProjects: Project[] = [
  {
    id: 'default-1',
    title: 'College Life Management App',
    description: 'A comprehensive ERP-inspired ecosystem for students to manage schedules, academic resources, and campus integration. Built with React Native and Node.js.',
    tech_stack: ['React Native', 'Firebase', 'Tailwind CSS', 'Python'],
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCA2MQ76j0MMaVaJQHK837OGgOrvO2CY6Qzq2uwXvnkvxrEjB3dB8v95wucVVOJ2d92Ny8iiyq8PBJMUiTLLI3zZ_Ww59wlQ08Yvk04_PkG9bPwdzxyiTFLQPcQH1YC15cqEBIfc-HFZrtTTnvAwvCbMvZLlseg-yLXh-CYFx09sUcxZFCz2OHZftPaBrhY0-fbWvejCONScoGuvpB4La7y2BqC4UZ1PUMm2iIY2xATxplNSYU9DnSuF3dc1fVv5T9iYiwaXNajje4',
    featured: true,
    live_url: '#',
    github_url: '#'
  },
  {
    id: 'default-2',
    title: 'FinPilot',
    description: 'AI-powered financial assistant for micro-investing and portfolio optimization using predictive analytics.',
    tech_stack: ['Python', 'Scikit-learn', 'FastAPI'],
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    featured: false,
    live_url: '#',
    github_url: '#'
  },
  {
    id: 'default-3',
    title: 'Engineering Notes',
    description: 'A centralized repository of markdown-based technical documentation for core CS subjects.',
    tech_stack: ['Markdown', 'Docusaurus', 'Git'],
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    featured: false,
    live_url: '#',
    github_url: '#'
  },
  {
    id: 'default-4',
    title: 'Neural Chess',
    description: 'Unity-based 3D chess simulator with a custom alpha-beta pruning AI engine adversary.',
    tech_stack: ['Unity', 'C#', 'AI Engine'],
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBrkkaFlPoWBaz3zuzW0hvyvCZCNDsBdkNf0CAXBZKdgw-_m9XmqjS3_oT-2DfmNZsPKGN_ad1uEmt2cukbrRZc5gcyHKb_cC-hd43QcstQvXtB02nDhy1cuKB60rYEFBNjh25XaJzO5bY1GxD910Cwae3fYCTdbV2qD2KfJBZ2Dv7h1-s8YNs19OI1jvAc-8aKf8g8fWkc710vdUcxp2PNMp1Qt_44yWDom9IqDCzZ5m6cwIb1VqzjjiU7JSTrhEJbELRnu3rRx48',
    featured: false,
    live_url: '#',
    github_url: '#'
  },
  {
    id: 'default-5',
    title: 'Vector Velocity',
    description: 'High-speed 3D WebGL space racing game engine focusing on particle systems and custom physics.',
    tech_stack: ['WebGL', 'Three.js', 'Shader programming'],
    image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLZobGPRpElDvJN7xzga9UvEaQTp4H7JiQzota2xge8xNtEjdU-2cdxGHL4es1QfscbXjRcZLWwSn7fFZGCsS73vgmcRBZWEtDixC1IKryLYVQkA64VQ2P7j70TRZY77_SSBJS5xmRW9F9VwPhVIJmFPioU7PZoC-GxG3EPh-TAMx1SL5ac8ttgVdXdVtb-q5bS6wTcKxg-DmSDhqaBgfit0YMY7HhSSAem4AbWwSyzihnB8eLsTVHHYnQt2jHd8QAhUW12jIZreU',
    featured: false,
    live_url: '#',
    github_url: '#'
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
    created_at: 'ai' // Hack category in created_at for simplicity
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
        setProjects(projData.length > 0 ? projData : defaultProjects);
        
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

  // Filter certifications based on search query and category tab
  const filteredCerts = certifications.filter((cert) => {
    const certCategory = cert.created_at || 'all'; // using created_at hack to hold category
    const matchesCategory = activeFilter === 'all' || certCategory === activeFilter;
    
    const matchesSearch = 
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="pt-32 pb-24 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto min-h-screen">
      {/* Page Title */}
      <section className="mb-16">
        <h1 className="font-display-lg text-4xl md:text-6xl text-on-surface mb-2 font-extrabold tracking-tight">Neural Archive</h1>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">A curated collection of research, engineering feats, and technical certifications representing the intersection of artificial intelligence and systems design.</p>
      </section>

      {/* Certificates Section */}
      <section className="mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div>
            <h2 className="font-headline-lg text-2xl md:text-3xl text-primary-fixed font-bold">Certificates</h2>
            <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mt-1">Validated technical proficiency</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search credentials..."
                className="w-full sm:w-64 bg-surface-container-low/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 font-label-md text-sm focus:border-primary-fixed focus:ring-1 focus:ring-primary-fixed outline-none transition-all search-glow"
              />
            </div>
            
            {/* Filters Tabs */}
            <div className="flex gap-2">
              {(['all', 'ai', 'web-dev', 'cloud'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full font-label-sm text-xs font-semibold uppercase tracking-wider transition-colors border ${
                    activeFilter === filter 
                      ? 'bg-primary-container/20 text-primary-fixed border-primary-fixed'
                      : 'bg-surface-container-low border-white/5 text-on-surface-variant hover:border-primary-fixed/40'
                  }`}
                >
                  {filter === 'web-dev' ? 'Web Dev' : filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary-fixed border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.length > 0 ? (
              filteredCerts.map((cert) => (
                <div 
                  key={cert.id} 
                  onClick={() => setSelectedCert(cert)}
                  className="glass-card rounded-xl group cursor-pointer border border-white/10"
                >
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img 
                      src={cert.image_url} 
                      alt={cert.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary-fixed/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-fixed text-4xl">zoom_in</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <span className="font-label-sm text-xs text-primary-fixed uppercase tracking-wider font-bold">
                      {cert.created_at === 'ai' ? 'AI & Machine Learning' : cert.created_at === 'cloud' ? 'Cloud Computing' : 'Web Development'}
                    </span>
                    <h3 className="font-headline-md text-lg font-bold text-on-surface mt-1">{cert.title}</h3>
                    <p className="font-body-md text-sm text-on-surface-variant mt-2">{cert.issuer}</p>
                    <p className="font-label-md text-xs text-on-surface-variant/60 mt-1">Issued: {cert.issue_date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 glass-card rounded-xl">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
                <p className="text-on-surface-variant font-body-md">No credentials found matching your parameters.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Projects Section */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="font-headline-lg text-2xl md:text-3xl text-secondary font-bold">Neural Forge: Projects</h2>
          <p className="font-label-md text-xs text-on-surface-variant uppercase tracking-wider mt-1">Engineering functional systems</p>
        </div>

        {/* Bento Grid layout */}
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-fr">
            {/* Flagship Product - Col span 8 */}
            {projects[0] && (
              <div 
                onClick={() => handleProjectClick(projects[0].id)}
                className="md:col-span-6 lg:col-span-8 glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="bg-primary-container/10 text-primary-fixed border border-primary-fixed/30 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                      Flagship Product
                    </span>
                    <div className="flex gap-4">
                      {projects[0].github_url && (
                        <a 
                          href={projects[0].github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors"
                        >
                          code
                        </a>
                      )}
                      {projects[0].live_url && (
                        <a 
                          href={projects[0].live_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors"
                        >
                          open_in_new
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display-lg text-2xl md:text-3xl text-on-surface mb-2 font-bold">{projects[0].title}</h3>
                  <p className="font-body-lg text-sm md:text-base text-on-surface-variant mb-6">{projects[0].description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {projects[0].tech_stack.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-surface-container-highest rounded text-xs text-on-surface font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="relative h-64 w-full rounded-xl overflow-hidden mt-4 bg-black/40">
                  <img src={projects[0].image_url} alt={projects[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                </div>
              </div>
            )}

            {/* Project 2 - Col span 4 */}
            {projects[1] && (
              <div 
                onClick={() => handleProjectClick(projects[1].id)}
                className="md:col-span-6 lg:col-span-4 glass-card rounded-2xl p-6 md:p-8 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center border border-secondary/20">
                      <span className="material-symbols-outlined text-secondary">payments</span>
                    </div>
                    <div className="flex gap-4">
                      {projects[1].github_url && (
                        <a 
                          href={projects[1].github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors"
                        >
                          code
                        </a>
                      )}
                      {projects[1].live_url && (
                        <a 
                          href={projects[1].live_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors"
                        >
                          open_in_new
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="font-headline-md text-xl md:text-2xl text-on-surface mb-2 font-bold">{projects[1].title}</h3>
                  <p className="font-body-md text-sm text-on-surface-variant mb-6">{projects[1].description}</p>
                </div>
                <div className="mt-auto space-y-4">
                  {projects[1].image_url && (
                    <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4 bg-black/40">
                      <img src={projects[1].image_url} alt={projects[1].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {projects[1].tech_stack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-surface-container-highest rounded text-[10px] text-on-surface">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-3/4 shadow-[0_0_8px_rgba(236,178,255,0.6)]"></div>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant font-semibold">Status: Active Development</span>
                  </div>
                </div>
              </div>
            )}

            {/* Project 3 - Col span 4 */}
            {projects[2] && (
              <div 
                onClick={() => handleProjectClick(projects[2].id)}
                className="md:col-span-3 lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:border-primary-fixed/40 group"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-label-sm text-[10px] text-primary-fixed uppercase tracking-wider font-mono">Bento Node // 03</span>
                    <div className="flex gap-4">
                      {projects[2].github_url && (
                        <a 
                          href={projects[2].github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors"
                        >
                          code
                        </a>
                      )}
                      {projects[2].live_url && (
                        <a 
                          href={projects[2].live_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors"
                        >
                          open_in_new
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="font-headline-md text-lg md:text-xl text-on-surface mb-2 font-bold">{projects[2].title}</h3>
                  <p className="font-body-md text-xs text-on-surface-variant mb-4">{projects[2].description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {projects[2].tech_stack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-surface-container-highest rounded text-[10px] text-on-surface-variant">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto space-y-4">
                  {projects[2].image_url && (
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black/40">
                      <img src={projects[2].image_url} alt={projects[2].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="flex -space-x-2 mt-2">
                    <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-fixed flex items-center justify-center text-on-primary-fixed text-[10px] font-bold">DS</div>
                    <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-on-surface text-[10px]">+8</div>
                  </div>
                </div>
              </div>
            )}

            {/* Project 4 - Image Cover Grid - Col span 4 */}
            {projects[3] && (
              <div 
                onClick={() => handleProjectClick(projects[3].id)}
                className="md:col-span-3 lg:col-span-4 glass-card rounded-2xl overflow-hidden relative group cursor-pointer aspect-square md:aspect-auto"
              >
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  {projects[3].github_url && (
                    <a 
                      href={projects[3].github_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="material-symbols-outlined text-white hover:text-primary-fixed transition-colors bg-black/50 p-1.5 rounded-full backdrop-blur-sm"
                    >
                      code
                    </a>
                  )}
                  {projects[3].live_url && (
                    <a 
                      href={projects[3].live_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="material-symbols-outlined text-white hover:text-primary-fixed transition-colors bg-black/50 p-1.5 rounded-full backdrop-blur-sm"
                    >
                      open_in_new
                    </a>
                  )}
                </div>
                <img src={projects[3].image_url} alt={projects[3].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="font-headline-md text-lg md:text-xl text-on-surface font-bold">{projects[3].title}</h3>
                  <p className="font-label-md text-xs text-primary-fixed mt-1 font-semibold">{projects[3].tech_stack.slice(0,2).join(' • ')}</p>
                </div>
              </div>
            )}

            {/* Project 5 - Image Cover Grid - Col span 4 */}
            {projects[4] && (
              <div 
                onClick={() => handleProjectClick(projects[4].id)}
                className="md:col-span-6 lg:col-span-4 glass-card rounded-2xl overflow-hidden relative group cursor-pointer aspect-square md:aspect-auto"
              >
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  {projects[4].github_url && (
                    <a 
                      href={projects[4].github_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="material-symbols-outlined text-white hover:text-secondary transition-colors bg-black/50 p-1.5 rounded-full backdrop-blur-sm"
                    >
                      code
                    </a>
                  )}
                  {projects[4].live_url && (
                    <a 
                      href={projects[4].live_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      onClick={(e) => e.stopPropagation()}
                      className="material-symbols-outlined text-white hover:text-secondary transition-colors bg-black/50 p-1.5 rounded-full backdrop-blur-sm"
                    >
                      open_in_new
                    </a>
                  )}
                </div>
                <img src={projects[4].image_url} alt={projects[4].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="font-headline-md text-lg md:text-xl text-on-surface font-bold">{projects[4].title}</h3>
                  <p className="font-label-md text-xs text-secondary mt-1 font-semibold">{projects[4].tech_stack.slice(0,2).join(' • ')}</p>
                </div>
              </div>
            )}

            {/* Extra Projects List (If more than 5 exist in DB) */}
            {projects.slice(5).map((project) => (
              <div 
                key={project.id}
                onClick={() => handleProjectClick(project.id)}
                className="col-span-full md:col-span-6 lg:col-span-4 glass-card rounded-xl p-6 flex flex-col justify-between cursor-pointer hover:border-primary-fixed/40 group transition-all duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-headline-md text-lg font-bold text-on-surface">{project.title}</h3>
                    <div className="flex gap-2 shrink-0">
                      {project.github_url && (
                        <a 
                          href={project.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          onClick={(e) => e.stopPropagation()}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors"
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
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary-fixed transition-colors"
                        >
                          open_in_new
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant mb-4 line-clamp-3">{project.description}</p>
                </div>
                <div className="mt-auto space-y-4">
                  {project.image_url && (
                    <div className="relative h-40 w-full rounded-xl overflow-hidden bg-black/40">
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-surface-container-highest rounded text-[10px] text-on-surface">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
