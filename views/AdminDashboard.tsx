
import React from 'react';
import { useStore } from '../store';
import DashboardCard from '../components/DashboardCard';
import { Users, Globe, AlertTriangle, FileText, CheckCircle, TrendingUp, DollarSign, Activity, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { users, subdomains, invoices, getRevenueStats } = useStore();
  const stats = getRevenueStats();

  const primaryStats = {
    totalUsers: users.length,
    activeSubs: subdomains.filter(s => s.status === 'active').length,
    suspendedSubs: subdomains.filter(s => s.status === 'suspended').length,
    unpaidInvoices: invoices.filter(i => i.status === 'unpaid').length,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
  };

  const chartData = [
    { name: 'Active', count: primaryStats.activeSubs, color: '#10b981' },
    { name: 'Suspended', count: primaryStats.suspendedSubs, color: '#f43f5e' },
    { name: 'Unpaid', count: primaryStats.unpaidInvoices, color: '#fbbf24' },
    { name: 'Paid', count: primaryStats.paidInvoices, color: '#06b6d4' },
  ];

  // Mock revenue history
  const revHistory = [
    { day: 'Mon', revenue: stats.monthlyRevenue * 0.1 },
    { day: 'Tue', revenue: stats.monthlyRevenue * 0.15 },
    { day: 'Wed', revenue: stats.monthlyRevenue * 0.2 },
    { day: 'Thu', revenue: stats.monthlyRevenue * 0.12 },
    { day: 'Fri', revenue: stats.monthlyRevenue * 0.25 },
    { day: 'Sat', revenue: stats.monthlyRevenue * 0.08 },
    { day: 'Sun', revenue: stats.dailyRevenue },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">System Intelligence</h1>
          <p className="text-slate-400">Monitoring platform growth, revenue, and infrastructure health.</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Real-time Stats Active</span>
        </div>
      </header>

      {/* Revenue Dashboard Tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-1">
          <DashboardCard label="Monthly Recurring (MRR)" value={`$${stats.mrr.toFixed(2)}`} icon={TrendingUp} color="emerald" />
        </div>
        <DashboardCard label="Daily Revenue" value={`$${stats.dailyRevenue.toFixed(2)}`} icon={DollarSign} color="cyan" />
        <DashboardCard label="Monthly Rev" value={`$${stats.monthlyRevenue.toFixed(2)}`} icon={Activity} color="blue" />
        <DashboardCard label="Churn Rate" value={`${stats.churnRate.toFixed(1)}%`} icon={PieChart} color="rose" />
        <DashboardCard label="Expiring (30d)" value={stats.expiringSoon} icon={AlertTriangle} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-400" /> Revenue Flow (Last 7 Days)
            </h2>
            <select className="bg-black/40 border border-white/10 text-slate-400 text-xs rounded-lg px-3 py-1.5 focus:outline-none">
              <option>Weekly View</option>
              <option>Monthly View</option>
            </select>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revHistory}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                   itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown & Status */}
        <div className="space-y-8">
           <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
            <h2 className="text-lg font-bold text-white mb-6">Inventory Health</h2>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} width={70} />
                  <Tooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                <p className="text-[10px] uppercase font-black text-emerald-500/60 mb-1">Active</p>
                <p className="text-xl font-bold text-white">{primaryStats.activeSubs}</p>
              </div>
              <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                <p className="text-[10px] uppercase font-black text-amber-500/60 mb-1">Unpaid</p>
                <p className="text-xl font-bold text-white">{primaryStats.unpaidInvoices}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
             <h2 className="text-white font-bold mb-2">Churn Alert</h2>
             <p className="text-slate-400 text-sm leading-relaxed mb-6">
               Your current churn is <strong>{stats.churnRate.toFixed(1)}%</strong>. Most drops occur during the first 3 months.
             </p>
             <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all border border-white/10 text-sm">
               View Churn Analysis
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
