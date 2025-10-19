import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

let prisma: PrismaClient;

const schema = randomUUID();

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

beforeAll(async () => {
  const databaseUrl = generateDatabaseUrl(schema);

  process.env.DATABASE_URL = databaseUrl;

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  prisma = new PrismaClient();
  await prisma.$connect();
});

afterAll(async () => {
  if (!prisma) return;

  // Remove schema do banco
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  await prisma.$disconnect();
});
