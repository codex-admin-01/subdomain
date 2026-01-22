
import { useState, useEffect } from 'react';
import { User, MainDomain, Subdomain, Invoice, Referral, AppSettings, Coupon, TransferRequest, SupportTicket, FAQ, TicketMessage, AuditLog, ForbiddenKeyword, SiteStatus, RevenueStats, PromoConfig, PricingPlan, ReservedName } from './types';

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@subhub.com', number: '12345678', role: 'ADMIN', balance: 0, pendingCommissions: 0, lowBalanceThreshold: 5, autoTransferCommission: true, referralCode: 'ADMIN123', isSuspended: false, createdAt: new Date().toISOString() },
  { id: '2', name: 'John Doe', email: 'john@gmail.com', number: '98765432', role: 'USER', balance: 15.50, pendingCommissions: 2.50, lowBalanceThreshold: 5, autoTransferCommission: true, referralCode: 'JOHN789', isSuspended: false, createdAt: new Date().toISOString() },
  { id: '3', name: 'Jane Smith', email: 'jane@gmail.com', number: '11223344', role: 'USER', balance: 5.00, pendingCommissions: 0, lowBalanceThreshold: 10, autoTransferCommission: false, referralCode: 'JANE456', isSuspended: false, createdAt: new Date().toISOString() },
  { id: '4', name: 'Bob Wilson', email: 'bob@gmail.com', number: '55667788', role: 'USER', balance: 0.00, pendingCommissions: 0, lowBalanceThreshold: 5, autoTransferCommission: true, referralCode: 'BOB999', isSuspended: false, createdAt: new Date().toISOString() },
];

const INITIAL_DOMAINS: MainDomain[] = [
  { id: 'd1', domain: 'subhub.site', cloudflareEmail: 'cf@admin.com', zoneId: 'zone_xyz', apiKey: 'key_123', monthlyPrice: 2.99, premiumThreshold: 4, premiumPrice: 9.99, status: 'active' },
  { id: 'd2', domain: 'free.net', cloudflareEmail: 'cf@admin.com', zoneId: 'zone_abc', apiKey: 'key_456', monthlyPrice: 5.00, premiumThreshold: 3, premiumPrice: 15.00, status: 'active' },
];

const INITIAL_RESERVED: ReservedName[] = [
  { id: 'rn1', name: 'google', mainDomainId: 'd1', price: 99.99, addedAt: new Date().toISOString() },
  { id: 'rn2', name: 'admin', mainDomainId: 'd1', price: 49.99, addedAt: new Date().toISOString() },
];

const INITIAL_SUBDOMAINS: Subdomain[] = [
  { id: 's1', userId: '2', mainDomainId: 'd1', name: 'myblog', fullDomain: 'myblog.subhub.site', ip: '1.1.1.1', registrationDate: '2023-10-01', expiryDate: '2024-10-01', period: 12, status: 'active', autoRenew: true }
];

const INITIAL_PRICING: PricingPlan[] = [
  {
    id: 'p1',
    name: 'Starter',
    price: '2.99',
    desc: 'Perfect for personal blogs and experiments.',
    features: ['Standard Subdomains', 'Cloudflare DNS', 'Community Support', 'Basic WHOIS Privacy'],
    color: 'emerald',
    popular: false
  },
  {
    id: 'p2',
    name: 'Professional',
    price: '5.99',
    desc: 'Ideal for startups and growing brands.',
    features: ['Premium Subdomains', 'Priority Propagation', 'Email Forwarding', 'Advanced API Access', 'Priority Support'],
    color: 'cyan',
    popular: true
  },
  {
    id: 'p3',
    name: 'Enterprise',
    price: 'Custom',
    desc: 'High-volume infrastructure for teams.',
    features: ['Unlimited Subdomains', 'Dedicated Root Domain', 'SLA Guarantee', 'Dedicated Account Manager', '24/7 Phone Support'],
    color: 'blue',
    popular: false
  }
];

const INITIAL_SETTINGS: AppSettings = {
  websiteName: 'SubHub',
  websiteLogo: '🚀',
  referralCommission: 10,
  couponsEnabled: true,
  promoConfig: {
    enabled: true,
    title: 'Flash Sale: 50% Off!',
    description: 'Get your premium .site subdomain for half price today only. Use code FLASH50 at checkout.',
    imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    buttonText: 'Claim Offer',
    buttonLink: '/get-domain'
  },
  pricingPlans: INITIAL_PRICING
};

