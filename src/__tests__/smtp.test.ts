import { SMTPClient } from "../smtp";
import { config } from "dotenv";
import path from "path";
import { jest } from "@jest/globals"; 
import { describe, test, expect, beforeAll } from "@jest/globals"; 
import { fileURLToPath } from "url";
import { dirname } from "path";

// Set up globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config(); // Load environment variables

jest.setTimeout(30000); // Increase timeout for API calls

describe("SMTPClient", () => {
  let client: SMTPClient;
  let apiKey: string;
  let from: string;
  let to: string;

  beforeAll(() => {
    const envApiKey = process.env.SHOUTBOX_API_KEY;
    const envFrom = process.env.SHOUTBOX_FROM;
    const envTo = process.env.SHOUTBOX_TO;

    if (!envApiKey || !envFrom || !envTo) {
      throw new Error("Required environment variables not set");
    }

    apiKey = envApiKey;
    from = envFrom;
    to = envTo;
    client = new SMTPClient(apiKey);
  });

  it("should verify SMTP connection", async () => {
    const isConnected = await client.verifyConnection();
    expect(isConnected).toBe(true);
  });

  it("should send a basic email", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test SMTP Email",
      html: "<h1>Test</h1><p>This is a test email from the Shoutbox SMTP client.</p>",
    });
    expect(true).toBe(true);
  });

  it("should send email with name and reply-to", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test SMTP Email with Name",
      html: "<h1>Test</h1><p>This is a test email with sender name and reply-to.</p>",
      name: "Test Sender",
      replyTo: from,
    });
    expect(true).toBe(true);
  });

  it("should send email with custom headers", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test SMTP Email with Headers",
      html: "<h1>Test</h1><p>This is a test email with custom headers.</p>",
      headers: {
        "X-Test-Header": "test-value",
      },
    });
    expect(true).toBe(true);
  });

  it("should send email with attachments", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test SMTP Email with Attachments",
      html: "<h1>Test</h1><p>This is a test email with attachments.</p>",
      attachments: [
        {
          filepath: path.join(__dirname, "../../examples/important.txt"),
          filename: "test.txt",
          contentType: "text/plain",
        },
      ],
    });
    expect(true).toBe(true);
  });

  it("should send email with CC", async () => {
    await client.sendEmail({
      from,
      to,
      cc: from, // Use from address as CC for testing
      subject: "Test SMTP Email with CC",
      html: "<h1>Test</h1><p>This is a test email with CC.</p>",
    });
    expect(true).toBe(true);
  });

  it("should send multiple emails", async () => {
    const emails = [
      {
        from,
        to,
        subject: "Test SMTP Email 1",
        html: "<h1>Test 1</h1><p>This is test email 1.</p>",
      },
      {
        from,
        to,
        subject: "Test SMTP Email 2",
        html: "<h1>Test 2</h1><p>This is test email 2.</p>",
      },
    ];

    await client.sendEmails(emails);
    expect(true).toBe(true);
  });

  it("should handle text content", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test SMTP Email with Text",
      text: "This is a plain text email.",
    });
    expect(true).toBe(true);
  });

  it("should handle both HTML and text content", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test SMTP Email with HTML and Text",
      html: "<h1>Test</h1><p>This is an HTML email.</p>",
      text: "This is the plain text version.",
    });
    expect(true).toBe(true);
  });
});
