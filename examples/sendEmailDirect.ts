import { config } from 'dotenv';

config(); // Load environment variables

const apiKey = process.env.SHOUTBOX_API_KEY;
const from = process.env.SHOUTBOX_FROM;
const to = process.env.SHOUTBOX_TO;

if (!apiKey || !from || !to) {
    console.error('Required environment variables not set');
    process.exit(1);
}

async function sendEmailDirect() {
    const emailData = {
        from,
        to,
        subject: 'Test Direct API Email',
        html: '<h1>Hello!</h1><p>This is a test email sent directly using fetch().</p>',
        name: 'Direct API Test',
        replyTo: from
    };

    try {
        const response = await fetch('https://api.shoutbox.net/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Email sent successfully:', result);
        } else {
            console.error('Failed to send email:', await response.text());
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Send a test email
sendEmailDirect();
