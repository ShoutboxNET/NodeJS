import Shoutbox from "../index";
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

describe("Shoutbox", () => {
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

  it("should send a basic email", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test Email",
      html: "<h1>Test</h1><p>This is a test email from the Shoutbox API client.</p>",
    });
    expect(true).toBe(true);
  });

  it("should send email with name and reply-to", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test Email with Name",
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
      subject: "Test Email with Headers",
      html: "<h1>Test</h1><p>This is a test email with custom headers.</p>",
      headers: {
        "X-Test-Header": "test-value",
      },
    });
    expect(true).toBe(true);
  });

  it("should send multiple emails", async () => {
    const emails = [
      {
        from,
        to,
        subject: "Test Email 1",
        html: "<h1>Test 1</h1><p>This is test email 1.</p>",
      },
      {
        from,
        to,
        subject: "Test Email 2",
        html: "<h1>Test 2</h1><p>This is test email 2.</p>",
      },
    ];

    await client.sendEmails(emails);
    expect(true).toBe(true);
  });

  it("should throw error when API key is missing", () => {
    // Remove API key from environment
    delete process.env.SHOUTBOX_API_KEY;

    expect(() => {
      // @ts-ignore - Testing invalid input
      new Shoutbox();
    }).toThrow("API key is required for Shoutbox");

    expect(() => {
      new Shoutbox("");
    }).toThrow("API key is required for Shoutbox");

    expect(() => {
      // @ts-ignore - Testing invalid input
      new Shoutbox(null);
    }).toThrow("API key is required for Shoutbox");
  });

  it("should handle email with attachments", async () => {
    await client.sendEmail({
      from,
      to,
      subject: "Test Email with Attachments",
      html: "<h1>Test</h1><p>This is a test email with attachments.</p>",
      attachments: [
        {
          filepath: path.join(__dirname, "../../examples/important.txt"),
          filename: "test.txt",
          contentType: "text/plain",
        },
      ],
    });

    await client.sendEmail({
      from,
      to,
      subject: "Test Email with Excel Attachment",
      html: "<h1>Test</h1><p>This is a test email with attachments.</p>",
      attachments: [
        {
          filepath: path.join(__dirname, "../../examples/test.xlsx"),
          filename: "text.xlsx",
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    });
    expect(true).toBe(true);
  });

  it("should handle email with CC", async () => {
    await client.sendEmail({
      from,
      to,
      cc: from, // Use from address as CC for testing
      subject: "Test Email with CC",
      html: "<h1>Test</h1><p>This is a test email with CC.</p>",
    });
    expect(true).toBe(true);
  });
});
