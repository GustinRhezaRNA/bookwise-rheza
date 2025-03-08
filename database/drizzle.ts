import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import config from "@/lib/config";

// 🔥 Optimasi agar koneksi lebih cepat
neonConfig.fetchConnectionCache = true; 

const sql = neon(config.env.databaseUrl);
export const db = drizzle(sql); // ✅ FIXED
