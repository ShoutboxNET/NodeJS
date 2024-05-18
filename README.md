# Shoutbox.net Developer API

Shoutbox.net is a Developer API designed to send transactional emails at scale. This library provides a simple and efficient way to interact with the Shoutbox API, making it easy to integrate email functionalities into your application.

## Installation

You can install the `shoutboxnet` package using npm, yarn, or pnpm.

### Using npm

```bash
npm install shoutboxnet
```

### Using yarn

```bash
yarn add shoutboxnet
```

### Using pnpm

```bash
pnpm add shoutboxnet
```

## Usage

To use the `shoutboxnet` library, you need to have an API key from Shoutbox.net. You can pass this key directly to the Shoutbox class or set it as an environment variable (`SHOUTBOX_API_KEY`).

### Sending a Simple Email

Here's an example of sending a basic email:

```typescript
import Shoutbox from "shoutboxnet";

const shoutbox = new Shoutbox();

(async () => {
  await shoutbox.sendEmail({
    name: "Vlad",
    from: "no-reply@shoutbox.net",
    to: "test@example.com",
    subject: "A question about the meetup",
    html: "<b>Hi, Are you still going to that meetup?</b>",
  });
})();
```

### Sending an Email with Attachments

You can also send emails with attachments:

```typescript
import Shoutbox from "shoutboxnet";

const shoutbox = new Shoutbox();

(async () => {
  await shoutbox.sendEmail({
    name: "Vlad",
    from: "no-reply@shoutbox.net",
    to: "test@example.com",
    subject: "A question about the meetup",
    html: "<b>Hi, Are you still going to that meetup?</b>",
    attachments: [
      {
        filepath: "./examples/important.txt",
      },
    ],
  });
})();
```

### Sending an Email with CC

You can include CC recipients as well:

```typescript
import Shoutbox from "shoutboxnet";

const shoutbox = new Shoutbox();

(async () => {
  await shoutbox.sendEmail({
    name: "Vlad",
    from: "no-reply@shoutbox.net",
    to: "test@example.com",
    subject: "A question about

the meetup",
    html: "<b>Hi, Are you still going to that meetup?</b>",
    cc: "tycho@shoutbox.net",
  });
})();
```

## EmailOptions Interface

The `EmailOptions` interface allows you to customize your email. Below are the properties you can set:

- **from** (string): The sender's email address (required).
- **name** (string): The sender's name (optional).
- **to** (string | string[]): The recipient's email address(es) (required).
- **subject** (string): The subject of the email (required).
- **html** (string): The HTML content of the email (optional).
- **text** (string): The plain text content of the email (optional).
- **react** (React Email Component): A React Email Component which will be converted to a HTML template
- **attachments** (Attachment[]): An array of attachment objects (optional).
- **replyTo** (string): The email address for replies (optional).
- **tags** (Record<string, string>): A record of tags (optional).
- **headers** (Record<string, string>): Custom headers for the email (optional).
- **cc** (string | string[]): CC recipients (optional).

### Attachment Interface

The `Attachment` interface allows you to attach files to your emails:

- **filename** (string): The name of the file (optional).
- **filepath** (string): The file path of the attachment (required).
- **contentType** (string): The MIME type of the attachment (optional).
- **content** (string | Buffer): The Base64 encoded content of the attachment (optional).

## Environment Variables

To avoid hardcoding your API key, you can set it as an environment variable:

```bash
export SHOUTBOX_API_KEY=your_api_key
```

## Development

If you want to develop on this package, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/yourusername/shoutboxnet.git
```

2. Navigate to the project directory:

```bash
cd shoutboxnet
```

3. Install the dependencies:

```bash
npm install
```

4. Run the tests:

```bash
npm test
```

You can make changes to the source code and run the tests to ensure everything works as expected.

## License

This library is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contributing

We welcome contributions! Please submit a pull request or open an issue to discuss your changes.

## Support

If you have any questions or need help, feel free to open an issue on GitHub.

---

By following this guide, you should be able to successfully integrate and use the Shoutbox.net Developer API to send transactional emails at scale. For more examples and detailed information, refer to the source code and documentation provided in this repository.