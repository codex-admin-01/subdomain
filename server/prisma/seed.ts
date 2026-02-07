import { PrismaClient, Role, UserStatus, DomainStatus, SubdomainStatus, TransactionType, TransactionStatus, InvoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.refreshToken.deleteMany();
  await prisma.ticketReply.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.abuseReport.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.subdomain.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.statusIncident.deleteMany();
  await prisma.appSetting.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@subhub.com',
      passwordHash: await bcrypt.hash('Admin123!', 10),
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      referralCode: 'ADMIN123'
    }
  });

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@subhub.com',
      passwordHash: await bcrypt.hash('User123!', 10),
      role: Role.USER,
      referralCode: 'JOHN123'
    }
  });

  const wallet = await prisma.wallet.create({ data: { userId: user.id, balance: 150 } });

  const domain = await prisma.domain.create({ data: { name: 'subhub.site', status: DomainStatus.ACTIVE, monthlyPrice: 2.99, premiumPrice: 9.99, premiumThreshold: 4 } });
  await prisma.subdomain.create({
    data: {
      name: 'myblog',
      fullDomain: 'myblog.subhub.site',
      ownerId: user.id,
      domainId: domain.id,
      target: '1.1.1.1',
      status: SubdomainStatus.ACTIVE,
      period: 12,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }
  });

  await prisma.transaction.create({ data: { walletId: wallet.id, amount: 150, type: TransactionType.DEPOSIT, status: TransactionStatus.COMPLETED, reference: 'seed-deposit' } });
  await prisma.invoice.create({ data: { userId: user.id, amount: 29.9, status: InvoiceStatus.PAID, period: '2026-01' } });
  await prisma.referral.create({ data: { referrerId: admin.id, refereeId: user.id, code: 'ADMIN123', rewards: 10 } });

  await prisma.supportTicket.create({ data: { userId: user.id, subject: 'Need DNS Help', message: 'How long for propagation?', status: 'OPEN', priority: 'MEDIUM' } });
  await prisma.appSetting.createMany({ data: [
    { key: 'websiteName', value: 'SubHub' },
    { key: 'referralCommission', value: '10' }
  ]});
  await prisma.statusIncident.create({ data: { title: 'All systems operational', message: 'No incidents', severity: 'LOW', status: 'RESOLVED', resolvedAt: new Date() } });

  console.log('Seed completed');
}

main().finally(() => prisma.$disconnect());
