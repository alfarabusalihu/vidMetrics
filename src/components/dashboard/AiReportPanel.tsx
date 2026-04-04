'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useAnalysisStore } from '@/store/useAnalysisStore';
import { usePdfExport } from '@/hooks/usePdfExport';
import { Activity, Layout, Target, Zap, FileDown, TrendingUp, DollarSign } from 'lucide-react';
import { LoadingDiamond } from '@/components/ui/LoadingDiamond';

export function AiReportPanel() {
  const { showAiReport, setShowAiReport, aiLoading, aiReport, result } = useAnalysisStore();
  const { exportChannelReport } = usePdfExport();

  const handleDownloadPdf = () => {
    if (result && aiReport) {
      exportChannelReport(result, aiReport);
    }
  };

  return (
    <AnimatePresence>
      {showAiReport && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="w-full space-y-8"
        >
          <div className="canvas-card p-4 sm:p-6 md:p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 blur-[100px] rounded-full translate-x-32 -translate-y-32" />
            
            <div className="absolute top-6 right-6 z-30">
              <LoadingDiamond 
                loading={aiLoading} 
                onClick={() => setShowAiReport(false)} 
                className={aiReport ? 'hover:bg-red-50' : ''}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
              <div className="space-y-2 pr-16">
                <h4 className="text-[10px] text-sky-400 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <Activity className="h-4 w-4 animate-pulse text-sky-500" /> 
                  AI Channel Intelligence Report
                </h4>
                <p className="text-2xl font-black text-neutral-900 tracking-tight">
                  Strategic Benchmarking & Analysis
                </p>
              </div>

              {aiReport && (
                <button
                  onClick={handleDownloadPdf}
                  className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-xl flex items-center gap-3 transition-all group cursor-pointer shadow-sm"
                >
                  <FileDown className="h-5 w-5 text-sky-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-neutral-600">Download Report</span>
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
              {aiLoading ? (
                <div className="col-span-full space-y-8 animate-pulse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="space-y-3">
                      <div className="h-2 w-32 bg-neutral-200 rounded" />
                      <div className="h-4 w-full bg-neutral-100 rounded-xl" />
                      <div className="h-4 w-3/4 bg-neutral-100 rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : aiReport ? (
                <>
                  {/* Left Column: Strategic Overview */}
                  <div className="space-y-12">
                    <div className="space-y-4">
                      <div className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <Layout className="h-3 w-3" /> Market Positioning
                      </div>
                      <p className="text-lg text-neutral-900 font-medium leading-relaxed border-l-2 border-sky-500/30 pl-6 py-2">
                        {aiReport.marketPosition}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="glass-panel p-6 space-y-2 bg-sky-500/5 border-sky-500/10">
                          <div className="text-[9px] text-sky-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="h-3 w-3" /> Efficiency Index
                          </div>
                          <div className="text-xl font-black text-neutral-900">
                            {result?.channel.score}%
                          </div>
                       </div>
                       <div className="glass-panel p-6 space-y-2 bg-emerald-500/5 border-emerald-500/10 shadow-sm">
                          <div className="text-[9px] text-emerald-600 font-black uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="h-3 w-3" /> Potential Monthly Value
                          </div>
                          <div className="text-xl font-black text-neutral-900">
                            {aiReport.revenueEstimate}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Right Column: Priority Improvements */}
                  <div className="space-y-6">
                    <div className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Target className="h-3 w-3" /> Strategic Action Items
                    </div>
                    <div className="space-y-4">
                      {aiReport.improvements.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex gap-4 items-start p-5 bg-white border border-neutral-200 shadow-sm rounded-xl hover:border-sky-500/20 hover:shadow-md transition-all group"
                        >
                          <div className="h-8 w-8 rounded-xl bg-sky-500/10 flex items-center justify-center shrink-0 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-white transition-all">
                            <span className="text-[12px] font-black text-sky-600 group-hover:text-white">{i + 1}</span>
                          </div>
                          <p className="text-neutral-700 text-sm font-medium leading-relaxed group-hover:text-neutral-900 transition-colors">{item}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-full pt-8 border-t border-neutral-200 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">VidMetrics AI Engine</div>
                       <div className="h-1 w-1 rounded-full bg-neutral-300" />
                       <div className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">Powered by Gemini 2.5 Flash</div>
                     </div>
                     <div className="flex gap-1 text-sky-500/50">
                        {[1,2,3,4,5].map(i => <Zap key={i} className="h-3 w-3 fill-current" />)}
                     </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

