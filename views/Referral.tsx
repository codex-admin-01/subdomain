
import React from 'react';
import { useStore } from '../store';
import { Copy, Gift, Users, Coins } from 'lucide-react';

const Referral: React.FC = () => {
  const { currentUser, referrals, settings } = useStore();
  const userReferrals = referrals.filter(r => r.referrerId === currentUser?.id);
  const referralLink = `${window.location.origin}/#/ref/${currentUser?.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied!');
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Refer & Earn</h1>
        <p className="text-slate-400">Share your link and earn {settings.referralCommission}% commission on every purchase.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="text-emerald-400 mb-4"><Gift size={24}/></div>
          <h3 className="text-slate-400 text-sm font-medium">Total Commission</h3>
          <p className="text-2xl font-bold text-white">${currentUser?.balance.toFixed(2)}</p>
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
      </div>

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
  );
};

export default Referral;
