// Make fetch available in Node.js for tests
if (!globalThis.fetch) {
    globalThis.fetch = require('node-fetch');
}

// Load environment variables for tests
require('dotenv').config();
