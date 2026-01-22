
export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  role: Role;
  balance: number;
  referralCode: string;
  referredBy?: string;
  isSuspended: boolean;
  createdAt: string;
}

export interface MainDomain {
  id: string;
  domain: string;
  cloudflareEmail: string;
  zoneId: string;
  apiKey: string;
  monthlyPrice: number;
  status: 'active' | 'inactive';
}

export interface Subdomain {
  id: string;
  userId: string;
  mainDomainId: string;
  name: string; // The "sub" part
  fullDomain: string; // sub.main.com
  ip: string;
  registrationDate: string;
  expiryDate: string;
  period: number; // months
  status: 'pending' | 'active' | 'suspended' | 'expired' | 'locked';
  lockedUntil?: string;
}

export interface Invoice {
  id: string;
  userId: string;
  subdomainId: string;
  amount: number;
  originalAmount: number;
  discountApplied: number;
  couponUsed?: string;
  status: 'unpaid' | 'paid';
  createdAt: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  commission: number;
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  status: 'active' | 'inactive';
  usageCount: number;
}

export interface AppSettings {
  websiteName: string;
  websiteLogo: string;
  referralCommission: number; // Percentage
  couponsEnabled: boolean;
}
