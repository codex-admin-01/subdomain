
import React from 'react';
import { useStore } from '../store';
import { CheckCircle, AlertTriangle, XCircle, Clock, ShieldCheck, Globe, Zap, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatusPage: React.FC = () => {
  const { siteStatus } = useStore();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle size={20} className="text-emerald-400" />;
      case 'degraded': return <AlertTriangle size={20} className="text-amber-400" />;
      case 'outage': return <XCircle size={20} className="text-rose-400" />;
      default: return null;
    }
  };

  const isAllGood = siteStatus.every(s => s.status === 'operational');

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-10 px-6">
      <header className="text-center space-y-4">
        <Link to="/" className="inline-block p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
          <span className="text-3xl">🚀</span>
        </Link>
        <h1 className="text-4xl md:text-6xl font-black text-white">System Status</h1>
        <p className="text-slate-400">Real-time health of SubHub's global infrastructure.</p>
      </header>

      {/* Global Indicator */}
      <div className={`p-8 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-2xl ${
        isAllGood ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'
      }`}>
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className={`p-4 rounded-full ${isAllGood ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-amber-500 text-white'}`}>
             {isAllGood ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isAllGood ? 'All Systems Operational' : 'Some Systems Degraded'}
            </h2>
            <p className="text-slate-400 text-sm mt-1">Verified {new Date().toLocaleTimeString()} by System Sentinel.</p>
          </div>
        </div>
        <div className="px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-white font-bold text-sm">
          99.98% 30-Day Uptime
        </div>
      </div>

      {/* Service List */}
      <div className="grid grid-cols-1 gap-4">
        {siteStatus.map((service, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:bg-white/[0.07] transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl text-slate-400 group-hover:scale-110 transition-transform">
                {service.service.includes('Cloudflare') ? <Globe size={20} /> : 
                 service.service.includes('Pay') ? <Zap size={20} /> : <Server size={20} />}
              </div>
              <div>
                <h3 className="text-white font-bold">{service.service}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{service.uptime} uptime</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-xl">
              <span className={`text-xs font-bold uppercase tracking-tighter ${
                service.status === 'operational' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {service.status}
              </span>
              {getStatusIcon(service.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Incident History (Mock) */}
      <div className="space-y-6 pt-10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock size={20} className="text-slate-500" /> Past Incidents
        </h2>
        <div className="space-y-4">
          <div className="p-6 rounded-2xl border border-white/5 bg-white/20 backdrop-blur-sm opacity-50">
            <p className="text-xs text-slate-500 mb-2">October 14, 2023</p>
            <h4 className="text-white font-bold mb-1">Degraded Performance: DNS API</h4>
            <p className="text-sm text-slate-400">Investigated elevated error rates during DNS record creation. Resolved in 24 minutes.</p>
          </div>
          <div className="p-6 rounded-2xl border border-white/5 bg-white/20 backdrop-blur-sm opacity-50">
            <p className="text-xs text-slate-500 mb-2">September 28, 2023</p>
            <h4 className="text-white font-bold mb-1">Scheduled Maintenance: Core Database</h4>
            <p className="text-sm text-slate-400">Database migration and index optimization completed successfully.</p>
          </div>
        </div>
      </div>

      <footer className="pt-20 text-center text-slate-600 text-sm">
        <p>Subscribe to status updates via Email or SMS.</p>
        <Link to="/" className="text-emerald-400 hover:underline mt-4 inline-block font-bold">Back to SubHub Marketplace</Link>
      </footer>
    </div>
  );
};

export default StatusPage;
