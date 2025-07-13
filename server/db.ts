import { drizzle } from "drizzle-orm/neon-http"; // Ensure this import is correct
import { Client } from "pg";

const connectionString =
  "postgresql://app_user:Oraib%40123@35.238.175.253:5432/shortshub";

const client = new Client({
  connectionString: connectionString,
});

async function connectDB() {
  await client.connect();
  return drizzle(client);
}

export const db = connectDB(); // Export the connected database instance
