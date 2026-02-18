import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function cleanup() {
    console.log('Connecting to database...');
    const client = new pg.Client({
        connectionString: process.env.DIRECT_URL
    });

    try {
        await client.connect();
        console.log('Connected to Supabase.');

        // Delete orphaned wishlist items
        const res = await client.query(`
            DELETE FROM "WishlistItem" 
            WHERE "itemId" NOT IN (SELECT "id" FROM "Item")
        `);

        console.log(`SUCCESS: Deleted ${res.rowCount} orphaned wishlist items.`);

        await client.end();
    } catch (err) {
        console.error('ERROR: Cleanup failed!');
        console.error(err);
        process.exit(1);
    }
}

cleanup();
