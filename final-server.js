const express = require('express');
const app = express();
const PORT = 3005;

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple route
app.get('/', (req, res) => {
  res.send('Home page');
});

// Test route
app.get('/test', (req, res) => {
  res.send('Test route works!');
});

// Articles route
app.get('/articles', (req, res) => {
  res.send('Articles route works!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Final server running on http://localhost:${PORT}`);
});
