// Simple wrapper for main process - required by electron-builder
const path = require('path');

// In production, point to the actual main file
if (process.env.NODE_ENV === 'production') {
  require(path.join(__dirname, '..', 'src', 'main.js'));
} else {
  require(path.join(__dirname, '..', 'src', 'main.js'));
}