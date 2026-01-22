
import React, { useState } from 'react';
import { useStore } from '../store';
import { ShieldAlert, Plus, Trash2, ShieldCheck, AlertCircle, Ban, Search } from 'lucide-react';

const AdminAbuse: React.FC = () => {
  const { forbiddenKeywords, addForbiddenKeyword, removeForbiddenKeyword } = useStore();
  const [newKeyword, setNewKeyword] = useState('');
  const [search, setSearch] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    addForbiddenKeyword(newKeyword.trim());
    setNewKeyword('');
  };

  const filteredKeywords = forbiddenKeywords.filter(k => 
    k.word.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Abuse Protection</h1>
        <p className="text-slate-400">Manage blacklisted keywords to prevent scam and phishing domains.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus size={20} className="text-emerald-400" /> Add Blacklist Word
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Domain names containing these words will be automatically blocked during registration.
            </p>
            <form onSubmit={handleAdd} className="space-y-4">
              <input 
                type="text"
                placeholder="E.g. phish, google, login"
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

          <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-500/10 to-amber-500/10 border border-rose-500/20 backdrop-blur-xl space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-400" /> Active Protection
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our automated system currently monitors for <strong>{forbiddenKeywords.length}</strong> forbidden patterns. Any attempt to bypass these is logged in the Audit Trail.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search blacklisted words..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
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
                <div className="md:col-span-2 p-12 text-center text-slate-500 italic">
                  No keywords found matching your search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbuse;
