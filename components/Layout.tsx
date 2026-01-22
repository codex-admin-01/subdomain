
import React, { useState } from 'react';
import { useStore } from '../store';
import { 
  LayoutDashboard, Globe, Link2, User, Settings, LogOut, 
  Users, ShieldCheck, CreditCard, Search, Menu, X, ChevronDown, 
  ArrowRight, Shield
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser, logout, settings } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const userLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/get-domain', label: 'Register New', icon: Globe },
    { to: '/my-domains', label: 'My Domains', icon: ShieldCheck },
    { to: '/whois', label: 'WHOIS Lookup', icon: Search },
    { to: '/referrals', label: 'Referrals', icon: Link2 },
    { to: '/invoices', label: 'Billing', icon: CreditCard },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Panel', icon: Shield },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/subdomains', label: 'All Subdomains', icon: Globe },
    { to: '/admin/domains', label: 'Root Domains', icon: ShieldCheck },
    { to: '/whois', label: 'WHOIS Lookup', icon: Search },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const dashboardLinks = currentUser?.role === 'ADMIN' ? adminLinks : userLinks;
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0c10]">
      {/* Top Navigation Bar */}
      <nav className="w-full sticky top-0 z-[100] bg-[#0a0c10]/80 backdrop-blur-xl border-b border-white/5 py-3 px-4 lg:px-8 flex justify-center">
        <div className="max-w-7xl w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Toggle (Only for logged in) */}
            {currentUser && (
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
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

          <div className="flex items-center gap-4">
            {/* Public/Smart Link */}
            {!currentUser ? (
              <div className="flex items-center gap-6 mr-2">
                <Link to="/whois" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Whois</Link>
                <a 
                  href="/#login" 
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  Sign In
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {isLandingPage && (
                  <Link 
                    to={currentUser.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    className="hidden sm:flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-all"
                  >
                    Go to Dashboard <ArrowRight size={14} />
                  </Link>
                )}
                
                {/* Profile Controls */}
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {currentUser.name.charAt(0)}
                    </div>
                    <ChevronDown size={14} className={`text-slate-500 mr-2 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-100 z-[110]">
                      <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-xs text-slate-500">Authenticated as</p>
                        <p className="text-sm font-bold text-white truncate">{currentUser.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors">
                        <User size={16} /> My Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-1 border-t border-white/5">
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

      <div className="flex flex-1">
        {/* Sidebar (Desktop Only & Authenticated Only) */}
        {currentUser && (
          <aside className={`
            fixed lg:sticky top-[65px] left-0 z-40 h-[calc(100vh-65px)] w-64 border-r border-white/5 bg-[#0a0c10]/50 backdrop-blur-xl transition-transform duration-300
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex flex-col h-full p-4 space-y-2 overflow-y-auto">
              {dashboardLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_-5px_rgba(16,185,129,0.3)]' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <link.icon size={18} />
                    <span className="font-medium text-sm">{link.label}</span>
                  </Link>
                );
              })}
              
              <div className="mt-auto pt-4 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all"
                >
                  <LogOut size={18} />
                  <span className="font-medium text-sm">Sign Out</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden">
          <div className={`${currentUser ? 'p-6 lg:p-10' : 'p-0'} transition-all`}>
            <div className={`${currentUser ? 'max-w-7xl' : 'max-w-none'} mx-auto`}>
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {isSidebarOpen && currentUser && (
        <div 
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