const INITIAL_STATUS: SiteStatus[] = [
  { service: 'Cloudflare Edge API', status: 'operational', uptime: '99.98%' },
  { service: 'PipraPay Gateway', status: 'operational', uptime: '99.95%' },
  { service: 'DNS Propagation', status: 'operational', uptime: '100%' },
  { service: 'SubHub Core Engine', status: 'operational', uptime: '99.99%' },
];

const INITIAL_KEYWORDS: ForbiddenKeyword[] = [
  { id: 'k1', word: 'scam', addedAt: new Date().toISOString() },
  { id: 'k2', word: 'phish', addedAt: new Date().toISOString() },
  { id: 'k3', word: 'bank', addedAt: new Date().toISOString() },
  { id: 'k4', word: 'hack', addedAt: new Date().toISOString() },
];

const INITIAL_FAQs: FAQ[] = [
  { id: 'f1', category: 'General', question: 'How long does DNS propagation take?', answer: 'Usually within 30 minutes, but it can take up to 24 hours depending on your local ISP.' },
  { id: 'f2', category: 'Billing', question: 'What is the 30-minute lock?', answer: 'When you attempt to register a domain, it is reserved for you for 30 minutes. If not paid, it becomes available to others.' },
  { id: 'f3', category: 'Technical', question: 'How do I update my IP address?', answer: 'Go to "My Domains" and click the settings icon next to your active domain.' },
];

