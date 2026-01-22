
import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  LayoutDashboard, Globe, Link2, User, Settings, LogOut, 
  Users, ShieldCheck, CreditCard, Search, Menu, X, ChevronDown, 
  ArrowRight, Shield, ArrowLeftRight, HelpCircle, LifeBuoy, History, ShieldAlert, Activity
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, settings, transferRequests, tickets, siteStatus } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const pendingTransferCount = currentUser ? transferRequests.filter(r => 
    (r.senderId === currentUser.id && r.status === 'requested')
  ).length : 0;

  const openTicketCount = currentUser?.role === 'ADMIN' 
    ? tickets.filter(t => t.status === 'open').length 
    : tickets.filter(t => t.userId === currentUser?.id && t.status === 'replied').length;

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/get-domain', label: 'Register New', icon: Globe },
    { to: '/my-domains', label: 'My Domains', icon: ShieldCheck },
    { to: '/transfers', label: 'Transfers', icon: ArrowLeftRight, badge: pendingTransferCount > 0 ? pendingTransferCount : null },
    { to: '/whois', label: 'WHOIS Lookup', icon: Search },
    { to: '/referrals', label: 'Referrals', icon: Link2 },
    { to: '/invoices', label: 'Billing', icon: CreditCard },
    { to: '/support', label: 'Help & Support', icon: LifeBuoy, badge: openTicketCount > 0 ? openTicketCount : null },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Panel', icon: Shield },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/subdomains', label: 'All Subdomains', icon: Globe },
    { to: '/admin/domains', label: 'Root Domains', icon: ShieldCheck },
    { to: '/admin/support', label: 'Support Tickets', icon: LifeBuoy, badge: openTicketCount > 0 ? openTicketCount : null },
    { to: '/admin/audit', label: 'Audit Logs', icon: History },
    { to: '/admin/abuse', label: 'Abuse Protection', icon: ShieldAlert },
    { to: '/whois', label: 'WHOIS Lookup', icon: Search },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const dashboardLinks = currentUser?.role === 'ADMIN' ? adminLinks : userLinks;
  const isAllGood = siteStatus.every(s => s.status === 'operational');

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${currentUser ? 'bg-[#0a0c10]' : 'bg-transparent'}`}>
      <nav className={`w-full sticky top-0 z-[100] border-b border-white/5 py-3 px-4 lg:px-8 flex justify-center backdrop-blur-xl ${currentUser ? 'bg-[#0a0c10]/80' : 'bg-[#0a0c10]/40'}`}>
        <div className="max-w-7xl w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            {currentUser && (
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <span className="text-2xl group-hover:scale-110 transition-transform">{settings.websiteLogo}</span>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
                {settings.websiteName}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {!currentUser && (
               <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                 <div className={`w-1.5 h-1.5 rounded-full ${isAllGood ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                 <Link to="/status" className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80 hover:text-emerald-400 transition-colors">
                   Systems: {isAllGood ? 'Operational' : 'Degraded'}
                 </Link>
               </div>
            )}
            
            {!currentUser ? (
              <div className="flex items-center gap-6 mr-2">
                <Link to="/whois" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Whois</Link>
                <button 
                  onClick={() => {
                    const el = document.getElementById('login');
                    if(el) el.scrollIntoView({ behavior: 'smooth' });
                    else navigate('/#login');
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {currentUser.name.charAt(0)}
                    </div>
                    <ChevronDown size={14} className={`text-slate-500 mr-2 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-2 z-[110] animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-3 py-2 border-b border-white/5 mb-1 text-xs text-slate-500">
                        <p>Authenticated as</p>
                        <p className="font-bold text-white truncate">{currentUser.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <User size={16} /> My Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg mt-1 border-t border-white/5 transition-colors">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-1 relative z-10">
        {currentUser && (
          <aside className={`fixed lg:sticky top-[65px] left-0 z-40 h-[calc(100vh-65px)] w-64 border-r border-white/5 bg-[#0a0c10]/50 backdrop-blur-xl transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex flex-col h-full p-4 space-y-2 overflow-y-auto">
              {dashboardLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <link.icon size={18} />
                    <span className="font-medium text-sm">{link.label}</span>
                    {link.badge && <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{link.badge}</span>}
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
        <main className="flex-1 overflow-x-hidden">
          <div className={`${currentUser ? 'p-6 lg:p-10' : 'p-0'} transition-all`}>
            <div className={`${currentUser ? 'max-w-7xl' : 'max-w-none'} mx-auto`}>{children}</div>
          </div>
        </main>
      </div>
      {isSidebarOpen && currentUser && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
};

export default Layout;
