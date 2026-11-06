import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-16 relative">
      <div className="relative rounded-3xl p-8 md:p-14 glass-panel-glow overflow-hidden text-center">
        {/* Glow Spheres */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Members Club</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
            Unlock Unpublished <span className="gold-gradient-text">Suites & Privileges</span>
          </h2>

          <p className="text-slate-400 text-sm mt-3 mb-8 leading-relaxed">
            Receive private allocations, invitation-only hotel openings, and seasonal member rates directly to your inbox.
          </p>

          {subscribed ? (
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-center gap-2 text-emerald-300 text-sm font-semibold animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Welcome to AURA Private Reserve. Your exclusive membership welcome packet has been dispatched.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your private email..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all whitespace-nowrap"
              >
                Join Members Club
              </button>
            </form>
          )}

          <p className="text-[11px] text-slate-500 mt-4">
            Zero spam. We respect your confidentiality. Unsubscribe at any time with one click.
          </p>
        </div>
      </div>
    </section>
  );
};
