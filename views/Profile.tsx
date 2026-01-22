
import React, { useState } from 'react';
import { useStore } from '../store';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useStore();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    number: currentUser?.number || '',
    password: '••••••••'
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Account Profile</h1>
        <p className="text-slate-400">Manage your personal information and security.</p>
      </header>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-3xl font-bold">
              {currentUser?.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{currentUser?.name}</h2>
              <p className="text-slate-500 text-sm">Account ID: {currentUser?.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2"><User size={12}/> Full Name</label>
              <input 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2"><Mail size={12}/> Email Address</label>
              <input 
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2"><Phone size={12}/> Mobile Number</label>
              <input 
                value={formData.number}
                onChange={e => setFormData({...formData, number: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-slate-400 text-xs font-bold uppercase flex items-center gap-2"><Lock size={12}/> Password</label>
              <input 
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            <Save size={18}/> Update Account Info
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
