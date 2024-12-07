import React from 'react';
import Shoutbox from '../src';
import { Html } from '@react-email/html';
import { Button } from '@react-email/button';
import { Text } from '@react-email/text';
import { Section } from '@react-email/section';
import { Container } from '@react-email/container';

interface WelcomeEmailProps {
    url: string;
    name: string;
}

function WelcomeEmail({ url, name }: WelcomeEmailProps) {
    return (
        <Html>
            <Section style={{ backgroundColor: '#ffffff' }}>
                <Container>
                    <Text>Hello {name}!</Text>
                    <Text>Welcome to our platform. Please verify your email:</Text>
                    <Button href={url}>Verify Email</Button>
                </Container>
            </Section>
        </Html>
    );
}

const apiKey = process.env.SHOUTBOX_API_KEY || 'your-api-key-here';
const client = new Shoutbox(apiKey);

(async () => {
    try {
        await client.sendEmail({
            from: "welcome@example.com",
            to: "user@example.com",
            subject: "Welcome to Our Platform",
            react: <WelcomeEmail url="https://example.com/verify" name="John" />
        });

        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Failed to send email:', error);
    }
})();
