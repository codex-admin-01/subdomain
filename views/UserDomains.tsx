
import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings, Save, AlertCircle, ArrowLeftRight, TrendingUp, Power } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDomains: React.FC = () => {
  const { currentUser, subdomains, updateSubdomainIP, toggleAutoRenew } = useStore();
  const userSubs = subdomains.filter(s => s.userId === currentUser?.id);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempIP, setTempIP] = useState('');

  const startEditing = (id: string, ip: string) => {
    setEditingId(id);
    setTempIP(ip);
  };

  const saveIP = () => {
    if (editingId) {
      updateSubdomainIP(editingId, tempIP);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Manage My Domains</h1>
          <p className="text-slate-400">Update your DNS records and monitor uptime.</p>
        </div>
        <Link to="/transfers" className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2">
          <ArrowLeftRight size={18} /> Transfer Management
        </Link>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Full Domain</th>
                <th className="px-6 py-4 font-semibold">Expiry Date</th>
                <th className="px-6 py-4 font-semibold">IP Address</th>
                <th className="px-6 py-4 font-semibold text-center">Auto-Renew</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {userSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{sub.fullDomain}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-rose-400 font-medium">{new Date(sub.expiryDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === sub.id ? (
                      <input
                        type="text"
                        value={tempIP}
                        onChange={(e) => setTempIP(e.target.value)}
                        className="bg-black/40 border border-emerald-500/50 rounded px-2 py-1 text-white text-sm focus:outline-none"
                      />
                    ) : (
                      <span className="text-slate-400 font-mono text-sm">{sub.ip}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => toggleAutoRenew(sub.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        sub.autoRenew ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          sub.autoRenew ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      {sub.status === 'active' && (
                        <Link 
                          to={`/transfers?subdomainId=${sub.id}`}
                          title="Transfer Domain"
                          className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <ArrowLeftRight size={18} />
                        </Link>
                      )}
                      {editingId === sub.id ? (
                        <button onClick={saveIP} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                          <Save size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={() => startEditing(sub.id, sub.ip)}
                          disabled={sub.status !== 'active'}
                          className="text-slate-400 hover:text-white transition-colors disabled:opacity-30"
                        >
                          <Settings size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {userSubs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <AlertCircle size={32} />
                      <p>You don't have any domains yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDomains;
