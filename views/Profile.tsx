
import React, { useState } from 'react';
import { useStore } from '../store';
import { User, Mail, Phone, Lock, Save, Wallet, Bell, RefreshCw, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, updateProfile } = useStore();
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    number: currentUser?.number || '',
    password: '••••••••',
    lowBalanceThreshold: currentUser?.lowBalanceThreshold || 5,
    autoTransferCommission: currentUser?.autoTransferCommission || false
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-white">Account Profile</h1>
        <p className="text-slate-400">Manage your personal information and security preferences.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-8">
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

        {/* Wallet & Referral Settings */}
        <div className="space-y-8">
           <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl h-fit">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Wallet size={20} className="text-cyan-400" /> Wallet Settings
              </h2>
              
              <div className="space-y-8">
                 {/* Threshold Setting */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                       <Bell size={16} className="text-amber-400" />
                       <span className="text-xs font-bold uppercase tracking-widest">Balance Alert Threshold</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                       Set the minimum balance that triggers a "Low Balance" warning on your dashboard.
                    </p>
                    <div className="relative">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                       <input 
                         type="number"
                         value={formData.lowBalanceThreshold}
                         onChange={e => setFormData({...formData, lowBalanceThreshold: parseFloat(e.target.value)})}
                         className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                       />
                    </div>
                 </div>

                 {/* Commission Toggle */}
                 <div className="space-y-4 pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-slate-400">
                          <RefreshCw size={16} className="text-emerald-400" />
                          <span className="text-xs font-bold uppercase tracking-widest">Auto-Transfer</span>
                       </div>
                       <button 
                         onClick={() => setFormData({...formData, autoTransferCommission: !formData.autoTransferCommission})}
                         className={`transition-all ${formData.autoTransferCommission ? 'text-emerald-400' : 'text-slate-600'}`}
                       >
                         {formData.autoTransferCommission ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                       Automatically transfer earned referral commissions directly into your wallet balance.
                    </p>
                 </div>

                 <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                    <ShieldCheck size={18} className="text-emerald-500 mt-1 shrink-0" />
                    <p className="text-[10px] text-emerald-400/80 leading-relaxed">
                       Settings are saved locally and synced with your account profile across devices.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
