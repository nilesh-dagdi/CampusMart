import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const schema = `
-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY,
    "email" TEXT UNIQUE NOT NULL,
    "name" TEXT,
    "year" TEXT,
    "mobile" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Item table
CREATE TABLE IF NOT EXISTS "Item" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "image" TEXT,
    "sellerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create WishlistItem table
CREATE TABLE IF NOT EXISTS "WishlistItem" (
    "id" TEXT PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "itemId" TEXT NOT NULL REFERENCES "Item"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE ("userId", "itemId")
);
`;

async function migrate() {
    console.log('Running manual SQL migration on Supabase...');
    const client = new pg.Client({
        connectionString: process.env.DIRECT_URL
    });

    try {
        await client.connect();
        console.log('Connected to database.');

        await client.query(schema);
        console.log('SUCCESS: Tables created successfully!');

        await client.end();
    } catch (err) {
        console.error('ERROR: Migration failed!');
        console.error(err);
        process.exit(1);
    }
}

migrate();
