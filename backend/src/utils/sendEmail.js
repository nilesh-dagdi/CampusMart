import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
    // 1. Try Nodemailer (Best for Localhost/Any Email)
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

        console.log(`Email sent to ${to} via Nodemailer`);
        return true;
    } catch (nodemalerError) {
        console.warn('Nodemailer failed, trying Resend API...', nodemalerError.message);

        // 2. Fallback to Resend API (Best for Production/Cloud)
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: process.env.EMAIL_FROM || 'CampusMart <onboarding@resend.dev>',
                    to: [to],
                    subject: subject,
                    text: text
                })
            });

            if (response.ok) {
                console.log(`Email sent to ${to} via Resend`);
                return true;
            } else {
                const errorData = await response.json();
                console.error('Resend error:', errorData);
                return false;
            }
        } catch (resendError) {
            console.error('Both Email methods failed:', resendError.message);
            return false;
        }
    }
};
