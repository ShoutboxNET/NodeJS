import { SMTPClient } from "../src";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Set up globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(global.__filename);

const apiKey = process.env.SHOUTBOX_API_KEY || "your-api-key-here";
const client = new SMTPClient(apiKey);

(async () => {
  try {
    // First verify the connection
    const isConnected = await client.verifyConnection();
    if (!isConnected) {
      console.error("Failed to connect to SMTP server");
      process.exit(1);
    }

    // Send a basic email
    await client.sendEmail({
      from: "sender@example.com",
      name: "Sender Name",
      to: "recipient@example.com",
      subject: "Test SMTP Email",
      html: "<h1>Hello from SMTP!</h1><p>This email was sent using the SMTP client.</p>",
      replyTo: "reply@example.com",
    });

    console.log("Basic email sent successfully!");

    // Send an email with attachment
    await client.sendEmail({
      from: "sender@example.com",
      to: "recipient@example.com",
      subject: "Test SMTP Email with Attachment",
      html: "<h1>Hello!</h1><p>This email includes an attachment.</p>",
      attachments: [
        {
          filepath: path.join(__dirname, "important.txt"),
        },
      ],
    });

    console.log("Email with attachment sent successfully!");

    // Send an email with multiple recipients and custom headers
    await client.sendEmail({
      from: "sender@example.com",
      to: ["recipient1@example.com", "recipient2@example.com"],
      cc: ["cc1@example.com", "cc2@example.com"],
      subject: "Test SMTP Email with Multiple Recipients",
      html: "<h1>Hello everyone!</h1><p>This email was sent to multiple recipients.</p>",
      headers: {
        "X-Custom-Header": "Custom Value",
        "X-Priority": "1",
      },
    });

    console.log("Email with multiple recipients sent successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
})();
