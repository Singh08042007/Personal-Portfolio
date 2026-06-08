'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isZanqir = pathname === '/zanqir';

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface/40 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(0,219,233,0.1)]">
      <div className="flex justify-between items-center max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop h-20">
        <Link href="/" className="font-display-lg text-2xl md:text-3xl tracking-tighter text-primary-fixed font-bold hover:opacity-80 transition-opacity">
          DS
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center">
          <Link 
            href="/#about" 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary-fixed hover:bg-white/5 transition-all duration-300 px-3 py-1.5 rounded"
          >
            Research
          </Link>
          <Link 
            href="/#experience" 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary-fixed hover:bg-white/5 transition-all duration-300 px-3 py-1.5 rounded"
          >
            Experience
          </Link>
          <Link 
            href="/archive" 
            className={`font-label-md text-label-md hover:text-primary-fixed hover:bg-white/5 transition-all duration-300 px-3 py-1.5 rounded ${
              pathname === '/archive' ? 'text-primary-fixed bg-white/5 border-b-2 border-primary-fixed rounded-b-none' : 'text-on-surface-variant'
            }`}
          >
            Projects & Archive
          </Link>
          <Link 
            href="/#skills" 
            className="font-label-md text-label-md text-on-surface-variant hover:text-primary-fixed hover:bg-white/5 transition-all duration-300 px-3 py-1.5 rounded"
          >
            Expertise
          </Link>
          <Link 
            href="/zanqir" 
            className={`font-label-md text-label-md hover:text-secondary hover:bg-white/5 transition-all duration-300 px-3 py-1.5 rounded ${
              pathname === '/zanqir' ? 'text-secondary bg-white/5 border-b-2 border-secondary rounded-b-none' : 'text-on-surface-variant'
            }`}
          >
            Zanqir
          </Link>
          
          <Link 
            href="/#contact"
            className="bg-primary-container text-on-primary-container font-label-md text-label-md px-6 py-2.5 rounded-full scale-95 active:scale-90 transition-transform font-semibold text-center"
          >
            Connect
          </Link>


        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-primary-fixed flex items-center p-2"
        >
          <span className="material-symbols-outlined">{isOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Navigation Panel */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-2xl border-b border-white/10 px-margin-mobile py-6 flex flex-col gap-4">
          <Link 
            href="/#about" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-on-surface-variant hover:text-primary-fixed py-2 border-b border-white/5"
          >
            Research
          </Link>
          <Link 
            href="/#experience" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-on-surface-variant hover:text-primary-fixed py-2 border-b border-white/5"
          >
            Experience
          </Link>
          <Link 
            href="/archive" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-on-surface-variant hover:text-primary-fixed py-2 border-b border-white/5"
          >
            Projects & Archive
          </Link>
          <Link 
            href="/#skills" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-on-surface-variant hover:text-primary-fixed py-2 border-b border-white/5"
          >
            Expertise
          </Link>
          <Link 
            href="/zanqir" 
            onClick={() => setIsOpen(false)}
            className="font-label-md text-on-surface-variant hover:text-secondary py-2 border-b border-white/5"
          >
            Zanqir
          </Link>
          <Link 
            href="/#contact"
            onClick={() => setIsOpen(false)}
            className="bg-primary-container text-on-primary-container font-label-md py-3 rounded-full text-center font-bold block"
          >
            Connect
          </Link>

        </div>
      )}
    </nav>
  );
}
