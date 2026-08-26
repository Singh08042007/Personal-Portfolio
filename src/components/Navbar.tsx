'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isZanqir = pathname === '/zanqir';

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#030305]/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-fixed/20 to-secondary/20 border border-primary-fixed/30 flex items-center justify-center text-primary-fixed font-black tracking-tighter text-xl group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            DS
          </div>
          <div className="flex flex-col text-left">
            <span className="font-headline-md text-base md:text-lg text-on-surface font-extrabold tracking-tight group-hover:text-primary-fixed transition-colors">
              DEEPINDER SINGH
            </span>
            <span className="font-mono text-[9px] text-primary-fixed tracking-widest uppercase font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 blink-dot"></span>
              NEURAL ARCHITECT
            </span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1.5 lg:gap-2 items-center">
          <Link 
            href="/#about" 
            className="font-label-md text-xs text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider"
          >
            Research
          </Link>
          <Link 
            href="/#skills" 
            className="font-label-md text-xs text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider"
          >
            Expertise
          </Link>
          <Link 
            href="/#experience" 
            className="font-label-md text-xs text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider"
          >
            Timeline
          </Link>
          <Link 
            href="/archive" 
            className={`font-label-md text-xs transition-all duration-200 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider ${
              pathname === '/archive' 
                ? 'text-primary-fixed bg-primary-container/10 border border-primary-fixed/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            Projects
          </Link>
          <Link 
            href="/zanqir" 
            className={`font-label-md text-xs transition-all duration-200 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider ${
              pathname === '/zanqir' 
                ? 'text-secondary bg-secondary/10 border border-secondary/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
            }`}
          >
            Zanqir
          </Link>
          <a 
            href="https://deepindersinghresume.netlify.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className="font-label-md text-xs text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-all duration-200 px-3.5 py-2 rounded-lg font-semibold uppercase tracking-wider"
          >
            Resume
          </a>
          
          <Link 
            href="/#contact"
            className="btn-premium px-5 py-2 rounded-xl text-on-primary-fixed font-label-md text-xs font-bold tracking-wider uppercase ml-2 text-center shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            Initiate Contact
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-primary-fixed flex items-center p-2 rounded-lg border border-white/10 bg-white/5"
        >
          <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="md:hidden bg-[#050508]/95 backdrop-blur-2xl border-b border-white/10 px-margin-mobile py-6 flex flex-col gap-3">
          <Link 
            href="/#about" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-xs text-on-surface-variant hover:text-primary-fixed py-2.5 border-b border-white/5 uppercase font-semibold tracking-wider"
          >
            Research
          </Link>
          <Link 
            href="/#skills" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-xs text-on-surface-variant hover:text-primary-fixed py-2.5 border-b border-white/5 uppercase font-semibold tracking-wider"
          >
            Expertise
          </Link>
          <Link 
            href="/#experience" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-xs text-on-surface-variant hover:text-primary-fixed py-2.5 border-b border-white/5 uppercase font-semibold tracking-wider"
          >
            Timeline
          </Link>
          <Link 
            href="/archive" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-xs text-on-surface-variant hover:text-primary-fixed py-2.5 border-b border-white/5 uppercase font-semibold tracking-wider"
          >
            Projects & Archive
          </Link>
          <Link 
            href="/zanqir" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-xs text-on-surface-variant hover:text-secondary py-2.5 border-b border-white/5 uppercase font-semibold tracking-wider"
          >
            Zanqir Startup
          </Link>
          <a 
            href="https://deepindersinghresume.netlify.app/" 
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="font-label-md text-xs text-on-surface-variant hover:text-primary-fixed py-2.5 border-b border-white/5 uppercase font-semibold tracking-wider"
          >
            Resume
          </a>
          <Link 
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="btn-premium w-full py-3 rounded-xl text-on-primary-fixed font-label-md text-xs font-bold tracking-wider uppercase text-center mt-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            Initiate Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
