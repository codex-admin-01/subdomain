
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { useLocation } from 'react-router-dom';
import { 
  ArrowLeftRight, Key, Send, Download, 
  CheckCircle, XCircle, Clock, Copy, Globe, User
} from 'lucide-react';

const Transfers: React.FC = () => {
  const { 
    currentUser, subdomains, users, transferRequests, 
    generateTransferKey, submitTransferClaim, handleTransferAction 
  } = useStore();
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSubdomainId = queryParams.get('subdomainId');

  const [claimKey, setClaimKey] = useState('');
  const [claimMsg, setClaimMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [selectedSubdomainId, setSelectedSubdomainId] = useState(initialSubdomainId || '');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const userSubs = subdomains.filter(s => s.userId === currentUser?.id);
  const incomingRequests = transferRequests.filter(r => r.senderId === currentUser?.id && r.status === 'requested');
  const outgoingRequests = transferRequests.filter(r => r.senderId === currentUser?.id);
  const myClaims = transferRequests.filter(r => r.receiverId === currentUser?.id);

  const handleGenerateKey = () => {
    if (!selectedSubdomainId) return;
    const key = generateTransferKey(selectedSubdomainId);
    setGeneratedKey(key);
  };

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimKey) return;
    const result = submitTransferClaim(claimKey);
    setClaimMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) setClaimKey('');
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    alert('Key copied to clipboard!');
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white">Domain Transfers</h1>
        <p className="text-slate-400">Move domains between accounts using secure secret keys.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Send Domain (Generate Key) */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 text-emerald-400">
            <Send size={24} />
            <h2 className="text-xl font-bold text-white">Initiate a Transfer</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Choose a domain you own to generate a unique secret key. Share this key with the person you want to transfer the domain to.
          </p>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Select Domain</label>
              <select
                value={selectedSubdomainId}
                onChange={(e) => {
                  setSelectedSubdomainId(e.target.value);
                  setGeneratedKey(null);
                }}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
              >
                <option value="">Choose a domain...</option>
                {userSubs.map(s => (
                  <option key={s.id} value={s.id}>{s.fullDomain}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={handleGenerateKey}
              disabled={!selectedSubdomainId}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Generate Transfer Key
            </button>

            {generatedKey && (
              <div className="p-4 bg-white/5 border border-emerald-500/30 rounded-2xl animate-in zoom-in-95">
                <p className="text-[10px] font-black uppercase text-emerald-400 mb-2">Secret Auth Key</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black/60 p-3 rounded-lg text-white font-mono text-lg tracking-widest">{generatedKey}</code>
                  <button onClick={() => copyKey(generatedKey)} className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-white">
                    <Copy size={20} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-3 italic">Share this key privately. Transfer will require your final approval.</p>
              </div>
            )}
          </div>
        </div>

        {/* Claim Domain (Enter Key) */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 text-cyan-400">
            <Download size={24} />
            <h2 className="text-xl font-bold text-white">Claim a Domain</h2>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Have a secret key from another user? Enter it below to start the transfer process into your account.
          </p>
          
          <form onSubmit={handleClaim} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Secret Key</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="E.G. XJ92KF82LS01"
                  value={claimKey}
                  onChange={(e) => setClaimKey(e.target.value.toUpperCase())}
                  className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
            </div>
            
            <button 
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
            >
              Submit Transfer Claim
            </button>

            {claimMsg && (
              <p className={`text-xs font-bold text-center ${claimMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {claimMsg.text}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Approval List */}
      {incomingRequests.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock size={20} className="text-amber-400" />
            Pending Your Approval
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {incomingRequests.map(req => {
              const sub = subdomains.find(s => s.id === req.subdomainId);
              const receiver = users.find(u => u.id === req.receiverId);
              return (
                <div key={req.id} className="bg-white/5 border border-amber-500/20 p-6 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400"><Globe size={16}/></div>
                    <p className="text-white font-bold truncate">{sub?.fullDomain}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <User size={12}/> To: <span className="text-white">{receiver?.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleTransferAction(req.id, 'approve')}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-black py-2 rounded-lg flex items-center justify-center gap-1"
                    >
                      <CheckCircle size={14}/> Approve
                    </button>
                    <button 
                      onClick={() => handleTransferAction(req.id, 'reject')}
                      className="flex-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-black py-2 rounded-lg border border-rose-500/20 flex items-center justify-center gap-1 transition-all"
                    >
                      <XCircle size={14}/> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* History Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Outgoing Transfers */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">Outgoing History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {outgoingRequests.map(req => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">
                      {subdomains.find(s => s.id === req.subdomainId)?.fullDomain}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase ${
                        req.status === 'completed' ? 'text-emerald-400' : 
                        req.status === 'requested' ? 'text-amber-400' :
                        req.status === 'cancelled' ? 'text-rose-500' : 'text-slate-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-500">{req.secretKey}</td>
                  </tr>
                ))}
                {outgoingRequests.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-600 italic">No transfers initiated.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Claims */}
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-lg font-bold text-white">My Claims</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4">Domain</th>
                  <th className="px-6 py-4">From</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {myClaims.map(req => (
                  <tr key={req.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">
                      {subdomains.find(s => s.id === req.subdomainId)?.fullDomain}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {users.find(u => u.id === req.senderId)?.name}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <span className={`text-[10px] font-bold uppercase ${
                        req.status === 'completed' ? 'text-emerald-400' : 
                        req.status === 'requested' ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {myClaims.length === 0 && (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-600 italic">No claims submitted.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfers;
