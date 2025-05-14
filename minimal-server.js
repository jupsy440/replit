const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const { getApiKey, testApiConnection, listArticles } = require('./src/articleManager');

const app = express();
const PORT = 3003;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (req, res) => {
  console.log('Home route accessed');
  res.send('Home route works!');
});

// Test route
app.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.send('Test route works!');
});

// Articles route
app.get('/articles', async (req, res) => {
  console.log('Articles route accessed');
  
  try {
    const apiKey = getApiKey();
    console.log('API Key:', apiKey);
    
    const isConnected = await testApiConnection();
    console.log('API connection:', isConnected);
    
    const articles = isConnected ? await listArticles() : [];
    console.log('Articles:', articles.length);
    
    res.render('articles', {
      apiKey,
      isConnected,
      articles,
      message: '',
      error: ''
    });
    
    console.log('Articles view rendered successfully');
  } catch (error) {
    console.error('Error in articles route:', error);
    res.status(500).send('Error: ' + error.message);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Minimal server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
