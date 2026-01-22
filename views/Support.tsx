
import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  LifeBuoy, MessageSquare, ChevronDown, ChevronUp, AlertCircle, 
  Send, Plus, CheckCircle, Clock, ShieldAlert, Zap, BookOpen 
} from 'lucide-react';
import { SupportTicket } from '../types';

const Support: React.FC = () => {
  const { currentUser, subdomains, tickets, createTicket, replyToTicket, faqs } = useStore();
  const userTickets = tickets.filter(t => t.userId === currentUser?.id);
  const userSubs = subdomains.filter(s => s.userId === currentUser?.id);

  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('Technical');
  const [newMessage, setNewMessage] = useState('');
  const [replyText, setReplyText] = useState('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newMessage) return;
    createTicket(newSubject, newCategory, newMessage);
    setNewSubject('');
    setNewMessage('');
    setShowNewTicket(false);
  };

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedTicketId) return;
    replyToTicket(selectedTicketId, replyText);
    setReplyText('');
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  // Auto Troubleshooting Logic
  const troubleshootingTips = [];
  const problematicSubs = userSubs.filter(s => s.status !== 'active');
  
  if (problematicSubs.length > 0) {
    problematicSubs.forEach(sub => {
      if (sub.status === 'suspended') {
        troubleshootingTips.push({
          title: `Domain Suspended: ${sub.fullDomain}`,
          tip: "Suspension usually occurs due to Terms of Service violations or payment failure. Please check your billing or open a ticket.",
          icon: ShieldAlert,
          color: 'rose'
        });
      }
      if (sub.status === 'pending') {
        troubleshootingTips.push({
          title: `Pending Activation: ${sub.fullDomain}`,
          tip: "Our system is syncing with Cloudflare. This usually takes 5-10 minutes. Ensure your IP is valid.",
          icon: Zap,
          color: 'amber'
        });
      }
    });
  } else if (userSubs.length === 0) {
    troubleshootingTips.push({
      title: "No domains yet?",
      tip: "Search for a subdomain on our home page or WHOIS lookup to get started.",
      icon: Zap,
      color: 'cyan'
    });
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-white">Help & Support</h1>
        <p className="text-slate-400">Find answers or speak with our support team.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Tickets & Auto-Support */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Troubleshooting Tips */}
          {troubleshootingTips.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <AlertCircle size={16} className="text-emerald-400" /> Smart Troubleshooting
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {troubleshootingTips.map((tip, idx) => (
                  <div key={idx} className={`p-6 rounded-2xl bg-${tip.color}-500/5 border border-${tip.color}-500/20 flex gap-4 animate-in fade-in slide-in-from-left-4`}>
                    <div className={`p-3 rounded-xl bg-${tip.color}-500/10 text-${tip.color}-400 h-fit`}>
                      <tip.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{tip.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{tip.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ticket System */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-400" /> Support Tickets
              </h2>
              <button 
                onClick={() => {
                  setShowNewTicket(true);
                  setSelectedTicketId(null);
                }}
                className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1"
              >
                <Plus size={14} /> New Ticket
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
              {!showNewTicket && !selectedTicketId && (
                <div className="divide-y divide-white/5">
                  {userTickets.map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => setSelectedTicketId(t.id)}
                      className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all group"
                    >
                      <div className="flex items-center gap-4 text-left">
                        <div className={`p-2 rounded-lg ${t.status === 'replied' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-500'}`}>
                          <MessageSquare size={18} />
                        </div>
                        <div>
                          <p className="text-white font-bold group-hover:text-emerald-400 transition-colors">{t.subject}</p>
                          <p className="text-xs text-slate-500">{t.category} • Updated {new Date(t.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                        t.status === 'open' ? 'bg-amber-500/10 text-amber-400' :
                        t.status === 'replied' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-slate-500/10 text-slate-500'
                      }`}>
                        {t.status}
                      </span>
                    </button>
                  ))}
                  {userTickets.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                      <LifeBuoy size={32} className="mx-auto mb-4 opacity-20" />
                      <p>No active tickets. Open one if you need help!</p>
                    </div>
                  )}
                </div>
              )}

              {showNewTicket && (
                <form onSubmit={handleCreateTicket} className="p-8 space-y-6 animate-in fade-in slide-in-from-top-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Open Support Ticket</h3>
                    <button type="button" onClick={() => setShowNewTicket(false)} className="text-slate-500 hover:text-white">Cancel</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500">Subject</label>
                      <input 
                        required
                        value={newSubject}
                        onChange={e => setNewSubject(e.target.value)}
                        placeholder="E.g. Domain propagation issue"
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500">Category</label>
                      <select 
                        value={newCategory}
                        onChange={e => setNewCategory(e.target.value as any)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                      >
                        <option value="Technical">Technical Support</option>
                        <option value="Billing">Billing & Payment</option>
                        <option value="Transfer">Domain Transfer</option>
                        <option value="Other">General Inquiry</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Describe your problem</label>
                    <textarea 
                      required
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      rows={5}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                    Submit Ticket
                  </button>
                </form>
              )}

              {selectedTicket && (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSelectedTicketId(null)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                        <Plus size={20} className="rotate-45" />
                      </button>
                      <div>
                        <h3 className="text-lg font-bold text-white">{selectedTicket.subject}</h3>
                        <p className="text-xs text-slate-500">{selectedTicket.id} • {selectedTicket.category}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                      selectedTicket.status === 'open' ? 'bg-amber-500/10 text-amber-400' :
                      selectedTicket.status === 'replied' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                  <div className="p-6 h-[400px] overflow-y-auto space-y-6">
                    {selectedTicket.messages.map(msg => {
                      const isMe = msg.senderId === currentUser?.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-4 rounded-2xl ${
                            isMe ? 'bg-emerald-500/10 border border-emerald-500/20 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                            <p className="text-[10px] text-slate-500 mt-2">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {selectedTicket.status !== 'closed' && (
                    <form onSubmit={handleReply} className="p-6 border-t border-white/5 bg-black/20">
                      <div className="flex gap-4">
                        <input 
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50"
                        />
                        <button type="submit" className="bg-emerald-500 text-white p-3 rounded-xl hover:bg-emerald-600 transition-all">
                          <Send size={20} />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: FAQ & Quick Links */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <BookOpen size={16} className="text-cyan-400" /> Frequently Asked
            </h2>
            <div className="space-y-3">
              {faqs.map(faq => (
                <div key={faq.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                  <button 
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-all"
                  >
                    <span className="text-sm font-bold text-white pr-4">{faq.question}</span>
                    {activeFaq === faq.id ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                  </button>
                  {activeFaq === faq.id && (
                    <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2">
                      <p className="text-xs text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 backdrop-blur-xl space-y-6">
            <div className="flex items-center gap-3">
              <LifeBuoy className="text-emerald-400" size={24} />
              <h3 className="text-lg font-bold text-white">Need Live Help?</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our team is available 24/7 for Enterprise customers. Standard support replies within 12 hours.
            </p>
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle size={14} /> System Status: All Systems Operational
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
