
import React, { useState } from 'react';
import { useStore } from '../store';
import { Settings, Image, Link2, Monitor, Tag, Plus, Trash2, Power, ToggleLeft, ToggleRight, Megaphone, Sparkles, Layout, DollarSign, List, Edit2, CheckCircle, Star, Calendar, UserCheck } from 'lucide-react';
import { PricingPlan } from '../types';

const AdminSettings: React.FC = () => {
  const { settings, setSettings, coupons, addCoupon, deleteCoupon, toggleCouponStatus, addPricingPlan, updatePricingPlan, deletePricingPlan } = useStore();
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    status: 'active' as 'active' | 'inactive',
    isOneTimePerUser: true,
    expiryDate: ''
  });

  // Pricing Plan States
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planForm, setPlanForm] = useState<Omit<PricingPlan, 'id'>>({
    name: '',
    price: '',
    desc: '',
    features: [],
    color: 'emerald',
    popular: false
  });
  const [featureInput, setFeatureInput] = useState('');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || newCoupon.discountValue <= 0) return;
    addCoupon({
      ...newCoupon,
      expiryDate: newCoupon.expiryDate || null
    });
    setShowAddCoupon(false);
    setNewCoupon({ code: '', discountType: 'percentage', discountValue: 0, status: 'active', isOneTimePerUser: true, expiryDate: '' });
  };

  const updatePromo = (updates: Partial<typeof settings.promoConfig>) => {
    setSettings({
      ...settings,
      promoConfig: { ...settings.promoConfig, ...updates }
    });
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!planForm.name || !planForm.price) return;

    if (editingPlanId) {
      updatePricingPlan(editingPlanId, planForm);
    } else {
      addPricingPlan(planForm);
    }

    resetPlanForm();
  };

  const resetPlanForm = () => {
    setShowPlanForm(false);
    setEditingPlanId(null);
    setPlanForm({ name: '', price: '', desc: '', features: [], color: 'emerald', popular: false });
    setFeatureInput('');
  };

  const startEditPlan = (plan: PricingPlan) => {
    setEditingPlanId(plan.id);
    setPlanForm({ ...plan });
    setShowPlanForm(true);
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setPlanForm({ ...planForm, features: [...planForm.features, featureInput.trim()] });
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    setPlanForm({ ...planForm, features: planForm.features.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-8 pb-32">
      <header>
        <h1 className="text-3xl font-bold text-white">System Settings</h1>
        <p className="text-slate-400">Global configurations and branding options.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Branding Settings */}
        <div className="space-y-8">
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
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-emerald-50 transition-all mt-4"
              >
                Save Branding Changes
              </button>
            </form>
          </div>

          {/* Marketing & Promo Banner Settings */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Megaphone size={20} className="text-emerald-400"/> Promo Banner Popup
              </h2>
              <button
                onClick={() => updatePromo({ enabled: !settings.promoConfig.enabled })}
                className={`flex items-center gap-2 text-sm font-bold transition-all ${settings.promoConfig.enabled ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {settings.promoConfig.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Popup Title</label>
                  <input 
                    value={settings.promoConfig.title}
                    onChange={e => updatePromo({ title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Button Text</label>
                  <input 
                    value={settings.promoConfig.buttonText}
                    onChange={e => updatePromo({ buttonText: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Image URL</label>
                <input 
                  value={settings.promoConfig.imageUrl}
                  onChange={e => updatePromo({ imageUrl: e.target.value })}
                  placeholder="https://example.com/promo.jpg"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Redirect Link</label>
                <input 
                  value={settings.promoConfig.buttonLink}
                  onChange={e => updatePromo({ buttonLink: e.target.value })}
                  placeholder="/get-domain"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Description</label>
                <textarea 
                  value={settings.promoConfig.description}
                  onChange={e => updatePromo({ description: e.target.value })}
                  rows={3}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500/50 resize-none"
                />
              </div>

              <div className="pt-4 p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <Layout size={18} className="text-emerald-400" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-emerald-400">Live Preview</h4>
                </div>
                <div className="bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl scale-[0.8] origin-top">
                  {settings.promoConfig.imageUrl && (
                    <img src={settings.promoConfig.imageUrl} className="w-full h-24 object-cover" />
                  )}
                  <div className="p-6 space-y-3 text-center">
                    <h5 className="text-white font-bold">{settings.promoConfig.title || 'Your Promo Title'}</h5>
                    <p className="text-[10px] text-slate-400 line-clamp-2">{settings.promoConfig.description || 'Promotional description goes here...'}</p>
                    <div className="bg-emerald-500 text-white text-[10px] font-black py-2 rounded-lg">
                      {settings.promoConfig.buttonText || 'Learn More'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Plan Management */}
        <div className="space-y-8">
           <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <DollarSign size={20} className="text-emerald-400"/> Pricing Plans
                </h2>
                <button 
                  onClick={() => setShowPlanForm(!showPlanForm)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-all"
                >
                  <Plus size={18}/>
                </button>
             </div>

             {showPlanForm && (
                <form onSubmit={handlePlanSubmit} className="mb-8 p-6 bg-white/5 border border-emerald-500/20 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Plan Name</label>
                      <input 
                        required
                        placeholder="Starter"
                        value={planForm.name}
                        onChange={e => setPlanForm({...planForm, name: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Price (e.g. 2.99 or Custom)</label>
                      <input 
                        required
                        placeholder="2.99"
                        value={planForm.price}
                        onChange={e => setPlanForm({...planForm, price: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Description</label>
                    <input 
                      required
                      placeholder="Perfect for personal blogs..."
                      value={planForm.desc}
                      onChange={e => setPlanForm({...planForm, desc: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Accent Color</label>
                        <select 
                          value={planForm.color}
                          onChange={e => setPlanForm({...planForm, color: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                        >
                          <option value="emerald">Emerald</option>
                          <option value="cyan">Cyan</option>
                          <option value="blue">Blue</option>
                          <option value="rose">Rose</option>
                          <option value="amber">Amber</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Mark Popular?</label>
                        <div className="flex items-center gap-4 py-2">
                           <button 
                            type="button"
                            onClick={() => setPlanForm({...planForm, popular: !planForm.popular})}
                            className={`flex items-center gap-2 text-sm font-bold transition-all ${planForm.popular ? 'text-emerald-400' : 'text-slate-500'}`}
                           >
                            {planForm.popular ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Plan Features</label>
                    <div className="flex gap-2">
                      <input 
                        placeholder="Add feature..."
                        value={featureInput}
                        onChange={e => setFeatureInput(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none"
                      />
                      <button type="button" onClick={addFeature} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl transition-all">
                        <Plus size={18} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {planForm.features.map((f, i) => (
                        <div key={i} className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 flex items-center gap-2">
                          <span className="text-xs text-emerald-400">{f}</span>
                          <button type="button" onClick={() => removeFeature(i)} className="text-emerald-400 hover:text-white">
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={resetPlanForm} className="text-slate-400 text-sm">Cancel</button>
                    <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded-xl text-sm font-black shadow-lg shadow-emerald-500/20">
                      {editingPlanId ? 'Update Plan' : 'Create Plan'}
                    </button>
                  </div>
                </form>
             )}

             <div className="space-y-4">
                {settings.pricingPlans.map(plan => (
                  <div key={plan.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 group transition-all hover:bg-white/[0.07]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-${plan.color}-500/10 text-${plan.color}-400`}>
                          <Layout size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <h4 className="text-white font-bold">{plan.name}</h4>
                             {plan.popular && <Star size={12} className="text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-xs text-slate-500">{plan.price === 'Custom' ? 'Enterprise' : `$${plan.price}/mo`}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEditPlan(plan)} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => deletePricingPlan(plan.id)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2">{plan.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.features.slice(0, 3).map((f, i) => (
                        <span key={i} className="text-[9px] uppercase tracking-widest font-black text-slate-500 bg-black/20 px-2 py-1 rounded">
                          {f}
                        </span>
                      ))}
                      {plan.features.length > 3 && (
                        <span className="text-[9px] uppercase tracking-widest font-black text-slate-600 bg-black/10 px-2 py-1 rounded">
                          +{plan.features.length - 3} More
                        </span>
                      )}
                    </div>
                  </div>
                ))}
             </div>
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

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-2">
                    <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Expiry Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input 
                        type="date"
                        value={newCoupon.expiryDate}
                        onChange={e => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Usage Limitation</label>
                    <button 
                      type="button"
                      onClick={() => setNewCoupon({...newCoupon, isOneTimePerUser: !newCoupon.isOneTimePerUser})}
                      className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs transition-all hover:bg-black/60"
                    >
                      <span className="text-slate-300">{newCoupon.isOneTimePerUser ? 'One-time per account' : 'Multiple uses'}</span>
                      {newCoupon.isOneTimePerUser ? <UserCheck size={14} className="text-emerald-400" /> : <List size={14} className="text-cyan-400" />}
                    </button>
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
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                        <p className="text-xs text-slate-400 font-bold">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}% Off` : `$${coupon.discountValue} Off`}
                        </p>
                        <span className="text-[9px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded flex items-center gap-1">
                          {coupon.isOneTimePerUser ? <UserCheck size={10} /> : <List size={10} />}
                          {coupon.isOneTimePerUser ? 'Account Limit' : 'Unlimited Use'}
                        </span>
                        {coupon.expiryDate && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 ${
                            new Date(coupon.expiryDate) < new Date() ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            <Calendar size={10} />
                            Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
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
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
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
    </div>
  );
};

export default AdminSettings;
