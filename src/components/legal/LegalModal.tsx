'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface LegalModalProps {
  type: 'privacy' | 'terms';
  children: React.ReactNode;
}

export function LegalModal({ type, children }: LegalModalProps) {
  const isPrivacy = type === 'privacy';
  
  return (
    <Dialog>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar bg-white border border-neutral-200 shadow-xl rounded-2xl p-8 md:p-12">
        <DialogHeader className="mb-8 border-b border-neutral-200 pb-6">
          <DialogTitle className="text-3xl font-black tracking-tight text-neutral-900">
            {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
          </DialogTitle>
          <p className="text-neutral-500 font-medium text-sm mt-2">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </DialogHeader>

        <div className="space-y-8 text-neutral-700 leading-relaxed font-medium">
          {isPrivacy ? (
            <>
              <section className="space-y-4">
                <h3 className="text-lg font-black text-neutral-900 uppercase tracking-widest">1. Information Collection and Use</h3>
                <p>
                  VidMetrics collects non-personally-identifying information of the sort that web browsers and servers typically make available, such as the browser type, language preference, referring site, and the date and time of each visitor request. Our purpose in collecting non-personally identifying information is to better understand how VidMetrics' visitors use its website and analytics tools.
                </p>
                <p>
                  For the processing of YouTube channel data, we strictly utilize the official YouTube Data API v3. We only access and analyze publicly available statistical data, including view counts, subscriber ranges, and engagement metrics. VidMetrics does not store personal credentials or request access to private Google accounts.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-black text-neutral-900 uppercase tracking-widest">2. AI Processing Data Flow</h3>
                <p>
                  When a user requests a "Strategic AI Insight," aggregated, anonymized channel statistics are temporarily transmitted to Google's Generative AI (Gemini) endpoints for processing. No personal identifiers are included in these payloads. The AI analysis focuses strictly on algorithmic trends and market positioning. Data sent for analysis is not used by our partners logic models to train future AI iterations.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-lg font-black text-neutral-900 uppercase tracking-widest">3. Cookies and Telemetry</h3>
                <p>
                  To enrich and perfect your experience, VidMetrics uses "Cookies," similar technologies and services provided by others to display personalized content, appropriate advertising, and store your preferences on your computer. We use local storage primarily to maintain your Zustand application state (e.g., your preferred channel list and analysis history).
                </p>
              </section>

               <section className="space-y-4">
                <h3 className="text-lg font-black text-neutral-900 uppercase tracking-widest">4. Security</h3>
                <p>
                  The security of your Personal Information is critically important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-4">
                 <h3 className="text-lg font-black text-neutral-900 uppercase tracking-widest">1. Acceptance of Terms</h3>
                <p>
                  By accessing the VidMetrics platform, you are agreeing to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this platform are protected by applicable copyright and trademark law.
                </p>
              </section>

              <section className="space-y-4">
                 <h3 className="text-lg font-black text-neutral-900 uppercase tracking-widest">2. API Rate Limiting and Fair Use</h3>
                <p>
                  VidMetrics interfaces with external providers (Google YouTube API, Google Generative AI). Users are subjected to global rate limits to ensure stability across the software infrastructure. Automated scraping, reverse engineering of the "Crushing Score" algorithm, or programmatic abuse of the AI Insight generator will result in immediate termination of platform access.
                </p>
              </section>

               <section className="space-y-4">
                 <h3 className="text-lg font-black text-neutral-900 uppercase tracking-widest">3. Financial Disclaimer</h3>
                <p>
                  Any strategic insights, including the "Potential Monthly Revenue" estimations provided by VidMetrics, are purely speculative forecasts based on aggregated algorithmic trends. They do not constitute financial advice. VidMetrics makes no warranties regarding the accuracy of revenue or RPM predictions.
                </p>
              </section>

              <section className="space-y-4">
                 <h3 className="text-lg font-black text-neutral-900 uppercase tracking-widest">4. Intellectual Property</h3>
                <p>
                  VidMetrics, its "Crushing Score" calculation matrix, and the underlying SaaS architecture (developed by Alfar Dev) are intellectual property protected by copyright. Users may organically share the generated reports, but may not white-label or resell the infrastructure without explicit corporate consent.
                </p>
              </section>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
