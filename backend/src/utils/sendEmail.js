import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
    // 1. Try Local Nodemailer First (Works on localhost)
    if (process.env.NODE_ENV === 'development') {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to,
                subject,
                text
            });
            console.log(`Email sent to ${to} via Local Nodemailer`);
            return true;
        } catch (err) {
            console.warn('Local Nodemailer failed:', err.message);
        }
    }

    // 2. Try Supabase Edge Function (Works on Render/Production)
    // This acts as a proxy to bypass Render's SMTP blocks
    try {
        const SUPABASE_URL = process.env.SUPABASE_URL; // e.g., https://xyz.supabase.co
        const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            throw new Error('Supabase credentials missing in .env');
        }

        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ to, subject, text })
        });

        const result = await response.json();
        if (response.ok && result.success) {
            console.log(`Email sent to ${to} via Supabase Proxy`);
            return true;
        } else {
            console.error('Supabase Email Error:', result.error || result || 'Unknown error');
            return false;
        }
    } catch (error) {
        console.error('All email methods failed:', error.message);
        return false;
    }
};
