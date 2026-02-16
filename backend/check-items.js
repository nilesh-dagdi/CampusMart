import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const counts = await prisma.item.groupBy({
        by: ['status'],
        _count: {
            id: true
        }
    });
    console.log('Item Counts by Status:', JSON.stringify(counts, null, 2));

    const allItems = await prisma.item.findMany({
        select: {
            title: true,
            status: true
        }
    });
    console.log('Detailed Items:', JSON.stringify(allItems, null, 2));

    await prisma.$disconnect();
}

check();
