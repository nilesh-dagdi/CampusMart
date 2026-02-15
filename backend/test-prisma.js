import prisma from './src/db.js';

async function main() {
    console.log('Testing Prisma Connection...');

    try {
        // 1. Check User count
        const userCount = await prisma.user.count();
        console.log(`User count: ${userCount}`);

        // 2. Check Item count
        const itemCount = await prisma.item.count();
        console.log(`Item count: ${itemCount}`);

        console.log('Successfully connected to the database via Prisma!');
    } catch (e) {
        console.error('Error connecting to database:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
