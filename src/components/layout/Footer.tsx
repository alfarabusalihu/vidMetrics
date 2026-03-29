'use client';

import { LegalModal } from '@/components/legal/LegalModal';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-100 bg-white w-full mt-auto">
      <div className="w-full py-2 sm:py-3 px-4 sm:px-8">
        {/* Mobile: single row everything inline */}
        <div className="flex flex-row items-center justify-between gap-4 py-2 sm:hidden">
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-black text-sm tracking-widest uppercase text-sky-800">VidMetrics</span>
          </div>
          <div className="flex items-center gap-3">
            <LegalModal type="privacy">
              <button className="text-neutral-400 hover:text-blue-900 transition-colors text-[10px] font-black uppercase tracking-wider cursor-pointer">Privacy</button>
            </LegalModal>
            <div className="h-3 w-px bg-neutral-300" />
            <LegalModal type="terms">
              <button className="text-neutral-400 hover:text-blue-900 transition-colors text-[10px] font-black uppercase tracking-wider cursor-pointer">Terms</button>
            </LegalModal>
          </div>
        </div>

        {/* Tablet + Desktop: two-row layout */}
        <div className="hidden sm:block">
          <div className="flex flex-col sm:flex-row items-baseline sm:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-black text-xl sm:text-2xl tracking-widest uppercase text-sky-800">VidMetrics</span>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                Advanced Quantitative Intelligence & Strategic Content Benchmarking Engine.
              </p>
            </div>
            <div className="text-neutral-500 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-left sm:text-right">
              Strategic SaaS by{' '}
              <span className="text-sky-800 font-black whitespace-nowrap">Alfar Dev</span>{' '}
              © {year}
            </div>
          </div>
          <div className="border-t border-neutral-100 mt-4 pt-4 flex items-center justify-center gap-12">
            <LegalModal type="privacy">
              <button className="text-neutral-400 hover:text-blue-900 transition-colors text-[11px] font-black uppercase tracking-widest cursor-pointer">Privacy</button>
            </LegalModal>
            <div className="h-4 w-px bg-neutral-400" />
            <LegalModal type="terms">
              <button className="text-neutral-400 hover:text-blue-900 transition-colors text-[11px] font-black uppercase tracking-widest cursor-pointer">Terms</button>
            </LegalModal>
          </div>
        </div>
      </div>
    </footer>
  );
}
