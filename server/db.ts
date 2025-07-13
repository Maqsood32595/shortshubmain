import { drizzle } from "drizzle-orm/node-postgres"; // Corrected: Use 'drizzle-orm/node-postgres'
import { Client } from "pg"; // Standard PostgreSQL client
import * as schema from "@shared/schema"; // Your Drizzle schema definitions

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "No database connection string provided. Please set DATABASE_URL in your Replit secrets.",
  );
  process.exit(1); // Exit if the connection string is not available
}

const client = new Client({
  connectionString: connectionString,
});

// A variable to hold the Drizzle DB instance once it's successfully initialized
let cachedDbInstance: ReturnType<typeof drizzle> | null = null;

/**
 * Connects the PostgreSQL client and initializes Drizzle ORM.
 * This function ensures the connection is established only once.
 * @returns The Drizzle ORM instance.
 */
export async function getDb() {
  if (cachedDbInstance) {
    return cachedDbInstance; // Return the cached instance if already connected
  }

  try {
    await client.connect(); // Establish the connection to PostgreSQL
    console.log("Successfully connected to Google Cloud PostgreSQL.");
    cachedDbInstance = drizzle(client, { schema }); // Initialize Drizzle with the connected client
    return cachedDbInstance;
  } catch (error) {
    console.error(
      "Error connecting to the database or initializing Drizzle:",
      error,
    );
    process.exit(1); // Critical error, exit the process
  }
}

// You should call `await getDb();` once at the very beginning of your application's startup
// (e.g., in your main `server.ts` or `index.ts` file) before starting your Express server
// or doing any database operations.
