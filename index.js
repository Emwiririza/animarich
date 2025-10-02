{
  "name": "newsletter-backend",
  "version": "1.0.0",
  "description": "Simple newsletter subscription API for Animagnet store",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-rate-limit": "^7.4.0",
    "validator": "^13.11.0"
  }
}