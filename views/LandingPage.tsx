
import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import { Globe, Shield, Zap, Clock, Search, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const { login, settings, subdomains, currentUser } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email)) {
      navigate(currentUser?.role === 'ADMIN' ? '/admin' : '/dashboard');
    } else {
      setError('Invalid email or account suspended.');
    }
  };

  const recentSubdomains = [...subdomains]
    .filter(s => s.status !== 'locked')
    .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
    .slice(0, 10);

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-6xl w-full text-center space-y-24 py-20 px-6">
        {/* Hero Section */}
        <header className="space-y-6 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-4">
            <span className="text-4xl">{settings.websiteLogo}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-tight">
            Your Brand, <br />
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Elevated Everywhere.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Secure premium subdomains in seconds. Automated DNS, 30-minute lock-in protection, and world-class Cloudflare infrastructure.
          </p>
          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <Link to="/whois" className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-md">
              Check Availability
            </Link>
            {currentUser ? (
              <Link 
                to={currentUser.role === 'ADMIN' ? '/admin' : '/dashboard'}
                className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/20 flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <a href="#login" className="bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/20">
                Get Started Now
              </a>
            )}
          </div>
        </header>

        {/* Centered Login Area (Only for guests) */}
        {!currentUser && (
          <div id="login" className="flex justify-center scroll-mt-32">
            <main className="max-w-md w-full">
              <form onSubmit={handleLogin} className="space-y-4 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl text-left hover:border-white/20 transition-all">
                <div className="space-y-2 mb-6">
                  <h2 className="text-xl font-bold text-white">Sign In to Dashboard</h2>
                  <p className="text-slate-400 text-sm">Enter your email to manage your subdomains</p>
                </div>
                
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    Access Dashboard
                  </button>
                  {error && <p className="text-rose-400 text-sm text-center">{error}</p>}
                </div>
                
                <p className="text-slate-500 text-xs text-center mt-6">
                  Hint: Try <code className="text-emerald-400">admin@subhub.com</code> or <code className="text-emerald-400">john@gmail.com</code>
                </p>
              </form>
            </main>
          </div>
        )}

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Globe, title: 'Instant Setup', desc: 'Active in minutes with automated Cloudflare DNS propagation.' },
            { icon: Shield, title: 'Safe Lock', desc: 'Secure any domain for 30 minutes while you complete payment.' },
            { icon: Zap, title: 'Refer & Earn', desc: 'Get lifetime commission for every friend who joins.' },
          ].map((feature, idx) => (
            <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm text-left hover:bg-white/[0.07] transition-all border border-transparent hover:border-white/10">
              <div className="text-emerald-400 mb-4"><feature.icon size={32} /></div>
              <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </section>

        {/* Bottom Registration Feed Section */}
        <section className="space-y-8 max-w-4xl mx-auto border-t border-white/5 pt-16">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400">Live Registration Feed</h2>
            </div>
            <h3 className="text-3xl font-bold text-white">Recently Claimed Names</h3>
            <p className="text-slate-500 text-sm">Real-time registrations happening across our network.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {recentSubdomains.map((sub, idx) => (
              <div 
                key={sub.id} 
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-all group animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Globe size={16} />
                  </div>
                  <div>
                    <p className="text-white font-mono text-sm font-medium">{sub.fullDomain}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-tighter">
                      <Clock size={10} />
                      <span>{new Date(sub.registrationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-emerald-400/50 uppercase border border-emerald-400/20 px-2 py-0.5 rounded">Verified</span>
                </div>
              </div>
            ))}
            {recentSubdomains.length === 0 && (
              <div className="md:col-span-2 p-12 rounded-2xl border border-dashed border-white/10 text-center text-slate-500">
                Waiting for first registration...
              </div>
            )}
          </div>
        </section>

        <footer className="pt-20 pb-10 text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} {settings.websiteName}. All rights reserved. Powered by Cloudflare Infrastructure.
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
