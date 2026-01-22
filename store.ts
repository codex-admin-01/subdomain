
import { useState, useEffect } from 'react';
import { User, MainDomain, Subdomain, Invoice, Referral, AppSettings, Coupon } from './types';

// Initial Mock Data
const INITIAL_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@subhub.com', number: '12345678', role: 'ADMIN', balance: 0, referralCode: 'ADMIN123', isSuspended: false, createdAt: new Date().toISOString() },
  { id: '2', name: 'John Doe', email: 'john@gmail.com', number: '98765432', role: 'USER', balance: 15.50, referralCode: 'JOHN789', isSuspended: false, createdAt: new Date().toISOString() },
];

const INITIAL_DOMAINS: MainDomain[] = [
  { id: 'd1', domain: 'subhub.site', cloudflareEmail: 'cf@admin.com', zoneId: 'zone_xyz', apiKey: 'key_123', monthlyPrice: 2.99, status: 'active' },
  { id: 'd2', domain: 'free.net', cloudflareEmail: 'cf@admin.com', zoneId: 'zone_abc', apiKey: 'key_456', monthlyPrice: 5.00, status: 'active' },
];

const INITIAL_SUBDOMAINS: Subdomain[] = [
  { id: 's1', userId: '2', mainDomainId: 'd1', name: 'myblog', fullDomain: 'myblog.subhub.site', ip: '1.1.1.1', registrationDate: '2023-10-01', expiryDate: '2024-10-01', period: 12, status: 'active' }
];

const INITIAL_SETTINGS: AppSettings = {
  websiteName: 'SubHub',
  websiteLogo: '🚀',
  referralCommission: 10,
  couponsEnabled: true,
};

const INITIAL_COUPONS: Coupon[] = [
  { id: 'c1', code: 'WELCOME50', discountType: 'percentage', discountValue: 50, status: 'active', usageCount: 0 },
  { id: 'c2', code: 'FIXED5', discountType: 'fixed', discountValue: 5, status: 'active', usageCount: 0 },
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
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('subhub_user', JSON.stringify(currentUser));
    localStorage.setItem('subhub_users', JSON.stringify(users));
    localStorage.setItem('subhub_domains', JSON.stringify(mainDomains));
    localStorage.setItem('subhub_subdomains', JSON.stringify(subdomains));
    localStorage.setItem('subhub_invoices', JSON.stringify(invoices));
    localStorage.setItem('subhub_referrals', JSON.stringify(referrals));
    localStorage.setItem('subhub_settings', JSON.stringify(settings));
    localStorage.setItem('subhub_coupons', JSON.stringify(coupons));
  }, [currentUser, users, mainDomains, subdomains, invoices, referrals, settings, coupons]);

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
  };

  const registerSubdomain = (name: string, domainId: string, months: number) => {
    if (!currentUser) return;
    const domain = mainDomains.find(d => d.id === domainId);
    if (!domain) return;

    const amount = domain.monthlyPrice * months;
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
      lockedUntil: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 mins lock
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
    return newInvoice;
  };

  const applyCouponToInvoice = (invoiceId: string, couponCode: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.status === 'active');
    if (!coupon) return { success: false, message: 'Invalid or inactive coupon' };

    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId && inv.status === 'unpaid') {
        let discount = 0;
        if (coupon.discountType === 'percentage') {
          discount = (inv.originalAmount * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        
        const finalAmount = Math.max(0, inv.originalAmount - discount);
        return {
          ...inv,
          amount: finalAmount,
          discountApplied: discount,
          couponUsed: coupon.code
        };
      }
      return inv;
    }));

    return { success: true, message: 'Coupon applied!' };
  };

  const payInvoice = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        // Find subdomain and update status
        setSubdomains(subs => subs.map(s => s.id === inv.subdomainId ? { ...s, status: 'active', lockedUntil: undefined } : s));
        
        // Update coupon usage count
        if (inv.couponUsed) {
          setCoupons(prevCoupons => prevCoupons.map(c => c.code === inv.couponUsed ? { ...c, usageCount: c.usageCount + 1 } : c));
        }

        // Handle Referral Commission
        if (currentUser?.referredBy) {
          const referrer = users.find(u => u.id === currentUser.referredBy);
          if (referrer) {
            const commission = (inv.amount * settings.referralCommission) / 100;
            setUsers(usrs => usrs.map(u => u.id === referrer.id ? { ...u, balance: u.balance + commission } : u));
            setReferrals(refs => [...refs, {
              id: Math.random().toString(36).substr(2, 9),
              referrerId: referrer.id,
              referredUserId: currentUser.id,
              commission,
              date: new Date().toISOString()
            }]);
          }
        }
        return { ...inv, status: 'paid' };
      }
      return inv;
    }));
  };

  const updateSubdomainIP = (id: string, ip: string) => {
    setSubdomains(prev => prev.map(s => s.id === id ? { ...s, ip } : s));
  };

  const addMainDomain = (domain: Omit<MainDomain, 'id'>) => {
    const newDomain: MainDomain = {
      ...domain,
      id: Math.random().toString(36).substr(2, 9),
    };
    setMainDomains([...mainDomains, newDomain]);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, isSuspended: !u.isSuspended } : u));
  };

  const toggleSubdomainStatus = (id: string) => {
    setSubdomains(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s));
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Math.random().toString(36).substr(2, 9),
      usageCount: 0
    };
    setCoupons([...coupons, newCoupon]);
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const toggleCouponStatus = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
  };

  return {
    currentUser, login, logout, users, mainDomains, subdomains, invoices, referrals, settings, coupons,
    updateProfile, registerSubdomain, applyCouponToInvoice, payInvoice, updateSubdomainIP, addMainDomain, toggleUserStatus, 
    toggleSubdomainStatus, setSettings, setSubdomains, setInvoices, addCoupon, deleteCoupon, toggleCouponStatus
  };
};
