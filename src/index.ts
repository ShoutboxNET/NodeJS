import { config } from "dotenv";
import { EmailOptions, Attachment } from "./types";
import { basename } from "path";
import fs from "fs";
import mime from "mime-types";
import { render } from "@react-email/render";
import { SMTPClient } from "./smtp";

config(); // Ensure environment variables are loaded

const API_ENDPOINT =
  process.env.SHOUTBOX_API_ENDPOINT ?? "https://api.shoutbox.net/send";

export { SMTPClient };

export default class Shoutbox {
  private apiKey: string;

  constructor(apiKey?: string | null | undefined) {
    // Handle undefined, null, or empty string cases
    const key = apiKey === undefined ? process.env.SHOUTBOX_API_KEY : apiKey;

    if (!key || (typeof key === "string" && key.trim() === "")) {
      throw new Error("API key is required for Shoutbox");
    }

    this.apiKey = key;
  }

  private cleanRenderedHtml(html: string): string {
    // Remove DOCTYPE, html envelope tags, and the $ /$ markers
    return html
      .replace(/<!DOCTYPE[^>]*>/i, "")
      .replace(/<\/?html[^>]*>/gi, "")
      .replace(/\$<|>\$\//g, "<") // Replace $< and >$/ with just <
      .replace(/\$|\/\$/g, "") // Remove any remaining $ and /$ markers
      .trim();
  }

  private async send(options: EmailOptions): Promise<void> {
    let extraHeaders: Record<string, string> = {};
    if (options.headers) {
      Object.entries(options.headers).forEach(
        ([key, value]) => (extraHeaders[key] = value)
      );
      delete options.headers;
    }

    if (options.react) {
      const renderedHtml = await render(options.react);
      options.html = this.cleanRenderedHtml(renderedHtml);
    }

    // Handle attachments
    for (const e of options.attachments || []) {
      if (!e.content) {
        e.content = await fs.promises.readFile(e.filepath);
      }
      if (!e.filename) {
        e.filename = basename(e.filepath);
      }
      if (!e.contentType) {
        e.contentType = mime.lookup(e.filename) || "application/octet-stream";
      }
      if (typeof e.content === "object") {
        e.content = e.content.toString("base64");
      }
    }

    const emailContent = JSON.stringify(options);
    if (emailContent.length > 1024 * 1024) {
      throw new Error(
        `Body too large, expect 1MB, ${emailContent.length} bytes given`
      );
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          ...extraHeaders,
        },
        body: emailContent,
      });

      if (response.ok) {
        console.log("Email sent successfully:", await response.json());
      } else {
        console.error("Failed to send email:", await response.text());
      }
    } catch (error) {
      console.error("Error during fetch operation:", error);
      throw error;
    }
  }

  public sendEmail(options: EmailOptions): Promise<void> {
    return this.send(options);
  }

  public sendEmails(options: EmailOptions[]): Promise<void[]> {
    return Promise.all(options.map((option) => this.send(option)));
  }
}
