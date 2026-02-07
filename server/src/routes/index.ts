import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, requireAdmin, requireAuth } from '../middleware/auth.js';
import { signAccessToken, signRefreshToken, verifyToken } from '../utils/tokens.js';

export const router = Router();

const publicUserSelect = { id: true, name: true, email: true, phone: true, role: true, status: true, createdAt: true, referralCode: true, lowBalanceThreshold: true, autoTransferCommission: true, pendingCommissions: true };
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });

router.post('/auth/register', async (req, res) => {
  const dto = z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6), phone: z.string().optional() }).parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) return res.status(409).json({ message: 'Email in use' });
  const user = await prisma.user.create({ data: { ...dto, passwordHash: await bcrypt.hash(dto.password, 10), referralCode: Math.random().toString(36).slice(2, 8).toUpperCase() }, select: publicUserSelect });
  await prisma.wallet.create({ data: { userId: user.id } });
  res.status(201).json(user);
});

router.post('/auth/login', loginLimiter, async (req, res) => {
  const dto = z.object({ email: z.string().email(), password: z.string() }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: dto.email } });
  if (!user || !(await bcrypt.compare(dto.password, user.passwordHash)) || user.status !== 'ACTIVE') return res.status(401).json({ message: 'Invalid credentials' });
  const payload = { userId: user.id, role: user.role } as const;
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + 7 * 86400000) } });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'lax' });
  res.json({ accessToken, user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status, pendingCommissions: user.pendingCommissions, lowBalanceThreshold: user.lowBalanceThreshold, autoTransferCommission: user.autoTransferCommission, referralCode: user.referralCode, createdAt: user.createdAt } });
});

router.post('/auth/refresh', async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return res.status(401).json({ message: 'Missing refresh token' });
  const dbToken = await prisma.refreshToken.findUnique({ where: { token } });
  if (!dbToken || dbToken.expiresAt < new Date()) return res.status(401).json({ message: 'Invalid refresh token' });
  const payload = verifyToken(token, process.env.JWT_REFRESH_SECRET!);
  res.json({ accessToken: signAccessToken(payload) });
});

router.post('/auth/logout', requireAuth, async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (token) await prisma.refreshToken.deleteMany({ where: { token } });
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

router.get('/auth/me', requireAuth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId }, select: { ...publicUserSelect, wallet: { select: { balance: true } } } });
  res.json(user);
});

router.post('/auth/change-password', requireAuth, async (req: AuthRequest, res) => {
  const dto = z.object({ currentPassword: z.string(), newPassword: z.string().min(6) }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
  if (!user || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) return res.status(400).json({ message: 'Invalid current password' });
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(dto.newPassword, 10) } });
  res.json({ success: true });
});

router.get('/admin/users', requireAuth, requireAdmin, async (_req, res) => res.json(await prisma.user.findMany({ select: { ...publicUserSelect, wallet: { select: { balance: true } } } })));
router.patch('/admin/users/:id/disable', requireAuth, requireAdmin, async (req, res) => res.json(await prisma.user.update({ where: { id: req.params.id }, data: { status: req.body.status ?? 'DISABLED' }, select: publicUserSelect })));
router.post('/admin/users/:id/reset-password', requireAuth, requireAdmin, async (req, res) => { await prisma.user.update({ where: { id: req.params.id }, data: { passwordHash: await bcrypt.hash(req.body.password ?? 'Reset123!', 10) } }); res.json({ success: true }); });

