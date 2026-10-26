import { randomBytes } from 'node:crypto';
import bcrypt from 'bcrypt';
import { prisma } from '../src/config/db.js';

try {
  const passwordHash = await bcrypt.hash(randomBytes(32).toString('hex'), 10);

  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: 'task-demo@example.com',
      name: 'Task Demo',
      passwordHash,
    },
  });

  await prisma.$queryRaw`
    SELECT setval(
      pg_get_serial_sequence('"User"', 'id'),
      GREATEST((SELECT COALESCE(MAX(id), 1) FROM "User"), 1),
      true
    )
  `;
} finally {
  await prisma.$disconnect();
}
