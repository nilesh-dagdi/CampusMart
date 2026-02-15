import prisma from '../db.js';

// Initiate a purchase
export const initiatePurchase = async (req, res) => {
    const { itemId } = req.body;
    const buyerId = req.user.id;

    try {
        // Check if item exists and is available
        const item = await prisma.item.findUnique({
            where: { id: itemId }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.status !== 'AVAILABLE') {
            return res.status(400).json({ message: 'Item is no longer available' });
        }

        if (item.sellerId === buyerId) {
            return res.status(400).json({ message: 'Cannot buy your own item' });
        }

        // Create purchase record
        const purchase = await prisma.purchase.create({
            data: {
                itemId,
                buyerId,
                sellerId: item.sellerId,
                status: 'PENDING'
            },
            include: {
                item: true,
                seller: {
                    select: {
                        name: true,
                        email: true,
                        mobile: true
                    }
                }
            }
        });

        // Optionally, update item status to PENDING so others can't buy it immediately
        await prisma.item.update({
            where: { id: itemId },
            data: { status: 'PENDING' }
        });

        res.status(201).json(purchase);
    } catch (err) {
        console.error('Initiate purchase error:', err);
        res.status(500).json({ message: 'Server error initiating purchase' });
    }
};

// Confirm/Complete purchase
export const confirmPurchase = async (req, res) => {
    const { purchaseId } = req.body;
    const buyerId = req.user.id;

    try {
        const purchase = await prisma.purchase.findUnique({
            where: { id: purchaseId }
        });

        if (!purchase) {
            return res.status(404).json({ message: 'Purchase not found' });
        }

        if (purchase.buyerId !== buyerId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (purchase.status !== 'PENDING') {
            return res.status(400).json({ message: 'Purchase already completed or cancelled' });
        }

        // Update purchase status
        const completedPurchase = await prisma.purchase.update({
            where: { id: purchaseId },
            data: { status: 'COMPLETED' },
            include: {
                item: true,
                seller: {
                    select: {
                        name: true,
                        email: true,
                        mobile: true
                    }
                }
            }
        });

        // Update item status
        await prisma.item.update({
            where: { id: purchase.itemId },
            data: { status: 'SOLD' }
        });

        res.json(completedPurchase);
    } catch (err) {
        console.error('Confirm purchase error:', err);
        res.status(500).json({ message: 'Server error confirming purchase' });
    }
};

// Get user purchases
export const getMyPurchases = async (req, res) => {
    const userId = req.user.id;

    try {
        const purchases = await prisma.purchase.findMany({
            where: { buyerId: userId },
            include: {
                item: true,
                seller: {
                    select: { name: true, email: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(purchases);
    } catch (err) {
        console.error('Get purchases error:', err);
        res.status(500).json({ message: 'Server error retrieving purchases' });
    }
};
