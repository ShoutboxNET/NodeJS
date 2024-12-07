# Shoutbox.net Developer API

Shoutbox.net is a Developer API designed to send transactional emails at scale. This documentation covers all integration methods, from direct API calls to framework integration.

## Integration Methods

There are three main ways to integrate with Shoutbox:

1. Direct API calls using fetch()
2. Using our Node.js client
3. Using SMTP
4. Next.js integration

## 1. Direct API Integration (Using fetch)

If you want to make direct API calls without any dependencies:

```javascript
const apiKey = 'your-api-key-here';

const emailData = {
    from: 'sender@example.com',
    to: 'recipient@example.com',
    subject: 'Test Email',
    html: '<h1>Hello!</h1><p>This is a test email.</p>',
    name: 'Sender Name',
    replyTo: 'reply@example.com'
};

async function sendEmail() {
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
            console.log('Email sent successfully!');
        } else {
            console.error('Failed to send email:', await response.text());
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

sendEmail();
```

## 2. Node.js Client Usage

### Installation

```bash
npm install shoutboxnet
```

### Basic Usage

```typescript
import Shoutbox from "shoutboxnet";

const client = new Shoutbox('your-api-key');

async function sendEmail() {
    await client.sendEmail({
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'Test Email',
        html: '<h1>Hello!</h1><p>This is a test email.</p>',
        name: 'Sender Name',
        replyTo: 'reply@example.com'
    });
}

sendEmail();
```

## 3. SMTP Integration

For SMTP integration, use our SMTPClient:

```typescript
import { SMTPClient } from "shoutboxnet";

const smtp = new SMTPClient('your-api-key');

async function sendEmailViaSMTP() {
    // Verify connection first
    const isConnected = await smtp.verifyConnection();
    if (!isConnected) {
        console.error('Failed to connect to SMTP server');
        return;
    }

    // Send email
    await smtp.sendEmail({
        from: 'sender@example.com',
        to: 'recipient@example.com',
        subject: 'SMTP Test',
        html: '<h1>Hello!</h1><p>This is a test email via SMTP.</p>',
        name: 'Sender Name',
        replyTo: 'reply@example.com'
    });
}

sendEmailViaSMTP();
```

## 4. Next.js Integration

### Installation

```bash
npm install shoutboxnet
```

### Setup

1. Create an API route in `pages/api/send-email.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import Shoutbox from 'shoutboxnet';

// Initialize client outside handler to reuse connection
const client = new Shoutbox(process.env.SHOUTBOX_API_KEY!);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { from, to, subject, html } = req.body;

        await client.sendEmail({
            from,
            to,
            subject,
            html
        });

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
}
```

2. Add your API key to `.env.local`:

```bash
SHOUTBOX_API_KEY=your-api-key-here
```

3. Use in your components:

```typescript
'use client';

import { useState } from 'react';

export default function ContactForm() {
    const [status, setStatus] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus('Sending...');

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'your-app@example.com',
                    to: 'recipient@example.com',
                    subject: 'New Contact Form Submission',
                    html: '<h1>New Contact</h1><p>You have a new contact form submission.</p>'
                }),
            });

            if (res.ok) {
                setStatus('Email sent successfully!');
            } else {
                setStatus('Failed to send email');
            }
        } catch (error) {
            setStatus('Error sending email');
            console.error('Error:', error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <button type="submit">Send Email</button>
            {status && <p>{status}</p>}
        </form>
    );
}
```

### Server Actions (Next.js 14+)

If you're using Server Actions in Next.js 14 or later, you can send emails directly from your server components:

```typescript
// app/actions.ts
'use server';

import Shoutbox from 'shoutboxnet';

const client = new Shoutbox(process.env.SHOUTBOX_API_KEY!);

export async function sendEmail(formData: FormData) {
    try {
        await client.sendEmail({
            from: 'your-app@example.com',
            to: formData.get('email') as string,
            subject: 'New Contact Form Submission',
            html: '<h1>New Contact</h1><p>You have a new contact form submission.</p>'
        });
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

// app/page.tsx
import { sendEmail } from './actions';

export default function ContactPage() {
    return (
        <form action={sendEmail}>
            <input type="email" name="email" required />
            <button type="submit">Send Email</button>
        </form>
    );
}
```

## Environment Variables

Required environment variables:

```bash
SHOUTBOX_API_KEY=your-api-key-here
```

## Development

For development and testing, see our [development guide](docs/development.md).

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
