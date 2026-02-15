import prisma from '../db.js';

export const getItems = async (req, res) => {
    try {
        const { category, search, sellerId } = req.query;

        const where = {};

        if (category) {
            where.category = category;
        }
        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive'
            };
        }
        if (sellerId) {
            where.sellerId = sellerId;
        } else {
            // Only show available items in general feed
            where.status = 'AVAILABLE';
        }

        const items = await prisma.item.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(items);
    } catch (err) {
        console.error('Get items error:', err);
        res.status(500).json({ message: 'Server error retrieving items' });
    }
};

export const getItemById = async (req, res) => {
    try {
        const item = await prisma.item.findUnique({
            where: { id: req.params.id }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error('Get item error:', err);
        res.status(500).json({ message: 'Server error retrieving item' });
    }
};

export const createItem = async (req, res) => {
    const { title, description, price, category, condition, image } = req.body;
    const sellerId = req.user.id;

    try {
        const newItem = await prisma.item.create({
            data: {
                title,
                description,
                price: parseFloat(price),
                category,
                condition,
                image,
                sellerId
            }
        });
        res.status(201).json(newItem);
    } catch (err) {
        console.error('Create item error:', err);
        res.status(500).json({ message: 'Server error creating item' });
    }
};

export const updateItem = async (req, res) => {
    const { title, description, price, category, condition, image } = req.body;
    const itemId = req.params.id;
    const sellerId = req.user.id;

    try {
        // Check ownership
        const item = await prisma.item.findUnique({
            where: { id: itemId }
        });

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.sellerId !== sellerId) return res.status(403).json({ message: 'Unauthorized' });

        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: {
                title,
                description,
                price: parseFloat(price),
                category,
                condition,
                image
            }
        });
        res.json(updatedItem);
    } catch (err) {
        console.error('Update item error:', err);
        res.status(500).json({ message: 'Server error updating item' });
    }
};

export const deleteItem = async (req, res) => {
    const itemId = req.params.id;
    const sellerId = req.user.id;

    try {
        // Check ownership
        const item = await prisma.item.findUnique({
            where: { id: itemId }
        });

        if (!item) return res.status(404).json({ message: 'Item not found' });
        if (item.sellerId !== sellerId) return res.status(403).json({ message: 'Unauthorized' });

        await prisma.item.delete({
            where: { id: itemId }
        });
        res.json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error('Delete item error:', err);
        res.status(500).json({ message: 'Server error deleting item' });
    }
};
