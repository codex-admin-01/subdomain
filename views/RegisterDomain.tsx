
import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, Clock, CreditCard } from 'lucide-react';

const RegisterDomain: React.FC = () => {
  const { mainDomains, subdomains, registerSubdomain } = useStore();
  const navigate = useNavigate();

  const [subName, setSubName] = useState('');
  const [selectedDomainId, setSelectedDomainId] = useState(mainDomains[0]?.id || '');
  const [period, setPeriod] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<'available' | 'taken' | null>(null);

  const handleSearch = () => {
    if (!subName) return;
    setIsSearching(true);
    setSearchResult(null);

    // Simulate search
    setTimeout(() => {
      const selectedMain = mainDomains.find(d => d.id === selectedDomainId);
      const fullDomain = `${subName}.${selectedMain?.domain}`;
      const exists = subdomains.some(s => s.fullDomain === fullDomain);
      
      setSearchResult(exists ? 'taken' : 'available');
      setIsSearching(false);
    }, 800);
  };

  const handleRegister = () => {
    if (searchResult !== 'available') return;
    const invoice = registerSubdomain(subName, selectedDomainId, period);
    if (invoice) {
      navigate('/invoices');
    }
  };

  const selectedMain = mainDomains.find(d => d.id === selectedDomainId);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Find your perfect subdomain</h1>
        <p className="text-slate-400">Premium names on our high-authority base domains.</p>
      </header>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-8 shadow-2xl">
        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-0">
            <input
              type="text"
              placeholder="brand-name"
              value={subName}
              onChange={(e) => {
                setSubName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                setSearchResult(null);
              }}
              className="flex-1 bg-black/40 border border-white/10 rounded-l-xl px-4 py-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
            <select
              value={selectedDomainId}
              onChange={(e) => {
                setSelectedDomainId(e.target.value);
                setSearchResult(null);
              }}
              className="bg-white/5 border-y border-r border-white/10 text-slate-300 px-4 focus:outline-none rounded-r-xl md:rounded-r-none border-l-0"
            >
              {mainDomains.map(d => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">.{d.domain}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
          >
            {isSearching ? 'Searching...' : <><Search size={20}/> Search</>}
          </button>
        </div>

        {/* Search Results */}
        {searchResult && (
          <div className={`p-6 rounded-2xl border ${
            searchResult === 'available' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'
          }`}>
            {searchResult === 'available' ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 text-white p-2 rounded-full"><CheckCircle size={24}/></div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Great news!</h3>
                    <p className="text-emerald-400/80">{subName}.{selectedMain?.domain} is available.</p>
                  </div>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-slate-400 text-sm">Monthly Price</p>
                  <p className="text-2xl font-black text-white">${selectedMain?.monthlyPrice}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="bg-rose-500 text-white p-2 rounded-full"><Clock size={24}/></div>
                <div>
                  <h3 className="text-xl font-bold text-white">Already taken</h3>
                  <p className="text-rose-400/80">Try adding a number or choosing a different base domain.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Configuration */}
        {searchResult === 'available' && (
          <div className="space-y-6 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock size={18} className="text-emerald-400" />
              Choose Registration Period
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 3, 6, 12].map((m) => (
                <button
                  key={m}
                  onClick={() => setPeriod(m)}
                  className={`p-4 rounded-xl border transition-all text-center ${
                    period === m 
                      ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                  }`}
                >
                  <div className="text-lg font-bold">{m} Month{m > 1 ? 's' : ''}</div>
                  <div className={`text-xs ${period === m ? 'text-emerald-100' : 'text-slate-500'}`}>
                    ${(selectedMain!.monthlyPrice * m).toFixed(2)} total
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
              <Clock className="text-amber-500 mt-1" size={20} />
              <div>
                <p className="text-amber-200 text-sm font-bold">Registration Lock Notice</p>
                <p className="text-amber-200/70 text-sm mt-1">
                  When you click register, this domain will be locked for 30 minutes. If the invoice is not paid within this window, the name will be released to the public.
                </p>
              </div>
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-emerald-50 transition-all shadow-xl"
            >
              <CreditCard size={20}/> Proceed to Checkout - ${(selectedMain!.monthlyPrice * period).toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterDomain;
