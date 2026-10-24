const { PrismaClient } = require('@prisma/client');

async function main() {
  const localUrl = process.env.DATABASE_URL;
  const cloudUrl = process.env.CLOUD_DATABASE_URL;

  if (!localUrl || !cloudUrl) {
    console.error('❌ Error: Both DATABASE_URL (local) and CLOUD_DATABASE_URL (cloud) must be set.');
    console.error('Example usage (PowerShell):');
    console.error('  $env:CLOUD_DATABASE_URL="postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require"; npm run migrate:cloud');
    process.exit(1);
  }

  const localPrisma = new PrismaClient({ datasources: { db: { url: localUrl } } });
  const cloudPrisma = new PrismaClient({ datasources: { db: { url: cloudUrl } } });

  try {
    console.log('🔄 Connecting to local and cloud databases...');
    await localPrisma.$connect();
    await cloudPrisma.$connect();

    const steps = [
      { name: 'Family', fetch: () => localPrisma.family.findMany(), insert: (data) => cloudPrisma.family.createMany({ data, skipDuplicates: true }) },
      { name: 'User', fetch: () => localPrisma.user.findMany(), insert: (data) => cloudPrisma.user.createMany({ data, skipDuplicates: true }) },
      { name: 'Member', fetch: () => localPrisma.member.findMany(), insert: (data) => cloudPrisma.member.createMany({ data, skipDuplicates: true }) },
      { name: 'Category', fetch: () => localPrisma.category.findMany(), insert: (data) => cloudPrisma.category.createMany({ data, skipDuplicates: true }) },
      { name: 'Budget', fetch: () => localPrisma.budget.findMany(), insert: (data) => cloudPrisma.budget.createMany({ data, skipDuplicates: true }) },
      { name: 'Expense', fetch: () => localPrisma.expense.findMany(), insert: (data) => cloudPrisma.expense.createMany({ data, skipDuplicates: true }) },
      { name: 'Settlement', fetch: () => localPrisma.settlement.findMany(), insert: (data) => cloudPrisma.settlement.createMany({ data, skipDuplicates: true }) },
      { name: 'MonthLock', fetch: () => localPrisma.monthLock.findMany(), insert: (data) => cloudPrisma.monthLock.createMany({ data, skipDuplicates: true }) },
      { name: 'AuditLog', fetch: () => localPrisma.auditLog.findMany(), insert: (data) => cloudPrisma.auditLog.createMany({ data, skipDuplicates: true }) },
      { name: 'Invitation', fetch: () => localPrisma.invitation.findMany(), insert: (data) => cloudPrisma.invitation.createMany({ data, skipDuplicates: true }) },
    ];

    for (const step of steps) {
      const rows = await step.fetch();
      if (rows.length > 0) {
        const res = await step.insert(rows);
        console.log(`✅ ${step.name}: Migrated ${res.count}/${rows.length} records`);
      } else {
        console.log(`⚪ ${step.name}: 0 records to migrate`);
      }
    }

    console.log('\n🎉 All local data successfully migrated to cloud database!');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    await localPrisma.$disconnect();
    await cloudPrisma.$disconnect();
  }
}

main();
