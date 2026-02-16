import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetItems() {
    try {
        const result = await prisma.item.updateMany({
            data: { status: 'AVAILABLE' }
        });
        console.log(`Successfully reset ${result.count} items to AVAILABLE.`);

        // Also clear pending purchases to keep data consistent
        const purchases = await prisma.purchase.deleteMany({
            where: { status: 'PENDING' }
        });
        console.log(`Deleted ${purchases.count} pending purchase records.`);

    } catch (error) {
        console.error('Reset error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetItems();
