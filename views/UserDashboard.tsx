
import React from 'react';
import { useStore } from '../store';
import DashboardCard from '../components/DashboardCard';
import { Globe, AlertTriangle, FileText, Share2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const { currentUser, subdomains, invoices, referrals } = useStore();

  const userSubs = subdomains.filter(s => s.userId === currentUser?.id);
  const userInvoices = invoices.filter(i => i.userId === currentUser?.id);
  const activeCount = userSubs.filter(s => s.status === 'active').length;
  const suspendedCount = userSubs.filter(s => s.status === 'suspended').length;
  const unpaidCount = userInvoices.filter(i => i.status === 'unpaid').length;
  const referCount = referrals.filter(r => r.referrerId === currentUser?.id).length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {currentUser?.name}</h1>
          <p className="text-slate-400">Here's what's happening with your domains today.</p>
        </div>
        <Link 
          to="/get-domain" 
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
        >
          New Subdomain
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard label="Active Domains" value={activeCount} icon={Globe} color="emerald" />
        <DashboardCard label="Suspended" value={suspendedCount} icon={AlertTriangle} color="rose" />
        <DashboardCard label="Unpaid Invoices" value={unpaidCount} icon={FileText} color="amber" />
        <DashboardCard label="Referrals" value={referCount} icon={Share2} color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Domains */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">My Active Subdomains</h2>
            <Link to="/my-domains" className="text-emerald-400 text-sm flex items-center gap-1 hover:underline">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Domain</th>
                  <th className="px-6 py-4 font-semibold">IP Address</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {userSubs.slice(0, 5).map((sub) => (
                  <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{sub.fullDomain}</td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-sm">{sub.ip}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${
                        sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                        sub.status === 'suspended' ? 'bg-rose-500/10 text-rose-400' :
                        'bg-slate-500/10 text-slate-400'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {userSubs.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500 italic">No domains registered yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/20 rounded-2xl p-8 flex flex-col justify-center text-center backdrop-blur-xl">
          <p className="text-emerald-400 font-medium mb-1">Referral Balance</p>
          <h2 className="text-5xl font-black text-white">${currentUser?.balance.toFixed(2)}</h2>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            Earnings from your referrals are automatically credited to your balance.
          </p>
          <Link 
            to="/referrals" 
            className="mt-8 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/10"
          >
            Manage Referrals
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
