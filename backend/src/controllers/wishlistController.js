import prisma from '../db.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        // Optional: Clean up orphaned wishlist items once to fix existing data
        // This is safe because we already added Cascade Delete for future items
        await prisma.wishlistItem.deleteMany({
            where: {
                item: null
            }
        });

        // Fetch wishlist items with related item details
        const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId },
            include: {
                item: true
            }
        });

        // Map to return just the item details as expected by frontend, filtering out any missing items
        const items = wishlistItems
            .filter(w => w.item !== null)
            .map(w => w.item);

        res.json(items);
    } catch (err) {
        console.error('Get wishlist error:', err);
        res.status(500).json({ message: 'Server error retrieving wishlist' });
    }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;

    try {
        // Check if item exists
        const item = await prisma.item.findUnique({
            where: { id: itemId }
        });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Add to wishlist
        await prisma.wishlistItem.create({
            data: {
                userId,
                itemId
            }
        });

        res.status(201).json({ message: 'Added to wishlist' });
    } catch (err) {
        // Handle unique constraint violation (already in wishlist)
        if (err.code === 'P2002') {
            return res.status(400).json({ message: 'Item already in wishlist' });
        }
        console.error('Add to wishlist error:', err);
        res.status(500).json({ message: 'Server error adding to wishlist' });
    }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user.id;

    try {
        // The composite primary key for WishlistItem isn't explicitly defined in standard way usually in Prisma for delete
        // But we defined @@unique([userId, itemId]) in schema so we can use delete with composite key syntax if Prisma supports enabled or deleteMany

        // Using deleteMany to be safe with composite unique constraints or delete with where compound unique
        const result = await prisma.wishlistItem.deleteMany({
            where: {
                userId,
                itemId
            }
        });

        if (result.count === 0) {
            return res.status(404).json({ message: 'Item not in wishlist' });
        }

        res.json({ message: 'Removed from wishlist' });
    } catch (err) {
        console.error('Remove from wishlist error:', err);
        res.status(500).json({ message: 'Server error removing from wishlist' });
    }
};
