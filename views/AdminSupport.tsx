
import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  MessageSquare, User, Clock, CheckCircle, 
  Send, Plus, ShieldCheck, Mail, ArrowLeft
} from 'lucide-react';

const AdminSupport: React.FC = () => {
  const { tickets, users, replyToTicket, closeTicket } = useStore();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);
  const owner = selectedTicket ? users.find(u => u.id === selectedTicket.userId) : null;

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText || !selectedTicketId) return;
    replyToTicket(selectedTicketId, replyText);
    setReplyText('');
  };

  const handleClose = () => {
    if (!selectedTicketId) return;
    if (window.confirm("Mark this ticket as resolved and closed?")) {
      closeTicket(selectedTicketId);
    }
  };

  const openTickets = tickets.filter(t => t.status !== 'closed');
  const closedTickets = tickets.filter(t => t.status === 'closed');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Support Management</h1>
        <p className="text-slate-400">Respond to user inquiries and technical issues.</p>
      </header>

      {!selectedTicketId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-amber-400" /> Active Tickets
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
              {openTickets.map(t => {
                const u = users.find(usr => usr.id === t.userId);
                return (
                  <button 
                    key={t.id} 
                    onClick={() => setSelectedTicketId(t.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-all group border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`p-2 rounded-lg ${t.status === 'replied' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        <MessageSquare size={18} />
                      </div>
                      <div>
                        <p className="text-white font-bold group-hover:text-emerald-400 transition-colors">{t.subject}</p>
                        <p className="text-xs text-slate-500">{u?.name} • {t.category}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                      t.status === 'open' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {t.status}
                    </span>
                  </button>
                );
              })}
              {openTickets.length === 0 && <p className="p-12 text-center text-slate-500 italic">No active tickets.</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
              <CheckCircle size={16} className="text-slate-500" /> Recently Resolved
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md opacity-60">
              {closedTickets.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setSelectedTicketId(t.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
                >
                  <div className="text-left">
                    <p className="text-white text-sm font-bold">{t.subject}</p>
                    <p className="text-[10px] text-slate-500">{new Date(t.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <CheckCircle size={14} className="text-slate-500" />
                </button>
              ))}
              {closedTickets.length === 0 && <p className="p-8 text-center text-slate-500 italic">No closed tickets.</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col lg:flex-row h-[700px]">
            {/* Sidebar with User Info */}
            <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/5 p-8 space-y-8 bg-black/20">
              <button 
                onClick={() => setSelectedTicketId(null)}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors text-sm font-bold"
              >
                <ArrowLeft size={16} /> Back to List
              </button>
              
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                  {owner?.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{owner?.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Mail size={10} /> {owner?.email}</p>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-white/5">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Category</label>
                  <p className="text-white text-sm mt-1">{selectedTicket?.category}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Ticket ID</label>
                  <p className="text-white font-mono text-sm mt-1">{selectedTicket?.id}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Status</label>
                  <p className={`text-xs font-bold mt-1 uppercase ${selectedTicket?.status === 'closed' ? 'text-slate-500' : 'text-emerald-400'}`}>
                    {selectedTicket?.status}
                  </p>
                </div>
              </div>

              {selectedTicket?.status !== 'closed' && (
                <button 
                  onClick={handleClose}
                  className="w-full bg-white/5 border border-rose-500/30 text-rose-400 font-bold py-3 rounded-xl hover:bg-rose-500/10 transition-all text-sm mt-8"
                >
                  Close & Resolve
                </button>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              <div className="p-6 border-b border-white/5 bg-white/5">
                <h2 className="text-lg font-bold text-white">{selectedTicket?.subject}</h2>
              </div>
              
              <div className="flex-1 p-8 overflow-y-auto space-y-6">
                {selectedTicket?.messages.map(msg => {
                  const isAdmin = users.find(u => u.id === msg.senderId)?.role === 'ADMIN';
                  return (
                    <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-5 rounded-2xl ${
                        isAdmin ? 'bg-emerald-500 text-white rounded-tr-none' : 'bg-white/10 border border-white/10 text-slate-200 rounded-tl-none'
                      }`}>
                        <div className="flex justify-between items-center mb-2 gap-4">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                            {isAdmin ? 'System Admin' : owner?.name}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <p className="text-[9px] mt-2 opacity-50">{new Date(msg.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedTicket?.status !== 'closed' && (
                <form onSubmit={handleReply} className="p-6 border-t border-white/5 bg-black/40">
                  <div className="flex gap-4">
                    <textarea 
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Type your official reply..."
                      rows={2}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                    />
                    <button type="submit" className="bg-emerald-500 text-white px-6 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center">
                      <Send size={24} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSupport;
