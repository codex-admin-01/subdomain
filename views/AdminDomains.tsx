
import React, { useState } from 'react';
import { useStore } from '../store';
import { Shield, Plus, Key, Mail, DollarSign, Zap, Star } from 'lucide-react';

const AdminDomains: React.FC = () => {
  const { mainDomains, addMainDomain } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newDomain, setNewDomain] = useState({
    domain: '',
    cloudflareEmail: '',
    zoneId: '',
    apiKey: '',
    monthlyPrice: 0,
    premiumThreshold: 4,
    premiumPrice: 0,
    status: 'active' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMainDomain(newDomain);
    setShowAdd(false);
    setNewDomain({ domain: '', cloudflareEmail: '', zoneId: '', apiKey: '', monthlyPrice: 0, premiumThreshold: 4, premiumPrice: 0, status: 'active' });
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Base Domains</h1>
          <p className="text-slate-400">Configure root domains and Cloudflare API credentials.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          <Plus size={18}/> Add Root Domain
        </button>
      </header>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-emerald-500/20 p-8 rounded-3xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4">
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase">Root Domain</label>
            <input 
              required
              value={newDomain.domain}
              onChange={e => setNewDomain({...newDomain, domain: e.target.value})}
              placeholder="example.com"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase">Standard Price ($)</label>
              <input 
                required
                type="number"
                step="0.01"
                value={newDomain.monthlyPrice}
                onChange={e => setNewDomain({...newDomain, monthlyPrice: parseFloat(e.target.value)})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase">Prem. Price ($)</label>
              <input 
                required
                type="number"
                step="0.01"
                value={newDomain.premiumPrice}
                onChange={e => setNewDomain({...newDomain, premiumPrice: parseFloat(e.target.value)})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase">Premium Threshold (Length)</label>
            <input 
              required
              type="number"
              value={newDomain.premiumThreshold}
              onChange={e => setNewDomain({...newDomain, premiumThreshold: parseInt(e.target.value)})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase">Cloudflare Email</label>
            <input 
              required
              value={newDomain.cloudflareEmail}
              onChange={e => setNewDomain({...newDomain, cloudflareEmail: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase">Cloudflare Zone ID</label>
            <input 
              required
              value={newDomain.zoneId}
              onChange={e => setNewDomain({...newDomain, zoneId: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-slate-400 text-xs font-bold uppercase">Global API Key</label>
            <input 
              required
              type="password"
              value={newDomain.apiKey}
              onChange={e => setNewDomain({...newDomain, apiKey: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-4 mt-4">
            <button type="button" onClick={() => setShowAdd(false)} className="text-slate-400 px-6 py-2">Cancel</button>
            <button type="submit" className="bg-emerald-500 text-white px-8 py-2 rounded-xl font-bold">Save Domain</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mainDomains.map(d => (
          <div key={d.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400"><Shield size={24}/></div>
                <div>
                  <h3 className="text-xl font-bold text-white">.{d.domain}</h3>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                    d.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>{d.status}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-2xl font-black text-white">${d.monthlyPrice.toFixed(2)}</span>
                  <span className="text-[10px] font-medium text-slate-500">STD/mo</span>
                </div>
                <div className="flex items-baseline justify-end gap-1 text-amber-400">
                  <span className="text-lg font-black">${d.premiumPrice.toFixed(2)}</span>
                  <span className="text-[10px] font-medium">PREM/mo</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-2 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400"><Mail size={12}/> {d.cloudflareEmail}</div>
                <div className="flex items-center gap-1.5 text-amber-500/80 font-bold">
                  <Star size={10} /> Short Names ({d.premiumThreshold} chars)
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono"><Key size={12}/> {d.zoneId}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDomains;
