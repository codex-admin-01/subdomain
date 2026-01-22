
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Layout from './components/Layout';
import LandingPage from './views/LandingPage';
import UserDashboard from './views/UserDashboard';
import RegisterDomain from './views/RegisterDomain';
import UserDomains from './views/UserDomains';
import Referral from './views/Referral';
import Profile from './views/Profile';
import Invoices from './views/Invoices';
import Whois from './views/Whois';
import Transfers from './views/Transfers';
import Support from './views/Support';
import WalletView from './views/Wallet';
import AdminDashboard from './views/AdminDashboard';
import AdminUsers from './views/AdminUsers';
import AdminSubdomains from './views/AdminSubdomains';
import AdminDomains from './views/AdminDomains';
import AdminSettings from './views/AdminSettings';
import AdminSupport from './views/AdminSupport';
import AdminAuditLogs from './views/AdminAuditLogs';
import AdminAbuse from './views/AdminAbuse';
import StatusPage from './views/StatusPage';

const ProtectedRoute = ({ children, adminOnly = false }: { children?: React.ReactNode, adminOnly?: boolean }) => {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/" />;
  if (adminOnly && currentUser.role !== 'ADMIN') return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const App: React.FC = () => {
  const { currentUser } = useStore();

  return (
    <HashRouter>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={currentUser ? <Navigate to={currentUser.role === 'ADMIN' ? "/admin" : "/dashboard"} /> : <LandingPage />} />
          <Route path="/whois" element={<Whois />} />
          <Route path="/status" element={<StatusPage />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/get-domain" element={<ProtectedRoute><RegisterDomain /></ProtectedRoute>} />
          <Route path="/my-domains" element={<ProtectedRoute><UserDomains /></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
          <Route path="/referrals" element={<ProtectedRoute><Referral /></ProtectedRoute>} />
          <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><WalletView /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/subdomains" element={<ProtectedRoute adminOnly><AdminSubdomains /></ProtectedRoute>} />
          <Route path="/admin/domains" element={<ProtectedRoute adminOnly><AdminDomains /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/support" element={<ProtectedRoute adminOnly><AdminSupport /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute adminOnly><AdminAuditLogs /></ProtectedRoute>} />
          <Route path="/admin/abuse" element={<ProtectedRoute adminOnly><AdminAbuse /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
