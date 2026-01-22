
import React, { useState } from 'react';
import { useStore } from '../store';
import { Search, User, Mail, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Whois: React.FC = () => {
  const { subdomains, users, mainDomains, currentUser } = useStore();
  const [query, setQuery] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState(mainDomains[0]?.id || '');
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    const selectedMain = mainDomains.find(d => d.id === selectedDomainId);
    const fullDomain = `${query.toLowerCase()}.${selectedMain?.domain}`;
    
    const subdomain = subdomains.find(s => s.fullDomain === fullDomain);
    
    if (subdomain) {
      const owner = users.find(u => u.id === subdomain.userId);
      setResult({
        found: true,
        fullDomain,
        owner: owner ? { name: owner.name, email: owner.email } : { name: 'Unknown', email: 'N/A' },
        regDate: subdomain.registrationDate,
        expiryDate: subdomain.expiryDate,
        status: subdomain.status
      });
    } else {
      setResult({
        found: false,
        fullDomain
      });
    }
    setSearched(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pt-4">
      <header className="text-center space-y-2">
        <h1 className="text-3xl md:text-5xl font-black text-white">WHOIS Lookup</h1>
        <p className="text-slate-400">Search ownership details for any subdomain on our network.</p>
      </header>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-8 shadow-2xl">
        <form onSubmit={handleLookup} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-0">
            <input
              type="text"
              placeholder="subdomain"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-l-xl px-4 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <select
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              className="bg-white/5 border-y border-r border-white/10 text-slate-300 px-4 focus:outline-none rounded-r-xl md:rounded-r-none border-l-0"
            >
              {mainDomains.map(d => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">.{d.domain}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Search size={20}/> Lookup
          </button>
        </form>

        {searched && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {result.found ? (
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                  <div className="bg-rose-500 text-white p-3 rounded-full shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Domain Registered</h3>
                    <p className="text-rose-400/80">{result.fullDomain} is currently owned by another user.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <User size={14}/> Registrant Contact
                    </h4>
                    <div className="space-y-2">
                      <p className="text-white font-medium text-lg">{result.owner.name}</p>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Mail size={14}/>
                        <span className="truncate">{result.owner.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <Globe size={14}/> Domain Info
                    </h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Registered:</span>
                        <span className="text-white">{new Date(result.regDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Expires:</span>
                        <span className="text-rose-400 font-medium">{new Date(result.expiryDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-emerald-400 uppercase font-black text-xs">{result.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center md:text-left">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 text-white p-3 rounded-full shrink-0">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Available to Claim!</h3>
                      <p className="text-emerald-400/80">{result.fullDomain} is currently open for registration.</p>
                    </div>
                  </div>
                  <Link
                    to={currentUser ? "/get-domain" : "/#login"}
                    className="whitespace-nowrap bg-white text-black font-black px-8 py-3 rounded-xl hover:bg-emerald-50 transition-all shadow-xl"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer className="text-center text-slate-500 text-xs py-10">
        © {new Date().getFullYear()} Subdomain WHOIS Directory. All rights reserved.
      </footer>
    </div>
  );
};

export default Whois;