router.get('/domains', requireAuth, async (_req, res) => res.json(await prisma.domain.findMany()));
router.post('/domains', requireAuth, requireAdmin, async (req, res) => res.status(201).json(await prisma.domain.create({ data: z.object({ name: z.string(), monthlyPrice: z.number(), premiumThreshold: z.number(), premiumPrice: z.number() }).parse(req.body) })));
router.patch('/domains/:id', requireAuth, requireAdmin, async (req, res) => res.json(await prisma.domain.update({ where: { id: req.params.id }, data: req.body })));
router.delete('/domains/:id', requireAuth, requireAdmin, async (req, res) => { await prisma.domain.delete({ where: { id: req.params.id } }); res.json({ success: true }); });
router.get('/domains/check/:name', requireAuth, async (req, res) => {
  const exists = await prisma.subdomain.findFirst({ where: { fullDomain: { startsWith: `${req.params.name}.` } } });
  res.json({ available: !exists });
});
router.post('/domains/:id/subdomains', requireAuth, async (req: AuthRequest, res) => {
  const dto = z.object({ name: z.string(), target: z.string().default('0.0.0.0'), period: z.number().int().positive().default(1) }).parse(req.body);
  const domain = await prisma.domain.findUnique({ where: { id: req.params.id } });
  if (!domain) return res.status(404).json({ message: 'Domain not found' });
  const fullDomain = `${dto.name}.${domain.name}`;
  const sub = await prisma.subdomain.create({ data: { ...dto, fullDomain, domainId: domain.id, ownerId: req.user!.userId, status: 'LOCKED', expiryDate: new Date(Date.now() + dto.period * 30 * 86400000) } });
  await prisma.invoice.create({ data: { userId: req.user!.userId, amount: domain.monthlyPrice * dto.period, period: new Date().toISOString().slice(0, 7) } });
  res.status(201).json(sub);
});
router.get('/domains/:id/subdomains', requireAuth, async (req: AuthRequest, res) => {
  const where = req.user!.role === 'ADMIN' ? { domainId: req.params.id } : { domainId: req.params.id, ownerId: req.user!.userId };
  res.json(await prisma.subdomain.findMany({ where }));
});
router.patch('/domains/:id/subdomains/:subId', requireAuth, async (req: AuthRequest, res) => {
  const sub = await prisma.subdomain.findUnique({ where: { id: req.params.subId } });
  if (!sub || (req.user!.role !== 'ADMIN' && sub.ownerId !== req.user!.userId)) return res.status(403).json({ message: 'Forbidden' });
  res.json(await prisma.subdomain.update({ where: { id: sub.id }, data: req.body }));
});
router.delete('/domains/:id/subdomains/:subId', requireAuth, async (req: AuthRequest, res) => {
  const sub = await prisma.subdomain.findUnique({ where: { id: req.params.subId } });
  if (!sub || (req.user!.role !== 'ADMIN' && sub.ownerId !== req.user!.userId)) return res.status(403).json({ message: 'Forbidden' });
  await prisma.subdomain.delete({ where: { id: sub.id } });
  res.json({ success: true });
});

