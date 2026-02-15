import prisma from '../db.js';
import bcrypt from 'bcryptjs';

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                year: true,
                mobile: true,
                createdAt: true
            }
        });
        res.json(user);
    } catch (err) {
        console.error('Get profile error:', err);
        res.status(500).json({ message: 'Server error retrieving profile' });
    }
};

// Update profile
export const updateProfile = async (req, res) => {
    const { name, year, mobile } = req.body;
    const userId = req.user.id;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                year,
                mobile
            },
            select: {
                id: true,
                name: true,
                email: true,
                year: true,
                mobile: true
            }
        });
        res.json(updatedUser);
    } catch (err) {
        console.error('Update profile error:', err);
        res.status(500).json({ message: 'Server error updating profile' });
    }
};

// Change password
export const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ message: 'Server error changing password' });
    }
};

// Delete profile and account data
export const deleteProfile = async (req, res) => {
    const userId = req.user.id;

    try {
        // 1. Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 2. Delete all related data manually (since cascade isn't in prisma)

        // Delete messages
        await prisma.message.deleteMany({
            where: {
                OR: [{ senderId: userId }, { receiverId: userId }]
            }
        });

        // Delete wishlist items
        await prisma.wishlistItem.deleteMany({
            where: { userId }
        });

        // Delete purchases
        await prisma.purchase.deleteMany({
            where: {
                OR: [{ buyerId: userId }, { sellerId: userId }]
            }
        });

        // Delete items and their images
        const items = await prisma.item.findMany({
            where: { sellerId: userId },
            select: { id: true }
        });
        const itemIds = items.map(i => i.id);

        // Delete item images
        await prisma.itemImage.deleteMany({
            where: { itemId: { in: itemIds } }
        });

        // Delete other people's wishlist entries for these items
        await prisma.wishlistItem.deleteMany({
            where: { itemId: { in: itemIds } }
        });

        // Delete messages related to these items (just in case they weren't caught by user ID)
        await prisma.message.deleteMany({
            where: { itemId: { in: itemIds } }
        });

        await prisma.item.deleteMany({
            where: { sellerId: userId }
        });

        // 3. Finally delete the user
        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({ message: 'Account and all associated data deleted successfully' });
    } catch (err) {
        console.error('Delete profile error:', err);
        res.status(500).json({ message: 'Server error deleting account' });
    }
};
