import bcrypt from 'bcrypt';
import { prisma } from '../src/lib/prisma.js';

async function main() {
  const email = 'hieu@superteam.vn';
  const existing = await prisma.user.findUnique({ where: { email } });
  const user = existing
    ? existing
    : await prisma.user.create({
        data: {
          email,
          name: 'Hieu',
          passwordHash: await bcrypt.hash('password', 12)
        }
      });

  const ws = await prisma.workspace.create({
    data: {
      name: 'Superteam VN 2025',
      startDate: new Date('2025-01-01T00:00:00Z'),
      endDate: new Date('2025-12-31T23:59:59Z'),
      currency: 'USD',
      members: { create: { userId: user.id, role: 'owner' } },
      cycles: {
        create: {
          name: 'Annual 2025',
          startDate: new Date('2025-01-01T00:00:00Z'),
          endDate: new Date('2025-12-31T23:59:59Z'),
          isActive: true
        }
      }
    },
    include: { cycles: true }
  });

  console.log('Seeded user + workspace', { userId: user.id, workspaceId: ws.id, cycleId: ws.cycles[0]?.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
