import prisma from '../db.js';
import crypto from 'crypto';

import { sendEmail } from '../utils/sendEmail.js';

export const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email || !email.endsWith('@rtu.ac.in')) {
        return res.status(400).json({ message: 'Valid @rtu.ac.in email required' });
    }

    // Check if user already exists
    const userCheck = await prisma.user.findUnique({
        where: { email }
    });

    if (userCheck) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Check for recent OTP to prevent spam
    const existingOtp = await prisma.oTP.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' }
    });

    if (existingOtp) {
        const timeDiff = (new Date() - new Date(existingOtp.createdAt)) / 1000;
        if (timeDiff < 60) { // 60 seconds cooldown
            return res.status(400).json({ message: `Please wait ${Math.ceil(60 - timeDiff)} seconds before requesting a new OTP.` });
        }
    }

    try {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store in DB (upsert mechanism or delete old then create new)
        // Since we don't have unique constraint on email in OTP table (maybe we should?), we can just create
        // But better to clean up old ones.

        // Delete existing OTPs for this email
        await prisma.oTP.deleteMany({
            where: { email }
        });

        await prisma.oTP.create({
            data: {
                email,
                otp,
                expiresAt
            }
        });

        const sent = await sendEmail(email, 'Your OTP for Sign Up', `Your OTP is: ${otp}. It expires in 10 minutes.`);

        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP email' });
        }

        res.json({ message: 'OTP sent successfully' });
    } catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).json({ message: 'Server error sending OTP' });
    }
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const record = await prisma.oTP.findFirst({
            where: {
                email,
                otp
            }
        });

        if (!record) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > record.expiresAt) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // OTP is valid. 
        // We do NOT delete it here, because signup process might need to verify it again.
        // Or we can issue a temporary token. For now, we trust the client will call valid signup next.

        // If you want to use verifyOtp as a standalone step that guarantees the next step, 
        // you'd typically verify here and issue a signed "email_verified_token".
        // But since we are verifying in signup() as well, we just return success here.

        // await prisma.oTP.delete({
        //     where: { id: record.id }
        // });

        res.json({ message: 'OTP verified successfully' });
    } catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({ message: 'Server error verifying OTP' });
    }
};
