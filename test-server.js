const express = require('express');
const app = express();
const PORT = 3002;

// Simple route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.send('Root route works!');
});

// Test route
app.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.send('Test route works!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
