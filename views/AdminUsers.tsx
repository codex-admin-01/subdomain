
import React from 'react';
import { useStore } from '../store';
import { User, Shield, Ban, CheckCircle } from 'lucide-react';

const AdminUsers: React.FC = () => {
  const { users, toggleUserStatus } = useStore();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">User Directory</h1>
        <p className="text-slate-400">Manage user accounts and platform permissions.</p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10">
                        <User size={20}/>
                      </div>
                      <div>
                        <p className="text-white font-medium">{u.name}</p>
                        <p className="text-slate-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-slate-300 text-sm">{u.email}</p>
                    <p className="text-slate-500 text-xs">{u.number}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      u.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                      !u.isSuspended ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {!u.isSuspended ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toggleUserStatus(u.id)}
                      disabled={u.role === 'ADMIN'}
                      className={`p-2 rounded-lg transition-colors ${
                        !u.isSuspended ? 'text-rose-400 hover:bg-rose-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'
                      } disabled:opacity-0`}
                    >
                      {!u.isSuspended ? <Ban size={18}/> : <CheckCircle size={18}/>}
                    </button>
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

export default AdminUsers;