export const useStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('subhub_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('subhub_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [mainDomains, setMainDomains] = useState<MainDomain[]>(() => {
    const saved = localStorage.getItem('subhub_domains');
    return saved ? JSON.parse(saved) : INITIAL_DOMAINS;
  });

  const [reservedNames, setReservedNames] = useState<ReservedName[]>(() => {
    const saved = localStorage.getItem('subhub_reserved');
    return saved ? JSON.parse(saved) : INITIAL_RESERVED;
  });

  const [subdomains, setSubdomains] = useState<Subdomain[]>(() => {
    const saved = localStorage.getItem('subhub_subdomains');
    return saved ? JSON.parse(saved) : INITIAL_SUBDOMAINS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('subhub_invoices');
    return saved ? JSON.parse(saved) : [];
  });

  const [referrals, setReferrals] = useState<Referral[]>(() => {
    const saved = localStorage.getItem('subhub_referrals');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('subhub_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('subhub_coupons');
    return saved ? JSON.parse(saved) : [];
  });

  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>(() => {
    const saved = localStorage.getItem('subhub_transfers');
    return saved ? JSON.parse(saved) : [];
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('subhub_tickets');
    return saved ? JSON.parse(saved) : [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('subhub_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [forbiddenKeywords, setForbiddenKeywords] = useState<ForbiddenKeyword[]>(() => {
    const saved = localStorage.getItem('subhub_keywords');
    return saved ? JSON.parse(saved) : INITIAL_KEYWORDS;
  });

  const [siteStatus, setSiteStatus] = useState<SiteStatus[]>(INITIAL_STATUS);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('subhub_user', JSON.stringify(currentUser));
    localStorage.setItem('subhub_users', JSON.stringify(users));
    localStorage.setItem('subhub_domains', JSON.stringify(mainDomains));
    localStorage.setItem('subhub_reserved', JSON.stringify(reservedNames));
    localStorage.setItem('subhub_subdomains', JSON.stringify(subdomains));
    localStorage.setItem('subhub_invoices', JSON.stringify(invoices));
    localStorage.setItem('subhub_referrals', JSON.stringify(referrals));
    localStorage.setItem('subhub_settings', JSON.stringify(settings));
    localStorage.setItem('subhub_coupons', JSON.stringify(coupons));
    localStorage.setItem('subhub_transfers', JSON.stringify(transferRequests));
    localStorage.setItem('subhub_tickets', JSON.stringify(tickets));
    localStorage.setItem('subhub_audit_logs', JSON.stringify(auditLogs));
    localStorage.setItem('subhub_keywords', JSON.stringify(forbiddenKeywords));
  }, [currentUser, users, mainDomains, reservedNames, subdomains, invoices, referrals, settings, coupons, transferRequests, tickets, auditLogs, forbiddenKeywords]);

  // Auto-Renew Engine Simulator
  useEffect(() => {
    const unpaidInvoices = invoices.filter(i => i.status === 'unpaid');
    if (unpaidInvoices.length === 0) return;

    unpaidInvoices.forEach(inv => {
      const sub = subdomains.find(s => s.id === inv.subdomainId);
      const user = users.find(u => u.id === inv.userId);
      
      if (sub?.autoRenew && user && user.balance >= inv.amount) {
        // Auto pay logic
        payWithBalance(inv.id);
      }
    });
  }, [invoices, subdomains]);

  const getRevenueStats = (): RevenueStats => {
    const activeSubdomains = subdomains.filter(s => s.status === 'active');
    
    // MRR Calculation
    const mrr = activeSubdomains.reduce((acc, sub) => {
      const domain = mainDomains.find(d => d.id === sub.mainDomainId);
      // Check if it's a reserved name first
      const reserved = reservedNames.find(rn => rn.name === sub.name && rn.mainDomainId === sub.mainDomainId);
      if (reserved) return acc + reserved.price;

      const isPremium = sub.name.length < (domain?.premiumThreshold || 0);
      const price = isPremium ? (domain?.premiumPrice || 0) : (domain?.monthlyPrice || 0);
      return acc + price;
    }, 0);

    // Revenue tracking
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const monthStr = now.toISOString().split('-').slice(0, 2).join('-');

    const paidInvoices = invoices.filter(inv => inv.status === 'paid');
    const dailyRevenue = paidInvoices
      .filter(inv => inv.createdAt.startsWith(todayStr))
      .reduce((acc, inv) => acc + inv.amount, 0);
    
    const monthlyRevenue = paidInvoices
      .filter(inv => inv.createdAt.startsWith(monthStr))
      .reduce((acc, inv) => acc + inv.amount, 0);

    // Churn (Expired vs Total)
    const expiredCount = subdomains.filter(s => s.status === 'expired' || s.status === 'suspended').length;
    const totalEver = subdomains.length || 1;
    const churnRate = (expiredCount / totalEver) * 100;

    // Expiring Soon (next 30 days)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).getTime();
    const expiringSoon = activeSubdomains.filter(s => {
      const expiry = new Date(s.expiryDate).getTime();
      return expiry < thirtyDaysFromNow;
    }).length;

    return { mrr, dailyRevenue, monthlyRevenue, churnRate, expiringSoon };
  };

  const logAction = (action: string, details: string, type: AuditLog['type'] = 'info', targetId?: string) => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      type,
      targetId,
      createdAt: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = (email: string) => {
    const user = users.find(u => u.email === email);
    if (user && !user.isSuspended) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const newUsers = users.map(u => u.id === currentUser.id ? { ...u, ...updated } : u);
    setUsers(newUsers);
    setCurrentUser({ ...currentUser, ...updated });
    logAction('Profile Update', `User updated their profile information.`);
  };

  const claimCommissions = () => {
    if (!currentUser || currentUser.pendingCommissions <= 0) return;
    const amount = currentUser.pendingCommissions;
    const newBalance = currentUser.balance + amount;
    const newUsers = users.map(u => u.id === currentUser.id ? { ...u, balance: newBalance, pendingCommissions: 0 } : u);
    setUsers(newUsers);
    setCurrentUser({ ...currentUser, balance: newBalance, pendingCommissions: 0 });
    logAction('Commission Claim', `User claimed $${amount.toFixed(2)} in referral commissions to their wallet.`);
  };

  const depositBalance = (amount: number) => {
    if (!currentUser) return;
    const newBalance = currentUser.balance + amount;
    const newUsers = users.map(u => u.id === currentUser.id ? { ...u, balance: newBalance } : u);
    setUsers(newUsers);
    setCurrentUser({ ...currentUser, balance: newBalance });
    logAction('Wallet Deposit', `User deposited $${amount.toFixed(2)} into their wallet.`);
  };

  const payWithBalance = (invoiceId: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv || inv.status === 'paid') return false;
    
    const user = users.find(u => u.id === inv.userId);
    if (!user || user.balance < inv.amount) return false;

    const newBalance = user.balance - inv.amount;
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: newBalance } : u));
    if (currentUser?.id === user.id) {
      setCurrentUser({ ...currentUser, balance: newBalance });
    }

    setInvoices(prev => prev.map(i => i.id === invoiceId ? { ...i, status: 'paid' } : i));
    setSubdomains(subs => subs.map(s => s.id === inv.subdomainId ? { ...s, status: 'active', lockedUntil: undefined } : s));
    
    logAction('Wallet Payment', `Invoice ${invoiceId} paid automatically using wallet balance.`, 'info', inv.subdomainId);
    return true;
  };

  const toggleAutoRenew = (subdomainId: string) => {
    const sub = subdomains.find(s => s.id === subdomainId);
    if (!sub) return;
    const newState = !sub.autoRenew;
    setSubdomains(prev => prev.map(s => s.id === subdomainId ? { ...s, autoRenew: newState } : s));
    logAction('Renewal Update', `Auto-renew ${newState ? 'enabled' : 'disabled'} for ${sub.fullDomain}`);
  };

  const registerSubdomain = (name: string, domainId: string, months: number) => {
    if (!currentUser) return;
    
    const isAbusive = forbiddenKeywords.some(k => name.toLowerCase().includes(k.word.toLowerCase()));
    if (isAbusive) {
      logAction('Blocked Registration', `Attempted to register abusive name: ${name}`, 'warning');
      alert("This domain name is forbidden by our safety policy.");
      return null;
    }

    const domain = mainDomains.find(d => d.id === domainId);
    if (!domain) return;

    // Pricing Logic: Check Reserved -> Premium -> Standard
    const reserved = reservedNames.find(rn => rn.name === name.toLowerCase() && rn.mainDomainId === domainId);
    
    let monthlyPrice = domain.monthlyPrice;
    let label = 'Standard';

    if (reserved) {
      monthlyPrice = reserved.price;
      label = 'Reserved Premium';
    } else if (name.length < domain.premiumThreshold) {
      monthlyPrice = domain.premiumPrice;
      label = 'Auto Premium';
    }

    const amount = monthlyPrice * months;

    const newSub: Subdomain = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      mainDomainId: domainId,
      name,
      fullDomain: `${name}.${domain.domain}`,
      ip: '0.0.0.0',
      registrationDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString(),
      period: months,
      status: 'locked',
      lockedUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      autoRenew: true
    };

    const newInvoice: Invoice = {
      id: `INV-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      userId: currentUser.id,
      subdomainId: newSub.id,
      amount: amount,
      originalAmount: amount,
      discountApplied: 0,
      status: 'unpaid',
      createdAt: new Date().toISOString(),
    };

    setSubdomains([...subdomains, newSub]);
    setInvoices([...invoices, newInvoice]);
    logAction('Domain Registration', `User initiated registration for ${newSub.fullDomain} (${label})`);
    return newInvoice;
  };

  const payInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        setSubdomains(subs => subs.map(s => s.id === inv.subdomainId ? { ...s, status: 'active', lockedUntil: undefined } : s));
        logAction('Invoice Paid', `Invoice ${invoiceId} paid. Domain activated.`, 'info', inv.subdomainId);
        return { ...inv, status: 'paid' };
      }
      return inv;
    }));
  };

  const updateSubdomainIP = (id: string, ip: string) => {
    const sub = subdomains.find(s => s.id === id);
    setSubdomains(prev => prev.map(s => s.id === id ? { ...s, ip } : s));
    logAction('DNS Update', `IP changed to ${ip} for ${sub?.fullDomain}`, 'info', id);
  };

  const addMainDomain = (domain: Omit<MainDomain, 'id'>) => {
    const newDomain: MainDomain = { ...domain, id: Math.random().toString(36).substr(2, 9) };
    setMainDomains([...mainDomains, newDomain]);
    logAction('System Update', `New base domain added: ${domain.domain}`, 'critical');
  };

  const toggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u));
    logAction('User Management', `User ${user?.email} ${user?.isSuspended ? 'activated' : 'suspended'}`, 'critical', userId);
  };

  const toggleSubdomainStatus = (id: string) => {
    const sub = subdomains.find(s => s.id === id);
    setSubdomains(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s));
    logAction('Domain Management', `Domain ${sub?.fullDomain} ${sub?.status === 'active' ? 'suspended' : 'activated'}`, 'warning', id);
  };

  const addForbiddenKeyword = (word: string) => {
    const newKeyword: ForbiddenKeyword = {
      id: Math.random().toString(36).substr(2, 9),
      word: word.toLowerCase(),
      addedAt: new Date().toISOString()
    };
    setForbiddenKeywords([...forbiddenKeywords, newKeyword]);
    logAction('Security Update', `New forbidden keyword added: ${word}`, 'warning');
  };

  const removeForbiddenKeyword = (id: string) => {
    const kw = forbiddenKeywords.find(k => k.id === id);
    setForbiddenKeywords(prev => prev.filter(k => k.id !== id));
    logAction('Security Update', `Forbidden keyword removed: ${kw?.word}`, 'info');
  };

  const addReservedName = (rn: Omit<ReservedName, 'id' | 'addedAt'>) => {
    const newRn: ReservedName = {
      ...rn,
      id: Math.random().toString(36).substr(2, 9),
      addedAt: new Date().toISOString()
    };
    setReservedNames([...reservedNames, newRn]);
    logAction('Security Update', `New reserved name added: ${rn.name}`, 'info');
  };

  const removeReservedName = (id: string) => {
    const rn = reservedNames.find(r => r.id === id);
    setReservedNames(prev => prev.filter(r => r.id !== id));
    logAction('Security Update', `Reserved name removed: ${rn?.name}`, 'info');
  };

  const generateTransferKey = (subdomainId: string) => {
    if (!currentUser) return null;
    const secretKey = Math.random().toString(36).substr(2, 12).toUpperCase();
    const newRequest: TransferRequest = {
      id: Math.random().toString(36).substr(2, 9),
      subdomainId,
      senderId: currentUser.id,
      secretKey,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTransferRequests([...transferRequests, newRequest]);
    logAction('Transfer Started', `Transfer key generated for domain ID ${subdomainId}`);
    return secretKey;
  };

  const submitTransferClaim = (secretKey: string) => {
    if (!currentUser) return { success: false, message: 'Login required' };
    const request = transferRequests.find(r => r.secretKey === secretKey && r.status === 'pending');
    if (!request) return { success: false, message: 'Invalid or expired secret key' };
    setTransferRequests(prev => prev.map(r => r.id === request.id ? { ...r, status: 'requested', receiverId: currentUser.id } : r));
    logAction('Transfer Claim', `User claimed domain with secret key. Waiting for approval.`);
    return { success: true, message: 'Transfer requested!' };
  };

  const handleTransferAction = (requestId: string, action: 'approve' | 'reject') => {
    const request = transferRequests.find(r => r.id === requestId);
    if (!request) return;
    if (action === 'approve') {
      const sub = subdomains.find(s => s.id === request.subdomainId);
      setSubdomains(prev => prev.map(s => s.id === request.subdomainId ? { ...s, userId: request.receiverId! } : s));
      setTransferRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'completed' } : r));
      logAction('Transfer Completed', `Domain ${sub?.fullDomain} transferred to new owner.`, 'warning', sub?.id);
    } else {
      setTransferRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'cancelled' } : r));
      logAction('Transfer Rejected', `Transfer request for ID ${request.id} was rejected.`);
    }
  };

  const createTicket = (subject: string, category: SupportTicket['category'], message: string) => {
    if (!currentUser) return;
    const newTicket: SupportTicket = {
      id: `TKT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: currentUser.id,
      subject,
      category,
      status: 'open',
      messages: [{ id: Math.random().toString(36).substr(2, 9), senderId: currentUser.id, text: message, createdAt: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTickets([newTicket, ...tickets]);
    logAction('Support Ticket', `New ticket opened: ${subject}`);
    return newTicket;
  };

  const replyToTicket = (ticketId: string, text: string) => {
    if (!currentUser) return;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: currentUser.role === 'ADMIN' ? 'replied' : 'open',
          messages: [...t.messages, { id: Math.random().toString(36).substr(2, 9), senderId: currentUser.id, text, createdAt: new Date().toISOString() }],
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
  };

  const closeTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'closed', updatedAt: new Date().toISOString() } : t));
    logAction('Support Ticket', `Ticket ${ticketId} closed.`);
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = { ...coupon, id: Math.random().toString(36).substr(2, 9), usageCount: 0 };
    setCoupons(prev => [...prev, newCoupon]);
    logAction('Coupon Created', `New coupon ${newCoupon.code} added.`, 'info');
  };

  const deleteCoupon = (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    setCoupons(prev => prev.filter(c => c.id !== id));
    logAction('Coupon Deleted', `Coupon ${coupon?.code} was removed.`, 'warning');
  };

  const toggleCouponStatus = (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
    logAction('Coupon Management', `Coupon ${coupon?.code} status toggled`, 'info');
  };

  const applyCouponToInvoice = (invoiceId: string, code: string) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return { success: false, message: 'Invoice not found' };
    if (invoice.status === 'paid') return { success: false, message: 'Invoice already paid' };
    if (invoice.couponUsed) return { success: false, message: 'Coupon already applied' };

    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.status === 'active');
    if (!coupon) return { success: false, message: 'Invalid or expired coupon' };

    // Validity Checks
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { success: false, message: 'This coupon has expired.' };
    }

    if (coupon.isOneTimePerUser) {
      const alreadyUsed = invoices.some(inv => 
        inv.userId === invoice.userId && 
        inv.couponUsed?.toUpperCase() === code.toUpperCase()
      );
      if (alreadyUsed) {
        return { success: false, message: 'You have already used this coupon.' };
      }
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (invoice.originalAmount * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }

    const newAmount = Math.max(0, invoice.originalAmount - discount);
    
    setInvoices(prev => prev.map(inv => inv.id === invoiceId ? {
      ...inv,
      amount: newAmount,
      discountApplied: discount,
      couponUsed: coupon.code
    } : inv));

    setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, usageCount: c.usageCount + 1 } : c));
    logAction('Coupon Applied', `Coupon ${coupon.code} applied to invoice ${invoiceId}. Discount: $${discount.toFixed(2)}`, 'info', invoiceId);
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const addPricingPlan = (plan: Omit<PricingPlan, 'id'>) => {
    const newPlan: PricingPlan = { ...plan, id: Math.random().toString(36).substr(2, 9) };
    setSettings(prev => ({
      ...prev,
      pricingPlans: [...prev.pricingPlans, newPlan]
    }));
    logAction('Pricing Update', `New pricing plan added: ${plan.name}`, 'info');
  };

  const updatePricingPlan = (id: string, updates: Partial<PricingPlan>) => {
    setSettings(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    logAction('Pricing Update', `Pricing plan ${id} updated.`, 'info');
  };

  const deletePricingPlan = (id: string) => {
    const plan = settings.pricingPlans.find(p => p.id === id);
    setSettings(prev => ({
      ...prev,
      pricingPlans: prev.pricingPlans.filter(p => p.id !== id)
    }));
    logAction('Pricing Update', `Pricing plan ${plan?.name} deleted.`, 'warning');
  };

  return {
    currentUser, login, logout, users, mainDomains, subdomains, invoices, referrals, settings, coupons, transferRequests, tickets, faqs: INITIAL_FAQs,
    auditLogs, forbiddenKeywords, siteStatus, reservedNames,
    updateProfile, registerSubdomain, payInvoice, updateSubdomainIP, addMainDomain, toggleUserStatus, toggleSubdomainStatus, 
    generateTransferKey, submitTransferClaim, handleTransferAction, createTicket, replyToTicket, closeTicket, setSettings, setSubdomains, setInvoices,
    addForbiddenKeyword, removeForbiddenKeyword, addCoupon, deleteCoupon, toggleCouponStatus, applyCouponToInvoice, getRevenueStats,
    addPricingPlan, updatePricingPlan, deletePricingPlan, depositBalance, payWithBalance, toggleAutoRenew, claimCommissions,
    addReservedName, removeReservedName
  };
};
