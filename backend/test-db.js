import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    console.log('Testing connection to Supabase via Session Pooler...');
    const client = new pg.Client({
        connectionString: process.env.DIRECT_URL
    });

    try {
        await client.connect();
        console.log('SUCCESS: Connected to Supabase via Pooler!');
        const res = await client.query('SELECT NOW()');
        console.log('Database time:', res.rows[0].now);
        await client.end();
    } catch (err) {
        console.error('ERROR: Failed to connect to Supabase!');
        console.error(err);
        process.exit(1);
    }
}

testConnection();
