
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Shield, Zap, Clock, Search, ArrowRight, Activity, ShieldCheck, Sparkles, Check, Star } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { login, settings, subdomains, currentUser, siteStatus } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, email.includes("admin") ? "Admin123!" : "User123!");
      navigate(email.includes("admin") ? "/admin" : "/dashboard");
    } catch {
      setError("Invalid email or password.");
    }
  };

  const scrollToLogin = () => {
    const el = document.getElementById('login');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const recentSubdomains = [...subdomains]
    .filter(s => s.status !== 'locked')
    .sort((a, b) => {
      const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
      const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 8);

  const isAllGood = siteStatus.every(s => s.status === 'operational');

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <div className="max-w-6xl w-full text-center space-y-32 py-24 px-6 relative z-10">
        
        {/* Floating System Status Badge */}
        <div className="flex justify-center animate-in fade-in slide-in-from-top-4 duration-1000">
           <Link to="/status" className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md group hover:bg-emerald-500/10 transition-all">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80">
               {isAllGood ? 'All Systems Operational' : 'Network Issues Detected'}
             </span>
             <ArrowRight size={10} className="text-emerald-500/40 group-hover:translate-x-0.5 transition-transform" />
           </Link>
        </div>

        {/* Hero Section */}
        <header className="space-y-8 animate-in fade-in slide-in-from-top-8 duration-1000 delay-200">
          <div className="inline-block p-4 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl mb-4 shadow-2xl relative">
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full -z-10 animate-pulse" />
            <span className="text-5xl">{settings.websiteLogo}</span>
          </div>
          
          <h1 className="text-6xl md:text-[7rem] font-black tracking-tight text-white leading-[1.1] md:leading-[0.9]">
            Own Your <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm">
              Digital Identity.
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Deploy premium subdomains on high-authority root domains. 
            Automated DNS, 30-minute lock-in protection, and world-class edge security.
          </p>
          
          <div className="pt-8 flex flex-wrap justify-center gap-4">
            <Link to="/whois" className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-md flex items-center gap-2 group">
              <Search size={20} className="text-emerald-400" /> WHOIS Lookup
            </Link>
            <button 
              onClick={scrollToLogin}
              className="bg-emerald-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/30 flex items-center gap-2 active:scale-95"
            >
              Get Started Now <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 pt-10 text-slate-500 grayscale opacity-40">
             <div className="flex items-center gap-2 font-black italic text-xl">Cloudflare</div>
             <div className="flex items-center gap-2 font-black italic text-xl">Stripe</div>
             <div className="flex items-center gap-2 font-black italic text-xl">Google</div>
          </div>
        </header>

        {/* Pricing Section */}
        <section className="space-y-16 py-12">
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">Simple Transparent Pricing</h2>
            <h3 className="text-5xl font-black text-white">Choose Your Plan</h3>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Scale from individual blogs to enterprise-grade infrastructure with our flexible subdomain tiers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {settings.pricingPlans.map((plan, idx) => (
              <div 
                key={plan.id} 
                className={`relative group flex flex-col p-10 rounded-[3rem] border backdrop-blur-xl transition-all duration-500 ${
                  plan.popular 
                    ? 'bg-emerald-500/10 border-emerald-500/30 ring-1 ring-emerald-500/20 scale-105 z-20 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                    <Star size={10} fill="currentColor" /> Most Popular
                  </div>
                )}

                <div className="mb-8 text-left">
                  <h4 className="text-xl font-bold text-white mb-2">{plan.name}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{plan.desc}</p>
                </div>

                <div className="mb-10 text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">{plan.price !== 'Custom' ? `$${plan.price}` : plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-slate-500 font-bold">/mo</span>}
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-10">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className="flex items-start gap-3 text-left">
                      <div className={`mt-1 p-0.5 rounded-full bg-${plan.color}-500/20 text-${plan.color}-400`}>
                        <Check size={12} />
                      </div>
                      <span className="text-sm text-slate-400 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={scrollToLogin}
                  className={`w-full py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                    plan.popular 
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-xl shadow-emerald-500/20' 
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  Select {plan.name} <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 border-y border-white/5">
          {[
            { icon: Sparkles, title: 'Instant Propagation', desc: 'Connected directly to Cloudflare Edge API for sub-second DNS updates.', color: 'emerald' },
            { icon: ShieldCheck, title: 'Purchase Protection', desc: 'Secure any domain for 30 minutes while finalizing payment. No sniping.', color: 'blue' },
            { icon: Activity, title: 'Revenue Share', desc: 'Earn 10% lifetime recurring commission on every user you refer.', color: 'cyan' },
          ].map((feature, idx) => (
            <div key={idx} className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-sm text-left hover:bg-white/[0.08] transition-all relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${feature.color}-500/10 blur-[80px] -z-10 group-hover:opacity-100 opacity-0 transition-opacity`} />
              <div className={`text-${feature.color}-400 mb-6 p-4 rounded-2xl bg-${feature.color}-500/10 w-fit group-hover:scale-110 transition-transform`}>
                <feature.icon size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-slate-400 text-lg leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Login Area (The Goal) */}
        {!currentUser && (
          <div id="login" className="flex justify-center scroll-mt-32 py-20">
            <main className="max-w-lg w-full">
              <div className="p-10 md:p-14 rounded-[3.5rem] bg-[#0f172a]/60 border border-white/10 backdrop-blur-2xl shadow-[0_0_100px_rgba(16,185,129,0.1)] text-left relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/10 blur-[100px] rounded-full" />
                
                <div className="space-y-3 mb-10 relative">
                  <h2 className="text-4xl font-black text-white">Join SubHub</h2>
                  <p className="text-slate-400 text-lg">Enter your email to access your personal dashboard.</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6 relative">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. john@doe.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-slate-600 font-medium"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-500 text-white font-black py-5 rounded-2xl hover:shadow-[0_20px_40px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    Enter Dashboard <ArrowRight size={22} />
                  </button>
                  {error && <p className="text-rose-400 font-bold text-center animate-bounce">{error}</p>}
                </form>
                
                <div className="mt-12 pt-10 border-t border-white/5">
                   <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest text-center mb-6">Demo Accounts</p>
                   <div className="flex flex-wrap justify-center gap-3">
                      {['admin@subhub.com', 'john@subhub.com'].map(demo => (
                        <button 
                          key={demo}
                          onClick={() => setEmail(demo)}
                          className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-400 text-xs font-mono hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                        >
                          {demo}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </main>
          </div>
        )}

        {/* Registration Feed Section */}
        <section className="space-y-12 max-w-5xl mx-auto pt-16">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-400">Network Activity</h2>
            </div>
            <h3 className="text-5xl font-black text-white">Recent Claims</h3>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">See what others are building on the SubHub network.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {recentSubdomains.map((sub, idx) => (
              <div 
                key={sub.id} 
                className="flex flex-col p-6 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-sm hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all group animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Globe size={20} />
                </div>
                <p className="text-white font-mono text-sm font-black mb-1 truncate">{sub.fullDomain}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-black">
                  <Clock size={10} className="text-slate-600" />
                  <span>{new Date(sub.registrationDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {recentSubdomains.length === 0 && (
              <div className="col-span-full p-20 rounded-[3rem] border-2 border-dashed border-white/5 text-center">
                <p className="text-slate-600 font-black uppercase tracking-widest">Network idle • Waiting for deployment</p>
              </div>
            )}
          </div>
        </section>

        <footer className="pt-32 pb-16 text-slate-600 text-sm border-t border-white/5">
          <div className="flex justify-center gap-8 mb-8 grayscale opacity-50">
             <div className="font-bold text-xs uppercase tracking-[0.2em]">SSL Secured</div>
             <div className="font-bold text-xs uppercase tracking-[0.2em]">24/7 Support</div>
             <div className="font-bold text-xs uppercase tracking-[0.2em]">MRR Ready</div>
          </div>
          <p className="font-medium">&copy; {new Date().getFullYear()} {settings.websiteName}. All rights reserved. Edge-Powered Subdomain Infrastructure.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
