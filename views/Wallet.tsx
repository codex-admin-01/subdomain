
import React, { useState } from 'react';
import { useStore } from '../store';
import { Wallet, CreditCard, ArrowUpRight, History, Plus, AlertCircle, ShieldCheck } from 'lucide-react';

const WalletView: React.FC = () => {
  const { currentUser, depositBalance, invoices } = useStore();
  const [depositAmount, setDepositAmount] = useState<number>(10);
  const paidInvoices = invoices.filter(i => i.userId === currentUser?.id && i.status === 'paid').slice(0, 5);

  const handleDeposit = () => {
    if (depositAmount <= 0) return;
    const confirmed = window.confirm(`Simulate $${depositAmount.toFixed(2)} deposit to your wallet?`);
    if (confirmed) {
      depositBalance(depositAmount);
      alert('Deposit successful! Your balance has been updated.');
    }
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white">Account Wallet</h1>
        <p className="text-slate-400">Add funds to enable automatic renewals and quick payments.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance & Deposit */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-500/10 via-[#0a0c10] to-cyan-500/10 border border-white/10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Wallet size={120} />
            </div>
            
            <div className="space-y-6 relative">
              <div>
                <p className="text-emerald-400 font-black uppercase tracking-widest text-xs mb-2">Available Balance</p>
                <h2 className="text-6xl font-black text-white">${currentUser?.balance.toFixed(2)}</h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                   <ShieldCheck size={14} className="text-emerald-500" />
                   Secured by SubHub Escrow
                 </div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                   <ArrowUpRight size={14} className="text-cyan-500" />
                   Instant Top-up
                 </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus size={20} className="text-cyan-400" /> Add Funds
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[5, 10, 25, 50, 100].map(amount => (
                <button
                  key={amount}
                  onClick={() => setDepositAmount(amount)}
                  className={`py-3 rounded-xl border font-bold transition-all ${
                    depositAmount === amount ? 'bg-cyan-500 border-cyan-400 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            
            <div className="space-y-2">
               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Custom Amount</label>
               <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                 <input 
                   type="number"
                   value={depositAmount}
                   onChange={e => setDepositAmount(parseFloat(e.target.value))}
                   className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                 />
               </div>
            </div>

            <button 
              onClick={handleDeposit}
              className="w-full bg-white text-black font-black py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-cyan-50 transition-all shadow-xl"
            >
              <CreditCard size={20} /> Deposit Funds Now
            </button>
          </div>
        </div>

        {/* Info & History */}
        <div className="space-y-6">
           <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-4">
              <AlertCircle className="text-amber-400 mt-1 shrink-0" size={20} />
              <div>
                <p className="text-amber-200 text-sm font-bold">Renewal Protection</p>
                <p className="text-amber-200/70 text-xs mt-1 leading-relaxed">
                  Keeping a balance of at least $10 ensures your auto-renew domains are never suspended due to payment failure.
                </p>
              </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
             <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2">
               <History size={16} className="text-slate-500" />
               <span className="text-xs font-bold text-white uppercase tracking-widest">Recent Payments</span>
             </div>
             <div className="divide-y divide-white/5">
                {paidInvoices.map(inv => (
                  <div key={inv.id} className="p-4 flex justify-between items-center text-xs">
                    <div>
                      <p className="text-white font-bold">{inv.id}</p>
                      <p className="text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-rose-400 font-black">-${inv.amount.toFixed(2)}</span>
                  </div>
                ))}
                {paidInvoices.length === 0 && (
                  <p className="p-8 text-center text-slate-600 italic text-sm">No recent transactions.</p>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
