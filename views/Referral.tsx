import React from 'react';
import { useStore } from '../store';
import { Copy, Gift, Users, Coins, ArrowRight, Wallet, Info } from 'lucide-react';
// Added missing Link import
import { Link } from 'react-router-dom';

const Referral: React.FC = () => {
  const { currentUser, referrals, settings, claimCommissions } = useStore();
  const userReferrals = referrals.filter(r => r.referrerId === currentUser?.id);
  const referralLink = `${window.location.origin}/#/ref/${currentUser?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  const totalEarned = userReferrals.reduce((acc, r) => acc + r.commission, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Refer & Earn</h1>
        <p className="text-slate-400">Share your link and earn {settings.referralCommission}% commission on every purchase.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-emerald-400 mb-4"><Gift size={24}/></div>
          <h3 className="text-slate-400 text-sm font-medium">Total Earned</h3>
          <p className="text-2xl font-bold text-white">${totalEarned.toFixed(2)}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-cyan-400 mb-4"><Users size={24}/></div>
          <h3 className="text-slate-400 text-sm font-medium">Total Referrals</h3>
          <p className="text-2xl font-bold text-white">{userReferrals.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-amber-400 mb-4"><Coins size={24}/></div>
          <h3 className="text-slate-400 text-sm font-medium">Commission Rate</h3>
          <p className="text-2xl font-bold text-white">{settings.referralCommission}%</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
          <div className="text-emerald-400 mb-4 flex justify-between items-center">
             <Wallet size={24}/>
             {currentUser?.autoTransferCommission && (
               <span className="text-[10px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded">Auto</span>
             )}
          </div>
          <h3 className="text-emerald-400 text-sm font-medium">Pending Claim</h3>
          <p className="text-2xl font-bold text-white">${currentUser?.pendingCommissions.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
              <h2 className="text-xl font-bold text-white mb-4">Your Referral Link</h2>
              <div className="flex gap-4">
                <input
                  readOnly
                  value={referralLink}
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-slate-300 font-mono text-sm focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-100 transition-all"
                >
                  <Copy size={18}/> Copy
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Recent Earnings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-semibold">Date</th>
                      <th className="px-6 py-4 font-semibold">Description</th>
                      <th className="px-6 py-4 font-semibold">Commission</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {userReferrals.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-slate-400 text-sm">{new Date(r.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-white">Referral Purchase Bonus</td>
                        <td className="px-6 py-4 text-emerald-400 font-bold">+${r.commission.toFixed(2)}</td>
                      </tr>
                    ))}
                    {userReferrals.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500">No earnings yet. Share your link to start earning!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl space-y-6 h-fit">
               <h3 className="text-xl font-bold text-white">Claim Commissions</h3>
               <p className="text-sm text-slate-400 leading-relaxed">
                  Referral earnings can be transferred directly to your wallet balance. Once claimed, funds can be used for new registrations or renewals.
               </p>
               
               <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                  <p className="text-xs text-slate-500 mb-1">Available to Claim</p>
                  <p className="text-3xl font-black text-emerald-400">${currentUser?.pendingCommissions.toFixed(2)}</p>
               </div>

               <button 
                 onClick={claimCommissions}
                 disabled={currentUser?.pendingCommissions === 0 || currentUser?.autoTransferCommission}
                 className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20"
               >
                 {currentUser?.autoTransferCommission ? 'Auto-Transfer Active' : 'Transfer to Wallet'} <ArrowRight size={18} />
               </button>

               <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <Info size={16} className="text-slate-500 mt-1 shrink-0" />
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                     Change your transfer preferences in your <Link to="/profile" className="text-emerald-400 underline">Profile Settings</Link>.
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Referral;