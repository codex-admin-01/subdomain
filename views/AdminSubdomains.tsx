
import React from 'react';
import { useStore } from '../store';
import { Power, Trash2, Calendar, User } from 'lucide-react';

const AdminSubdomains: React.FC = () => {
  const { subdomains, users, toggleSubdomainStatus, setSubdomains } = useStore();

  const getOwnerName = (userId: string) => {
    return users.find(u => u.id === userId)?.name || 'Unknown User';
  };

  const deleteSubdomain = (id: string) => {
    if (window.confirm("Delete this subdomain? This will remove all DNS records.")) {
      setSubdomains(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Subdomain Management</h1>
          <p className="text-slate-400">Control all active and pending subdomains.</p>
        </div>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Subdomain</th>
                <th className="px-6 py-4 font-semibold">Owner</th>
                <th className="px-6 py-4 font-semibold">Expires</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {subdomains.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{sub.fullDomain}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <User size={14}/> {getOwnerName(sub.userId)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={14}/> {new Date(sub.expiryDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${
                      sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                      sub.status === 'suspended' ? 'bg-rose-500/10 text-rose-400' :
                      'bg-slate-500/10 text-slate-400'
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => toggleSubdomainStatus(sub.id)}
                        title={sub.status === 'active' ? 'Suspend' : 'Activate'}
                        className={`p-2 rounded-lg transition-colors ${
                          sub.status === 'active' ? 'text-amber-400 hover:bg-amber-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        <Power size={18} />
                      </button>
                      <button 
                        onClick={() => deleteSubdomain(sub.id)}
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSubdomains;
