
export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  number: string;
  role: Role;
  balance: number;
  pendingCommissions: number; // Commissions not yet transferred to wallet
  lowBalanceThreshold: number; // User-defined threshold for alerts
  autoTransferCommission: boolean; // Toggle for auto-transferring referrals
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
  premiumThreshold: number; // Names shorter than this are premium
  premiumPrice: number;     // Monthly price for premium names
  status: 'active' | 'inactive';
}

export interface ReservedName {
  id: string;
  name: string;
  mainDomainId: string;
  price: number;
  addedAt: string;
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
  autoRenew: boolean;
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
  isOneTimePerUser: boolean; // NEW: One-time use per account or multiple
  expiryDate: string | null; // NEW: Validity date
}

export interface TransferRequest {
  id: string;
  subdomainId: string;
  senderId: string;
  receiverId?: string;
  secretKey: string;
  status: 'pending' | 'requested' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  targetId?: string;
  details: string;
  createdAt: string;
  type: 'info' | 'warning' | 'critical';
}

export interface ForbiddenKeyword {
  id: string;
  word: string;
  addedAt: string;
}

export interface TicketMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: 'Billing' | 'Technical' | 'Transfer' | 'Other';
  status: 'open' | 'replied' | 'closed';
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface PromoConfig {
  enabled: boolean;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  desc: string;
  features: string[];
  color: string;
  popular: boolean;
}

export interface AppSettings {
  websiteName: string;
  websiteLogo: string;
  referralCommission: number; // Percentage
  couponsEnabled: boolean;
  promoConfig: PromoConfig;
  pricingPlans: PricingPlan[];
}

export interface SiteStatus {
  service: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: string;
}

export interface RevenueStats {
  mrr: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  churnRate: number;
  expiringSoon: number;
}