router.get('/wallet', requireAuth, async (req: AuthRequest, res) => res.json(await prisma.wallet.findUnique({ where: { userId: req.user!.userId }, include: { transactions: { orderBy: { createdAt: 'desc' } } } })));
router.post('/wallet/deposit', requireAuth, async (req: AuthRequest, res) => {
  const amount = z.object({ amount: z.number().positive() }).parse(req.body).amount;
  const wallet = await prisma.wallet.upsert({ where: { userId: req.user!.userId }, update: { balance: { increment: amount } }, create: { userId: req.user!.userId, balance: amount } });
  await prisma.transaction.create({ data: { walletId: wallet.id, amount, type: 'DEPOSIT', status: 'COMPLETED', reference: 'manual-deposit' } });
  res.json(wallet);
});
router.get('/transfers', requireAuth, async (req: AuthRequest, res) => res.json(await prisma.transaction.findMany({ where: { wallet: { userId: req.user!.userId }, type: 'TRANSFER' }, orderBy: { createdAt: 'desc' } })));
router.post('/transfers', requireAuth, async (req: AuthRequest, res) => {
  const amount = z.object({ amount: z.number().positive(), reference: z.string().optional() }).parse(req.body).amount;
  const wallet = await prisma.wallet.findUnique({ where: { userId: req.user!.userId } });
  if (!wallet || wallet.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
  await prisma.wallet.update({ where: { id: wallet.id }, data: { balance: { decrement: amount } } });
  res.status(201).json(await prisma.transaction.create({ data: { walletId: wallet.id, amount, type: 'TRANSFER', status: 'COMPLETED', reference: req.body.reference } }));
});

router.get('/invoices', requireAuth, async (req: AuthRequest, res) => res.json(await prisma.invoice.findMany({ where: req.user!.role === 'ADMIN' ? {} : { userId: req.user!.userId }, orderBy: { createdAt: 'desc' } })));
router.get('/invoices/:id', requireAuth, async (req, res) => res.json(await prisma.invoice.findUnique({ where: { id: req.params.id } })));
router.patch('/invoices/:id/pay', requireAuth, async (req: AuthRequest, res) => {
  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
  if (!invoice || (req.user!.role !== 'ADMIN' && invoice.userId !== req.user!.userId)) return res.status(403).json({ message: 'Forbidden' });
  res.json(await prisma.invoice.update({ where: { id: invoice.id }, data: { status: 'PAID' } }));
});

router.get('/support', requireAuth, async (req: AuthRequest, res) => res.json(await prisma.supportTicket.findMany({ where: { userId: req.user!.userId }, include: { replies: true }, orderBy: { createdAt: 'desc' } })));
router.post('/support', requireAuth, async (req: AuthRequest, res) => res.status(201).json(await prisma.supportTicket.create({ data: { userId: req.user!.userId, ...z.object({ subject: z.string(), message: z.string(), priority: z.enum(['LOW','MEDIUM','HIGH','URGENT']).optional() }).parse(req.body) } })));
router.post('/support/:id/replies', requireAuth, async (req: AuthRequest, res) => {
  const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id } });
  if (!ticket || (req.user!.role !== 'ADMIN' && ticket.userId !== req.user!.userId)) return res.status(403).json({ message: 'Forbidden' });
  res.status(201).json(await prisma.ticketReply.create({ data: { ticketId: ticket.id, authorId: req.user!.userId, message: z.object({ message: z.string() }).parse(req.body).message, isInternal: false } }));
});
router.get('/admin/support', requireAuth, requireAdmin, async (_req, res) => res.json(await prisma.supportTicket.findMany({ include: { user: { select: publicUserSelect }, replies: true }, orderBy: { createdAt: 'desc' } })));
router.patch('/admin/support/:id/status', requireAuth, requireAdmin, async (req, res) => res.json(await prisma.supportTicket.update({ where: { id: req.params.id }, data: { status: req.body.status } })));
router.post('/admin/support/:id/reply', requireAuth, requireAdmin, async (req: AuthRequest, res) => res.status(201).json(await prisma.ticketReply.create({ data: { ticketId: req.params.id, authorId: req.user!.userId, message: req.body.message, isInternal: !!req.body.isInternal } })));

router.get('/admin/audit-logs', requireAuth, requireAdmin, async (req, res) => res.json(await prisma.auditLog.findMany({ where: req.query.action ? { action: String(req.query.action) } : {}, orderBy: { createdAt: 'desc' } })));
router.get('/admin/abuse', requireAuth, requireAdmin, async (_req, res) => res.json(await prisma.abuseReport.findMany({ include: { domain: true, subdomain: true }, orderBy: { createdAt: 'desc' } })));
router.patch('/admin/abuse/:id/status', requireAuth, requireAdmin, async (req, res) => res.json(await prisma.abuseReport.update({ where: { id: req.params.id }, data: { status: req.body.status } })));

router.get('/admin/settings', requireAuth, requireAdmin, async (_req, res) => res.json(await prisma.appSetting.findMany()));
router.put('/admin/settings', requireAuth, requireAdmin, async (req, res) => {
  const entries = Object.entries(req.body as Record<string, string>);
  await Promise.all(entries.map(([key, value]) => prisma.appSetting.upsert({ where: { key }, update: { value: String(value) }, create: { key, value: String(value) } })));
  res.json(await prisma.appSetting.findMany());
});

router.get('/status', async (_req, res) => res.json(await prisma.statusIncident.findMany({ orderBy: { createdAt: 'desc' } })));
router.get('/whois', async (req, res) => {
  const query = String(req.query.query || '');
  const fullDomain = String(req.query.fullDomain || '');
  const found = await prisma.subdomain.findFirst({ where: fullDomain ? { fullDomain } : { name: query }, include: { owner: { select: { name: true, email: true } } } });
  const result = found ? { found: true, owner: found.owner, regDate: found.createdAt, expiryDate: found.expiryDate, status: found.status, fullDomain: found.fullDomain } : { found: false, fullDomain };
  await prisma.whoisLookup.create({ data: { query: fullDomain || query, resultJson: result as object } });
  res.json(result);
});

router.get('/referrals', requireAuth, async (req: AuthRequest, res) => res.json(await prisma.referral.findMany({ where: { referrerId: req.user!.userId }, include: { referee: { select: publicUserSelect } } })));
