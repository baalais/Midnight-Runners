import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

// Funkcija, lai izveidotu jaunu PrismaClient instance
const createPrismaClient = () =>
  new PrismaClient({
    log: 
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"], // Ievadīšanas opcijas, balstoties uz vidi
  });

// Definējot globālo mainīgo PrismaClient
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined; // Tipa definīcija globālajam prisma
};

// Inicializējot PrismaClient
export const db = globalForPrisma.prisma ?? createPrismaClient(); // Izmanto esošo klientu vai izveido jaunu

// Iestata globālo prisma klientu izstrādes režīmā
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db; 
