export const sendEmail = async (to, subject, text) => {
    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'CampusMart <onboarding@resend.dev>',
                to: [to],
                subject: subject,
                text: text
            })
        });

        if (response.ok) {
            console.log(`Email sent to ${to} via Resend`);
            return true;
        } else {
            const error = await response.json();
            console.error('Resend error:', error);
            return false;
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
