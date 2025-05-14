const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
const { getApiKey } = require('./src/articleManager');

// Create Express app
const app = express();
const PORT = 3006;

// Configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Define routes
app.get('/', (req, res) => {
  res.send('Home page');
});

app.get('/test', (req, res) => {
  res.send('Test route works!');
});

// Article AI Generator routes
app.get('/articles', (req, res) => {
  console.log('GET /articles route handler called');
  
  try {
    // Get API key
    const apiKey = getApiKey();
    console.log('API Key:', apiKey);
    
    // Set default values
    const data = {
      apiKey,
      isConnected: false,
      articles: [],
      message: req.query.message || '',
      error: req.query.error || ''
    };
    
    // Render the view
    res.render('articles', data);
    console.log('Articles view rendered successfully');
  } catch (error) {
    console.error('Error in articles route:', error);
    res.status(500).send('Error: ' + error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Complete server running on http://localhost:${PORT}`);
});
