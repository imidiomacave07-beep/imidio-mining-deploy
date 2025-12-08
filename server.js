{
  "name": "imidio-mining-platform",
  "version": "1.0.0",
  "description": "Plataforma de mineração Imidio",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["mining", "crypto", "platform"],
  "author": "Imidio Macave",
  "license": "MIT",
  "dependencies": {
    "bcrypt": "^5.1.0",
    "body-parser": "^1.20.2",
    "express": "^4.18.2",
    "mongoose": "^7.5.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
