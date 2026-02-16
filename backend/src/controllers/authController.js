import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { sendEmail } from '../utils/sendEmail.js';



export const signup = async (req, res) => {
    const { email, name, password, year, mobile, otp } = req.body;

    try {
        // 0. Verify OTP
        const otpRecord = await prisma.oTP.findFirst({
            where: { email }
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP not found. Please request a new one.' });
        }

        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > otpRecord.expiresAt) {
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        // 1. Validate inputs
        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: 'Name must be at least 3 characters long' });
        }

        const mobileRegex = /^[0-9]{10}$/;
        if (!mobile || !mobileRegex.test(mobile)) {
            return res.status(400).json({ message: 'Mobile number must be exactly 10 digits' });
        }

        const isDev = process.env.NODE_ENV === 'development';

        if (!email || (!email.endsWith('@rtu.ac.in') && !isDev)) {
            return res.status(400).json({ message: 'Only @rtu.ac.in emails are allowed' });
        }

        // 2. Check if user exists
        const userCheck = await prisma.user.findUnique({
            where: { email }
        });

        if (userCheck) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create user
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                year,
                mobile
            }
        });

        // 5. Generate JWT
        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 6. Delete OTP after successful signup
        await prisma.oTP.deleteMany({
            where: { email }
        });

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                year: newUser.year,
                mobile: newUser.mobile
            }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during signup' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Generate JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                year: user.year,
                mobile: user.mobile
            }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // 1. Check if user exists
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 3. Clear old OTPs and Save new one
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

        // 4. Send Email
        const sent = await sendEmail(
            email,
            'Reset Your Password - CampusMart',
            `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`
        );

        if (!sent) {
            return res.status(500).json({ message: 'Failed to send OTP email. Please try again later.' });
        }

        res.json({ message: 'OTP sent to your email' });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // 1. Verify OTP
        const otpRecord = await prisma.oTP.findFirst({
            where: { email }
        });

        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (new Date() > otpRecord.expiresAt) {
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        // 2. Validate password
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // 3. Update User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword }
        });

        // 4. Delete OTP
        await prisma.oTP.deleteMany({
            where: { email }
        });

        res.json({ message: 'Password reset successful. You can now login with your new password.' });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
