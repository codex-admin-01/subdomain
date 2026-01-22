
import React, { useState } from 'react';
import { useStore } from '../store';
import { ShieldAlert, Plus, Trash2, ShieldCheck, AlertCircle, Ban, Search, Star, Globe, DollarSign } from 'lucide-react';

const AdminAbuse: React.FC = () => {
  const { forbiddenKeywords, addForbiddenKeyword, removeForbiddenKeyword, reservedNames, mainDomains, addReservedName, removeReservedName } = useStore();
  const [activeTab, setActiveTab] = useState<'blacklist' | 'reserved'>('blacklist');
  
  // Blacklist States
  const [newKeyword, setNewKeyword] = useState('');
  const [search, setSearch] = useState('');

  // Reserved States
  const [newReserved, setNewReserved] = useState({ name: '', mainDomainId: mainDomains[0]?.id || '', price: 0 });

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    addForbiddenKeyword(newKeyword.trim());
    setNewKeyword('');
  };

  const handleAddReserved = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReserved.name.trim() || newReserved.price <= 0) return;
    addReservedName(newReserved);
    setNewReserved({ ...newReserved, name: '', price: 0 });
  };

  const filteredKeywords = forbiddenKeywords.filter(k => 
    k.word.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReserved = reservedNames.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Security & Reservations</h1>
        <p className="text-slate-400">Manage blacklisted keywords and premium reserved domains.</p>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        <button 
          onClick={() => { setActiveTab('blacklist'); setSearch(''); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'blacklist' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Ban size={16} /> Forbidden Blacklist
        </button>
        <button 
          onClick={() => { setActiveTab('reserved'); setSearch(''); }}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
            activeTab === 'reserved' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Star size={16} /> Premium Reserved
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Management Form Column */}
        <div className="lg:col-span-1 space-y-6">
          {activeTab === 'blacklist' ? (
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6 animate-in fade-in slide-in-from-left-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus size={20} className="text-rose-400" /> Add Blacklist Word
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subdomains containing these words will be blocked from registration to prevent phishing/scams.
              </p>
              <form onSubmit={handleAddKeyword} className="space-y-4">
                <input 
                  type="text"
                  placeholder="E.g. phish, bank, login"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500/50"
                />
                <button 
                  type="submit"
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
                >
                  <Ban size={18} /> Blacklist Word
                </button>
              </form>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6 animate-in fade-in slide-in-from-left-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus size={20} className="text-amber-400" /> Reserve Premium Name
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manually reserve high-value names and set a fixed monthly price for anyone who wants them.
              </p>
              <form onSubmit={handleAddReserved} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Subdomain Name</label>
                  <input 
                    type="text"
                    placeholder="E.g. cloud, ai, dev"
                    value={newReserved.name}
                    onChange={(e) => setNewReserved({ ...newReserved, name: e.target.value.toLowerCase() })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Base Domain</label>
                  <select
                    value={newReserved.mainDomainId}
                    onChange={(e) => setNewReserved({ ...newReserved, mainDomainId: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                  >
                    {mainDomains.map(d => (
                      <option key={d.id} value={d.id}>.{d.domain}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Fixed Price ($/mo)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                      type="number"
                      step="0.01"
                      placeholder="99.99"
                      value={newReserved.price || ''}
                      onChange={(e) => setNewReserved({ ...newReserved, price: parseFloat(e.target.value) })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <Star size={18} /> Reserve & Set Price
                </button>
              </form>
            </div>
          )}

          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-white/10 backdrop-blur-xl space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" /> Active Protection
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitoring <strong>{forbiddenKeywords.length}</strong> patterns and <strong>{reservedNames.length}</strong> manual reservations.
            </p>
          </div>
        </div>

        {/* Search & List Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder={`Search ${activeTab === 'blacklist' ? 'blacklisted words' : 'reserved names'}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md min-h-[400px]">
            {activeTab === 'blacklist' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 animate-in fade-in">
                {filteredKeywords.map(kw => (
                  <div key={kw.id} className="bg-[#0a0c10] p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                        <ShieldAlert size={14} />
                      </div>
                      <div>
                        <p className="text-white font-mono font-bold">{kw.word}</p>
                        <p className="text-[10px] text-slate-500">Added {new Date(kw.addedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeForbiddenKeyword(kw.id)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {filteredKeywords.length === 0 && (
                  <div className="md:col-span-2 p-12 text-center text-slate-500 italic">No blacklisted words found.</div>
                )}
              </div>
            ) : (
              <div className="divide-y divide-white/5 animate-in fade-in">
                {filteredReserved.map(rn => {
                  const domain = mainDomains.find(d => d.id === rn.mainDomainId);
                  return (
                    <div key={rn.id} className="bg-[#0a0c10] p-6 flex items-center justify-between group transition-colors hover:bg-white/[0.02]">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                          <Star size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <p className="text-white font-black tracking-tight text-lg">{rn.name}.{domain?.domain}</p>
                             <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase px-1.5 py-0.5 rounded border border-amber-500/20">Reserved</span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-black">Fixed Price Accounted</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xl font-black text-white">${rn.price.toFixed(2)}</p>
                          <p className="text-[10px] text-slate-500 font-bold">PER MONTH</p>
                        </div>
                        <button 
                          onClick={() => removeReservedName(rn.id)}
                          className="p-3 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  );
                })}
                {filteredReserved.length === 0 && (
                  <div className="p-12 text-center text-slate-500 italic">No premium reserved names found.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbuse;
