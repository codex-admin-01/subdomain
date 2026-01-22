
import React, { useState } from 'react';
import { useStore } from '../store';
import { CreditCard, CheckCircle, AlertCircle, Tag, Check } from 'lucide-react';

const Invoices: React.FC = () => {
  const { currentUser, invoices, payInvoice, applyCouponToInvoice, settings } = useStore();
  const userInvoices = invoices.filter(i => i.userId === currentUser?.id).reverse();
  const [couponCode, setCouponCode] = useState('');
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handlePay = (id: string) => {
    // Simulate PipraPay Integration
    const confirmPayment = window.confirm("You are being redirected to PipraPay Gateway. Would you like to proceed with the simulated payment?");
    if (confirmPayment) {
      payInvoice(id);
      alert("Payment Successful! Your domain is now active.");
    }
  };

  const handleApplyCoupon = (e: React.FormEvent, invoiceId: string) => {
    e.preventDefault();
    if (!couponCode) return;
    
    const result = applyCouponToInvoice(invoiceId, couponCode);
    setCouponMsg({ text: result.message, type: result.success ? 'success' : 'error' });
    if (result.success) {
      setCouponCode('');
      setTimeout(() => setCouponMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Billing & Invoices</h1>
        <p className="text-slate-400">Manage your payments and transaction history.</p>
      </header>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Invoice ID</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {userInvoices.map((inv) => (
                <React.Fragment key={inv.id}>
                  <tr className={`hover:bg-white/5 transition-colors ${activeInvoiceId === inv.id ? 'bg-white/5' : ''}`}>
                    <td className="px-6 py-4 font-mono text-white text-sm">{inv.id}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-white font-bold">${inv.amount.toFixed(2)}</span>
                        {inv.discountApplied > 0 && (
                          <span className="text-[10px] text-emerald-400 font-medium">
                            -${inv.discountApplied.toFixed(2)} ({inv.couponUsed})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tight ${
                        inv.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.status === 'unpaid' ? (
                        <div className="flex justify-end gap-2">
                          {settings.couponsEnabled && !inv.couponUsed && (
                            <button 
                              onClick={() => setActiveInvoiceId(activeInvoiceId === inv.id ? null : inv.id)}
                              className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10 flex items-center gap-2"
                            >
                              <Tag size={12}/> Coupon
                            </button>
                          )}
                          <button 
                            onClick={() => handlePay(inv.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
                          >
                            <CreditCard size={14}/> Pay Now
                          </button>
                        </div>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 justify-end text-xs font-bold">
                          <CheckCircle size={14}/> Completed
                        </span>
                      )}
                    </td>
                  </tr>
                  {activeInvoiceId === inv.id && (
                    <tr className="bg-emerald-500/5">
                      <td colSpan={5} className="px-6 py-4">
                        <form onSubmit={(e) => handleApplyCoupon(e, inv.id)} className="flex items-center gap-3">
                          <div className="flex-1 max-w-xs relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                            <input
                              type="text"
                              placeholder="Enter coupon code..."
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              className="w-full bg-black/40 border border-emerald-500/30 rounded-lg pl-9 pr-4 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                          <button 
                            type="submit"
                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-600 transition-all"
                          >
                            Apply
                          </button>
                          {couponMsg && (
                            <span className={`text-xs font-bold flex items-center gap-1 ${couponMsg.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {couponMsg.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
                              {couponMsg.text}
                            </span>
                          )}
                        </form>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {userInvoices.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No invoices found.
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

export default Invoices;
