// [1] baca konfigurasi dari env
import "dotenv/config"

// [2] import client dan adapter postgreSQL
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// [3] Hubungkan adapter ke alamat database
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,

});

export const prisma = new PrismaClient({adapter});