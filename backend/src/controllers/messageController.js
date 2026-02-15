import prisma from '../db.js';

// Send a message
export const sendMessage = async (req, res) => {
    const { receiverId, itemId, content } = req.body;
    const senderId = req.user.id;

    try {
        const message = await prisma.message.create({
            data: {
                senderId,
                receiverId,
                itemId,
                content
            }
        });

        res.status(201).json(message);
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({ message: 'Server error sending message' });
    }
};

// Get conversations (grouped by item and other user)
// This is complex in Prisma without raw query or careful grouping.
// For MVP, let's just get all messages for a user and let frontend group them if needed.
// Or get messages for specific item/user.

export const getMyMessages = async (req, res) => {
    const userId = req.user.id;

    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId }
                ]
            },
            include: {
                sender: { select: { name: true, email: true } },
                receiver: { select: { name: true, email: true } },
                item: { select: { title: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(messages);
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ message: 'Server error retrieving messages' });
    }
};

export const getMessagesForConversation = async (req, res) => {
    const userId = req.user.id;
    const { otherUserId, itemId } = req.params;

    try {
        const messages = await prisma.message.findMany({
            where: {
                itemId,
                OR: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json(messages);
    } catch (err) {
        console.error('Get conversation error:', err);
        res.status(500).json({ message: 'Server error retrieving conversation' });
    }
};
