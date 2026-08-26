'use client';

import React, { useState, useEffect, useRef } from 'react';

interface InitializingScreenProps {
  onComplete: () => void;
}

export default function InitializingScreen({ onComplete }: InitializingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep ref synced
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const logs = [
    'Initializing Cognitive Compute Fabric...',
    'Authenticating Supabase Neural Data Pipeline...',
    'Loading AI & Machine Learning Architectures...',
    'Structuring High-Throughput Executive Interfaces...',
    'Security Matrix Status: SECURED',
    'System Initialization Complete. Launching Portfolio...',
  ];

  const handleFinish = () => {
    setFadingOut(true);
    setTimeout(() => {
      onCompleteRef.current();
    }, 400);
  };

  useEffect(() => {
    // 2.2 Seconds Total Duration - Strict 3.0s Hard Limit
    const startTime = performance.now();
    const duration = 2200;

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (pct > 85) setCurrentLogIndex(5);
      else if (pct > 70) setCurrentLogIndex(4);
      else if (pct > 50) setCurrentLogIndex(3);
      else if (pct > 30) setCurrentLogIndex(2);
      else if (pct > 15) setCurrentLogIndex(1);

      if (pct >= 100) {
        clearInterval(interval);
        handleFinish();
      }
    }, 25);

    // Hard fallback timeout: GUARANTEED unblock after 2.8 seconds MAX
    const maxTimeout = setTimeout(() => {
      clearInterval(interval);
      handleFinish();
    }, 2800);

    return () => {
      clearInterval(interval);
      clearTimeout(maxTimeout);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#030307] text-slate-100 flex flex-col items-center justify-center p-6 transition-all duration-500 select-none ${
        fadingOut ? 'opacity-0 pointer-events-none scale-105 blur-sm' : 'opacity-100'
      }`}
    >
      {/* Background Animated Scanline Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-16 w-full animate-scanline pointer-events-none" />

      {/* Ambient Neon Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-[160px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />

      {/* Futuristic Corner HUD Markers */}
      <div className="absolute top-6 left-6 font-mono text-[10px] text-cyan-400/70 tracking-widest uppercase hidden sm:block">
        [ SYS: ONLINE // PORT 3000 ]
      </div>
      <div className="absolute top-6 right-6 font-mono text-[10px] text-emerald-400/70 tracking-widest uppercase hidden sm:block">
        [ MATRIX AUTH: VERIFIED ]
      </div>

      {/* Main Boot Box Container */}
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-white/20 shadow-[0_0_60px_rgba(0,240,255,0.2)] relative z-10 flex flex-col items-center text-center space-y-6 bg-[#080a14]/90 backdrop-blur-2xl">
        
        {/* Glowing Double Cybernetic Logo Rings */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-400/40 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-purple-500/40 animate-pulse" />
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-white/10" strokeWidth="2.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path
              className="text-cyan-400 drop-shadow-[0_0_10px_#00f0ff]"
              strokeDasharray={`${progress}, 100`}
              strokeWidth="2.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono text-lg font-black text-white tracking-tighter">{progress}%</span>
            <span className="font-mono text-[8px] text-cyan-400 tracking-widest uppercase">SYNC</span>
          </div>
        </div>

        {/* System Title & Cyber Badge */}
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-2.5 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            SYSTEM INITIALIZING
          </div>
          <h2 className="font-display-lg text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300 tracking-wider uppercase drop-shadow">
            DEEPINDER SINGH
          </h2>
          <p className="font-mono text-xs text-slate-400 mt-1 tracking-widest">NEURAL COMPUTE FABRIC v4.2</p>
        </div>

        {/* High-Tech Progress Bar */}
        <div className="w-full space-y-2">
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden relative p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 transition-all duration-100 ease-out shadow-[0_0_15px_#00f0ff]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between font-mono text-[10px] text-slate-400 tracking-wider">
            <span>LOAD: {progress}%</span>
            <span className="text-cyan-400 font-bold">STATUS: {progress >= 100 ? 'READY' : 'BOOTING...'}</span>
          </div>
        </div>

        {/* Dynamic Log Feed Box */}
        <div className="w-full bg-[#05060b] p-3.5 rounded-xl border border-white/10 text-left font-mono text-xs text-slate-300 min-h-[48px] flex items-center gap-2.5 shadow-inner">
          <span className="material-symbols-outlined text-cyan-400 text-base animate-spin">sync</span>
          <span className="line-clamp-1 text-slate-200">{logs[currentLogIndex]}</span>
        </div>

      </div>

      {/* Instant Skip Control in Bottom Right */}
      <button
        onClick={handleFinish}
        className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-slate-300 hover:text-white font-mono text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 shadow-lg"
      >
        SKIP INTRO ↵
      </button>
    </div>
  );
}
