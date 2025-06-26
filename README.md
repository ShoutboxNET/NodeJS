![Header](https://github-production-user-asset-6210df.s3.amazonaws.com/623448/459285874-52d6ff91-3425-4e31-bff3-426bbb6eb113.png)

<p align="center">
  <a href="https://docs.shoutbox.net/quickstart" style="font-size: 2em; text-decoration: underline; color: #0366d6;">Quickstart Docs</a>
</p>

<p align="center" style="font-size: 1.5em;">
  <b>Language & Framework guides</b>
</p>

<p align="center">
  <a href="https://docs.shoutbox.net/examples/nextjs-lib">Next.js</a> -
  <a href="https://docs.shoutbox.net/examples/typescript">Typescript</a> -
  <a href="https://docs.shoutbox.net/examples/javascript-lib">Javascript</a> -
  <a href="https://docs.shoutbox.net/examples/python-lib">Python</a> -
  <a href="https://docs.shoutbox.net/examples/php-lib">PHP</a> -
  <a href="https://docs.shoutbox.net/examples/php-laravel-lib">Laravel</a> -
  <a href="https://docs.shoutbox.net/examples/go">Go</a>
</p>

# Shoutbox.net Developer API

Shoutbox.net is a Developer API designed to send transactional emails at scale. This documentation covers all integration methods, from direct API calls to framework integration.

## Setup

For these integrations to work, you will need an <a href="https://hub.shoutbox.net" target="_blank">account</a> on <a href="https://shoutbox.net" target="_blank">Shoutbox.net</a>. You can create and copy the required API key on the <a href="https://hub.shoutbox.net/app/dashboard" target="_blank">Shoutbox.net dashboard</a>!

The API key is required for any call to the <a href="https://shoutbox.net" target="_blank">Shoutbox.net</a> backend; for SMTP, the API key is your password and 'shoutbox' the user to send emails.

## Integration Methods

There are four main ways to integrate with Shoutbox:

1. Direct API calls using fetch()
2. Using our Node.js client
3. Using SMTP
4. Next.js integration
5. React Email Components

## 1. Direct API Integration (Using fetch)

If you want to make direct API calls without any dependencies:

```javascript
const apiKey = "your-api-key-here";

const emailData = {
  from: "sender@example.com",
  to: "recipient@example.com",
  subject: "Test Email",
  html: "<h1>Hello!</h1><p>This is a test email.</p>",
  name: "Sender Name",
  replyTo: "reply@example.com",
};

async function sendEmail() {
  try {
    const response = await fetch("https://api.shoutbox.net/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      console.log("Email sent successfully!");
    } else {
      console.error("Failed to send email:", await response.text());
    }
  } catch (error) {
    console.error("Error sending email:", error);
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

const client = new Shoutbox("your-api-key");

async function sendEmail() {
  await client.sendEmail({
    from: "sender@example.com",
    to: "recipient@example.com",
    subject: "Test Email",
    html: "<h1>Hello!</h1><p>This is a test email.</p>",
    name: "Sender Name",
    replyTo: "reply@example.com",
  });
}

sendEmail();
```

## 3. SMTP Integration

For SMTP integration, use our SMTPClient:

```typescript
import { SMTPClient } from "shoutboxnet";

const smtp = new SMTPClient("your-api-key");

async function sendEmailViaSMTP() {
  // Verify connection first
  const isConnected = await smtp.verifyConnection();
  if (!isConnected) {
    console.error("Failed to connect to SMTP server");
    return;
  }

  // Send email
  await smtp.sendEmail({
    from: "sender@example.com",
    to: "recipient@example.com",
    subject: "SMTP Test",
    html: "<h1>Hello!</h1><p>This is a test email via SMTP.</p>",
    name: "Sender Name",
    replyTo: "reply@example.com",
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
import type { NextApiRequest, NextApiResponse } from "next";
import Shoutbox from "shoutboxnet";

// Initialize client outside handler to reuse connection
const client = new Shoutbox(process.env.SHOUTBOX_API_KEY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { from, to, subject, html } = req.body;

    await client.sendEmail({
      from,
      to,
      subject,
      html,
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
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

## 5. React Email Components

Shoutbox supports sending emails using React components through integration with @react-email. This allows you to create dynamic, reusable email templates using React's component-based architecture.

### Installation

```bash
npm install shoutboxnet @react-email/components
```

### Basic Usage

```tsx
import React from "react";
import Shoutbox from "shoutboxnet";
import { Html } from "@react-email/html";
import { Button } from "@react-email/button";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";

interface WelcomeEmailProps {
  url: string;
  name: string;
}

function WelcomeEmail({ url, name }: WelcomeEmailProps) {
  return (
    <Html>
      <Section style={{ backgroundColor: "#ffffff" }}>
        <Container>
          <Text>Hello {name}!</Text>
          <Text>Welcome to our platform. Please verify your email:</Text>
          <Button href={url}>Verify Email</Button>
        </Container>
      </Section>
    </Html>
  );
}

const client = new Shoutbox("your-api-key");

await client.sendEmail({
  from: "welcome@example.com",
  to: "user@example.com",
  subject: "Welcome to Our Platform",
  react: <WelcomeEmail url="https://example.com/verify" name="John" />,
});
```

### Available Components

Shoutbox supports all @react-email components including:

- `<Html>`: Root component for email templates
- `<Button>`: Styled button component
- `<Text>`: Text component with email-safe styling
- `<Section>`: Section container for layout
- `<Container>`: Centered container with max-width
- And many more from the @react-email library

### Dynamic Content

React components can include dynamic content through props, conditional rendering, and loops:

```tsx
interface EmailProps {
  user: {
    name: string;
    items: string[];
  };
}

function OrderConfirmation({ user }: EmailProps) {
  return (
    <Html>
      <Section>
        <Text>Thank you for your order, {user.name}!</Text>
        {user.items.map((item, index) => (
          <Text key={index}>- {item}</Text>
        ))}
      </Section>
    </Html>
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
