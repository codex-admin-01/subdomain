import { useEffect, useState } from 'react';
import { api } from './src/api';
import { AppSettings, AuditLog, Coupon, FAQ, ForbiddenKeyword, Invoice, MainDomain, Referral, ReservedName, SiteStatus, Subdomain, SupportTicket, TransferRequest, User } from './types';

const defaultSettings: AppSettings = {
  websiteName: 'SubHub',
  websiteLogo: '🚀',
  referralCommission: 10,
  couponsEnabled: true,
  promoConfig: { enabled: false, title: '', description: '', imageUrl: '', buttonText: '', buttonLink: '' },
  pricingPlans: []
};

const INITIAL_FAQS: FAQ[] = [
  { id: 'f1', category: 'General', question: 'How long does DNS propagation take?', answer: 'Usually within 30 minutes, up to 24 hours.' }
];

export const useStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('auth_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [users, setUsers] = useState<User[]>([]);
  const [mainDomains, setMainDomains] = useState<MainDomain[]>([]);
  const [subdomains, setSubdomains] = useState<Subdomain[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [forbiddenKeywords, setForbiddenKeywords] = useState<ForbiddenKeyword[]>([]);
  const [siteStatus, setSiteStatus] = useState<SiteStatus[]>([]);
  const [reservedNames, setReservedNames] = useState<ReservedName[]>([]);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

  const load = async () => {
    if (!token) return;
    const [me, ds, inv, sup, ref] = await Promise.all([
      api.get('/auth/me', { headers: authHeaders }),
      api.get('/domains', { headers: authHeaders }),
      api.get('/invoices', { headers: authHeaders }),
      api.get('/support', { headers: authHeaders }),
      api.get('/referrals', { headers: authHeaders })
    ]);
    const meData = me.data;
    setCurrentUser({ ...meData, number: meData.phone || '', balance: meData.wallet?.balance || 0, isSuspended: meData.status !== 'ACTIVE' });
    setMainDomains(ds.data.map((d: any) => ({ id: d.id, domain: d.name, status: d.status.toLowerCase(), cloudflareEmail: '', zoneId: '', apiKey: '', monthlyPrice: d.monthlyPrice, premiumThreshold: d.premiumThreshold, premiumPrice: d.premiumPrice })));
    const mySubs = await Promise.all(ds.data.map((d: any) => api.get(`/domains/${d.id}/subdomains`, { headers: authHeaders })));
    const subs = mySubs.flatMap((s) => s.data);
    setSubdomains(subs.map((s: any) => ({ id: s.id, userId: s.ownerId, mainDomainId: s.domainId, name: s.name, fullDomain: s.fullDomain, ip: s.target, registrationDate: s.createdAt, expiryDate: s.expiryDate, period: s.period, status: s.status.toLowerCase(), autoRenew: s.autoRenew })));
    setInvoices(inv.data.map((i: any) => ({ id: i.id, userId: i.userId, subdomainId: '', amount: i.amount, originalAmount: i.amount, discountApplied: 0, status: i.status.toLowerCase(), createdAt: i.createdAt })));
    setTickets(sup.data.map((t: any) => ({ id: t.id, userId: t.userId, subject: t.subject, category: 'Other', status: t.status.toLowerCase(), messages: [{ id: t.id, senderId: t.userId, text: t.message, createdAt: t.createdAt }, ...(t.replies || []).map((r: any) => ({ id: r.id, senderId: r.authorId, text: r.message, createdAt: r.createdAt }))], createdAt: t.createdAt, updatedAt: t.updatedAt })));
    setReferrals(ref.data.map((r: any) => ({ id: r.id, referrerId: r.referrerId, referredUserId: r.refereeId, commission: r.rewards, date: r.createdAt })));
    if (meData.role === 'ADMIN') {
      const [u, al, st] = await Promise.all([api.get('/admin/users', { headers: authHeaders }), api.get('/admin/audit-logs', { headers: authHeaders }), api.get('/status')]);
      setUsers(u.data.map((x: any) => ({ id: x.id, name: x.name, email: x.email, number: x.phone || '', role: x.role, balance: x.wallet?.balance || 0, pendingCommissions: x.pendingCommissions, lowBalanceThreshold: x.lowBalanceThreshold, autoTransferCommission: x.autoTransferCommission, referralCode: x.referralCode, isSuspended: x.status !== 'ACTIVE', createdAt: x.createdAt })));
      setAuditLogs(al.data.map((l: any) => ({ id: l.id, userId: l.actorId, userName: l.actorId, action: l.action, details: `${l.entityType}:${l.entityId || ''}`, createdAt: l.createdAt, type: 'info' })));
      setSiteStatus(st.data.map((i: any) => ({ service: i.title, status: i.status === 'RESOLVED' ? 'operational' : 'degraded', uptime: '99.9%' })));
    }
  };

  useEffect(() => { if (token) load().catch(console.error); }, [token]);

  const login = async (email: string, password = 'User123!') => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.accessToken); localStorage.setItem('auth_token', res.data.accessToken);
    setCurrentUser({ ...res.data.user, number: '', balance: 0, isSuspended: res.data.user.status !== 'ACTIVE' });
    localStorage.setItem('auth_user', JSON.stringify(res.data.user));
    return true;
  };
  const logout = async () => { if (token) await api.post('/auth/logout', {}, { headers: authHeaders }); setToken(null); setCurrentUser(null); localStorage.removeItem('auth_user'); localStorage.removeItem('auth_token'); };

  const updateProfile = async (updated: Partial<User>) => setCurrentUser((p) => (p ? { ...p, ...updated } : p));
  const claimCommissions = () => {};
  const depositBalance = async (amount: number) => { await api.post('/wallet/deposit', { amount }, { headers: authHeaders }); await load(); };
  const payWithBalance = async (invoiceId: string) => { await api.patch(`/invoices/${invoiceId}/pay`, {}, { headers: authHeaders }); await load(); return true; };
  const toggleAutoRenew = async (subdomainId: string) => { const s = subdomains.find((x) => x.id === subdomainId); if (!s) return; await api.patch(`/domains/${s.mainDomainId}/subdomains/${subdomainId}`, { autoRenew: !s.autoRenew }, { headers: authHeaders }); await load(); };
  const registerSubdomain = async (name: string, domainId: string, months: number) => { await api.post(`/domains/${domainId}/subdomains`, { name, period: months }, { headers: authHeaders }); await load(); return null; };
  const payInvoice = async (invoiceId: string) => { await payWithBalance(invoiceId); };
  const updateSubdomainIP = async (id: string, ip: string) => { const s = subdomains.find((x) => x.id === id); if (!s) return; await api.patch(`/domains/${s.mainDomainId}/subdomains/${id}`, { target: ip }, { headers: authHeaders }); await load(); };
  const addMainDomain = async (domain: Omit<MainDomain, 'id'>) => { await api.post('/domains', { name: domain.domain, monthlyPrice: domain.monthlyPrice, premiumThreshold: domain.premiumThreshold, premiumPrice: domain.premiumPrice }, { headers: authHeaders }); await load(); };
  const toggleUserStatus = async (userId: string) => { const u = users.find((x) => x.id === userId); await api.patch(`/admin/users/${userId}/disable`, { status: u?.isSuspended ? 'ACTIVE' : 'DISABLED' }, { headers: authHeaders }); await load(); };
  const toggleSubdomainStatus = async (id: string) => { const s = subdomains.find((x) => x.id === id); if (!s) return; await api.patch(`/domains/${s.mainDomainId}/subdomains/${id}`, { status: s.status === 'active' ? 'SUSPENDED' : 'ACTIVE' }, { headers: authHeaders }); await load(); };
  const generateTransferKey = () => null;
  const submitTransferClaim = () => ({ success: false, message: 'Not implemented' });
  const handleTransferAction = () => {};
  const createTicket = async (subject: string, _category: any, message: string) => { await api.post('/support', { subject, message }, { headers: authHeaders }); await load(); };
  const replyToTicket = async (ticketId: string, text: string) => { const url = currentUser?.role === 'ADMIN' ? `/admin/support/${ticketId}/reply` : `/support/${ticketId}/replies`; await api.post(url, { message: text }, { headers: authHeaders }); await load(); };
  const closeTicket = async (ticketId: string) => { await api.patch(`/admin/support/${ticketId}/status`, { status: 'CLOSED' }, { headers: authHeaders }); await load(); };
  const addForbiddenKeyword = (word: string) => setForbiddenKeywords((p) => [...p, { id: crypto.randomUUID(), word, addedAt: new Date().toISOString() }]);
  const removeForbiddenKeyword = (id: string) => setForbiddenKeywords((p) => p.filter((x) => x.id !== id));
  const addReservedName = (rn: Omit<ReservedName, 'id' | 'addedAt'>) => setReservedNames((p) => [...p, { ...rn, id: crypto.randomUUID(), addedAt: new Date().toISOString() }]);
  const removeReservedName = (id: string) => setReservedNames((p) => p.filter((x) => x.id !== id));
  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usageCount'>) => setCoupons((p) => [...p, { ...coupon, id: crypto.randomUUID(), usageCount: 0 }]);
  const deleteCoupon = (id: string) => setCoupons((p) => p.filter((x) => x.id !== id));
  const toggleCouponStatus = (id: string) => setCoupons((p) => p.map((x) => (x.id === id ? { ...x, status: x.status === 'active' ? 'inactive' : 'active' } : x)));
  const applyCouponToInvoice = () => ({ success: false, message: 'Coupons are disabled in API mode' });
  const getRevenueStats = () => ({ mrr: 0, dailyRevenue: 0, monthlyRevenue: 0, churnRate: 0, expiringSoon: 0 });
  const addPricingPlan = () => {};
  const updatePricingPlan = () => {};
  const deletePricingPlan = () => {};

  return { currentUser, login, logout, users, mainDomains, subdomains, invoices, referrals, settings, coupons, transferRequests, tickets, faqs: INITIAL_FAQS, auditLogs, forbiddenKeywords, siteStatus, reservedNames, updateProfile, registerSubdomain, payInvoice, updateSubdomainIP, addMainDomain, toggleUserStatus, toggleSubdomainStatus, generateTransferKey, submitTransferClaim, handleTransferAction, createTicket, replyToTicket, closeTicket, setSettings, setSubdomains, setInvoices, addForbiddenKeyword, removeForbiddenKeyword, addCoupon, deleteCoupon, toggleCouponStatus, applyCouponToInvoice, getRevenueStats, addPricingPlan, updatePricingPlan, deletePricingPlan, depositBalance, payWithBalance, toggleAutoRenew, claimCommissions, addReservedName, removeReservedName };
};
