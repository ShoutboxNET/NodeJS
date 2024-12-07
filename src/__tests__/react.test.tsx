import * as React from "react";
import Shoutbox from "../index.js";
import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { render } from "@react-email/render";
import { config } from "dotenv";
import { jest } from "@jest/globals";
import { describe, test, expect, beforeAll } from "@jest/globals";

config(); // Load environment variables

jest.setTimeout(30000); // Increase timeout for API calls

describe("React Email Integration", () => {
  let client: Shoutbox;
  let apiKey: string;
  let from: string;
  let to: string;
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    // Store original env
    originalEnv = { ...process.env };

    const envApiKey = process.env.SHOUTBOX_API_KEY;
    const envFrom = process.env.SHOUTBOX_FROM;
    const envTo = process.env.SHOUTBOX_TO;

    if (!envApiKey || !envFrom || !envTo) {
      throw new Error("Required environment variables not set");
    }

    apiKey = envApiKey;
    from = envFrom;
    to = envTo;
    client = new Shoutbox(apiKey);
  });

  afterEach(() => {
    // Restore original env after each test
    process.env = { ...originalEnv };
  });

  it("should send email with React component", async () => {
    const TestEmail = () => (
      <Html>
        <h1>Test Test Test</h1>
        <Text>Hello from React Email!</Text>
      </Html>
    );

    await client.sendEmail({
      from,
      to,
      subject: "Test React Email",
      react: <TestEmail />,
    });
    expect(true).toBe(true);
  });

  it("should render React component to HTML", async () => {
    const TestEmail = () => (
      <Html>
        <h1>Test Test Test</h1>
        <Text>Hello from React Email!</Text>
      </Html>
    );

    const html = await render(<TestEmail />);
    expect(html).toContain("Hello from React Email!");
  });

  it("should send email with dynamic React component", async () => {
    interface WelcomeEmailProps {
      name: string;
    }

    const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
      <Html>
        <h1>Test Test Test</h1>
        <Text>Hello {name}!</Text>
      </Html>
    );

    await client.sendEmail({
      from,
      to,
      subject: "Welcome Email",
      react: <WelcomeEmail name="John" />,
    });
    expect(true).toBe(true);
  });

  it("should handle React component with nested elements", async () => {
    const ComplexEmail = () => (
      <Html>
        <div style={{ fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ color: "#333" }}>Welcome!</h1>
          <Text>This is a complex email with nested elements.</Text>
          <div style={{ marginTop: "20px" }}>
            <Text>Have a great day!</Text>
          </div>
        </div>
      </Html>
    );

    await client.sendEmail({
      from,
      to,
      subject: "Complex React Email",
      react: <ComplexEmail />,
    });
    expect(true).toBe(true);
  });

  it("should handle React component with conditional rendering", async () => {
    interface ConditionalEmailProps {
      showExtra?: boolean;
    }

    const ConditionalEmail: React.FC<ConditionalEmailProps> = ({
      showExtra,
    }) => (
      <Html>
        <Text>Base content</Text>
        {showExtra && <Text>Extra content</Text>}
      </Html>
    );

    // Test with extra content
    await client.sendEmail({
      from,
      to,
      subject: "Conditional Email (with extra)",
      react: <ConditionalEmail showExtra={true} />,
    });

    // Test without extra content
    await client.sendEmail({
      from,
      to,
      subject: "Conditional Email (without extra)",
      react: <ConditionalEmail />,
    });

    expect(true).toBe(true);
  });
});
