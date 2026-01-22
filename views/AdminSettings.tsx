
import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings, Image, Link2, Monitor, Tag, Plus, Trash2, Power, ToggleLeft, ToggleRight } from 'lucide-react';

const AdminSettings: React.FC = () => {
  const { settings, setSettings, coupons, addCoupon, deleteCoupon, toggleCouponStatus } = useStore();
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || newCoupon.discountValue <= 0) return;
    addCoupon(newCoupon);
    setShowAddCoupon(false);
    setNewCoupon({ code: '', discountType: 'percentage', discountValue: 0, status: 'active' });
  };

  return (
    <div className="space-y-8 pb-20">
      <header>
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
        <p className="text-slate-400">Global configurations and branding options.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding Settings */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl h-fit">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Monitor size={20} className="text-emerald-400"/> General Branding
              </h2>
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase">Website Name</label>
                <input 
                  value={settings.websiteName}
                  onChange={e => setSettings({...settings, websiteName: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase">Website Logo (Emoji or URL)</label>
                <input 
                  value={settings.websiteLogo}
                  onChange={e => setSettings({...settings, websiteLogo: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Link2 size={20} className="text-cyan-400"/> Referral System
              </h2>
              <div className="space-y-2">
                <label className="text-slate-400 text-xs font-bold uppercase">Commission Percentage (%)</label>
                <input 
                  type="number"
                  value={settings.referralCommission}
                  onChange={e => setSettings({...settings, referralCommission: parseInt(e.target.value)})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                />
                <p className="text-slate-500 text-xs mt-1">This is the lifetime commission users get when their referrals pay an invoice.</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Tag size={20} className="text-amber-400"/> Coupon System
                </h2>
                <button
                  type="button"
                  onClick={() => setSettings({...settings, couponsEnabled: !settings.couponsEnabled})}
                  className={`flex items-center gap-2 text-sm font-bold transition-all ${settings.couponsEnabled ? 'text-emerald-400' : 'text-slate-500'}`}
                >
                  {settings.couponsEnabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
              <p className="text-slate-500 text-xs">Allow users to apply discount codes to their invoices.</p>
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-black font-black py-3 rounded-xl hover:bg-emerald-50 transition-all mt-4"
            >
              Save All Changes
            </button>
          </form>
        </div>

        {/* Coupon Management */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Tag size={20} className="text-amber-400"/> Manage Coupons
            </h2>
            <button 
              onClick={() => setShowAddCoupon(!showAddCoupon)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-all"
            >
              <Plus size={18}/>
            </button>
          </div>

          {showAddCoupon && (
            <form onSubmit={handleAddCoupon} className="mb-8 p-6 bg-white/5 border border-emerald-500/20 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-2">
                <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Coupon Code</label>
                <input 
                  required
                  placeholder="SAVE50"
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Type</label>
                  <select 
                    value={newCoupon.discountType}
                    onChange={e => setNewCoupon({...newCoupon, discountType: e.target.value as 'percentage' | 'fixed'})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Value</label>
                  <input 
                    required
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={e => setNewCoupon({...newCoupon, discountValue: parseFloat(e.target.value)})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAddCoupon(false)} className="text-slate-400 text-sm">Cancel</button>
                <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold">Create Coupon</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {coupons.map(coupon => (
              <div key={coupon.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${coupon.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                    <Tag size={16} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-bold font-mono">{coupon.code}</p>
                      <span className="text-[10px] text-slate-500 uppercase">{coupon.usageCount} uses</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% Off` : `$${coupon.discountValue} Off`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleCouponStatus(coupon.id)}
                    className={`p-2 rounded-lg transition-colors ${coupon.status === 'active' ? 'text-amber-400 hover:bg-amber-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                  >
                    <Power size={14} />
                  </button>
                  <button 
                    onClick={() => deleteCoupon(coupon.id)}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-400/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {coupons.length === 0 && (
              <p className="text-center text-slate-500 py-10 italic">No coupons created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
