import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  prismaUrl: string | undefined
}

const defaultDatabasePath = resolve(process.cwd(), 'db/custom.db')
const databaseUrl = process.env.DATABASE_URL ?? `file:${defaultDatabasePath}`

if (!process.env.DATABASE_URL) {
  mkdirSync(resolve(process.cwd(), 'db'), { recursive: true })
}

export const db =
  globalForPrisma.prismaUrl === databaseUrl && globalForPrisma.prisma
    ? globalForPrisma.prisma
    : new PrismaClient({
        datasourceUrl: databaseUrl,
        log: ['query'],
      })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
  globalForPrisma.prismaUrl = databaseUrl
}
