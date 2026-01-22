
import React from 'react';
import { useStore } from '../store';
import DashboardCard from '../components/DashboardCard';
import { Users, Globe, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const AdminDashboard: React.FC = () => {
  const { users, subdomains, invoices } = useStore();

  const stats = {
    totalUsers: users.length,
    activeSubs: subdomains.filter(s => s.status === 'active').length,
    suspendedSubs: subdomains.filter(s => s.status === 'suspended').length,
    unpaidInvoices: invoices.filter(i => i.status === 'unpaid').length,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
  };

  const chartData = [
    { name: 'Active', count: stats.activeSubs, color: '#10b981' },
    { name: 'Suspended', count: stats.suspendedSubs, color: '#f43f5e' },
    { name: 'Unpaid', count: stats.unpaidInvoices, color: '#fbbf24' },
    { name: 'Paid', count: stats.paidInvoices, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">System Overview</h1>
        <p className="text-slate-400">Manage global performance and infrastructure.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <DashboardCard label="Total Users" value={stats.totalUsers} icon={Users} color="slate" />
        <DashboardCard label="Active Domains" value={stats.activeSubs} icon={Globe} color="emerald" />
        <DashboardCard label="Suspended" value={stats.suspendedSubs} icon={AlertTriangle} color="rose" />
        <DashboardCard label="Unpaid Invoices" value={stats.unpaidInvoices} icon={FileText} color="amber" />
        <DashboardCard label="Paid Invoices" value={stats.paidInvoices} icon={CheckCircle} color="cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-6">System Health Breakdown</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {subdomains.slice(0, 6).reverse().map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all group">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Globe size={16} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-white text-sm font-medium truncate">{sub.fullDomain}</p>
                  <p className="text-slate-500 text-xs truncate">Registered {new Date(sub.registrationDate).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {subdomains.length === 0 && <p className="text-center text-slate-500 py-12">No recent activity.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
