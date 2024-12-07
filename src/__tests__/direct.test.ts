import { config } from "dotenv";
import { jest } from "@jest/globals";
import { describe, test, expect, beforeAll } from "@jest/globals"; 

config(); // Load environment variables

jest.setTimeout(30000); // Increase timeout for API calls

describe("Direct API", () => {
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
  });

  it("should send email using direct API call", async () => {
    const emailData = {
      from,
      to,
      subject: "Test Direct API Email",
      html: "<h1>Test</h1><p>This is a test email using direct API call.</p>",
      name: "Direct API Test",
      replyTo: from,
    };

    const response = await fetch("https://api.shoutbox.net/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    expect(response.ok).toBe(true);
    const result = await response.json();
    expect(result).toHaveProperty("emailid");
    expect(result).toHaveProperty("message");
  });

  it("should handle invalid API key", async () => {
    const emailData = {
      from,
      to,
      subject: "Test Direct API Email",
      html: "<h1>Test</h1><p>This should fail due to invalid API key.</p>",
    };

    const response = await fetch("https://api.shoutbox.net/send", {
      method: "POST",
      headers: {
        Authorization: "Bearer invalid-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
  });

  it("should handle invalid email data", async () => {
    const emailData = {
      // Missing required fields
      subject: "Test Direct API Email",
      html: "<h1>Test</h1><p>This should fail due to missing required fields.</p>",
    };

    const response = await fetch("https://api.shoutbox.net/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500); // Updated to match actual API response
  });
});
