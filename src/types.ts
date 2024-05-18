export interface EmailOptions {
  from: string;
  name?: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: any; // React component
  attachments?: Attachment[];
  replyTo?: string;
  tags?: Record<string, string>;
  headers?: Record<string, string>;
  cc?: string | string[];
}

export interface Attachment {
  filename?: string;
  filepath: string; // File path of the attachment
  contentType?: string; // MIME type, optional
  content?: string | Buffer; // Base64 encoded content, optional
}
