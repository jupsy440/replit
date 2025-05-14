const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
const { addBlogPost } = require('./src/cli');
const { initRepo, getRepoStatus } = require('./src/repoManager');
const { 
  listArticles, 
  fetchArticle, 
  fetchAllArticles, 
  setApiKey,
  getApiKey,
  testApiConnection
} = require('./src/articleManager');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Configure view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  let isRepoInitialized = false;
  let blogPosts = [];
  
  try {
    // Check if repository is initialized
    isRepoInitialized = fs.existsSync(path.join(__dirname, '.git'));
    
    // Get list of blog posts if repository is initialized
    if (isRepoInitialized && fs.existsSync(path.join(__dirname, 'posts'))) {
      const postsDir = path.join(__dirname, 'posts');
      blogPosts = fs.readdirSync(postsDir)
        .filter(file => file.endsWith('.txt'))
        .map(file => {
          const filePath = path.join(postsDir, file);
          const metadataPath = path.join(__dirname, 'metadata', file.replace('.txt', '.json'));
          
          let metadata = {};
          if (fs.existsSync(metadataPath)) {
            try {
              metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            } catch (error) {
              console.error(`Error reading metadata for ${file}:`, error);
            }
          }
          
          return {
            filename: file,
            title: metadata.title || file,
            url: metadata.url || '',
            date: metadata.date ? new Date(metadata.date).toLocaleString() : 'Unknown'
          };
        });
    }
  } catch (error) {
    console.error('Error in home route:', error);
    // In case of error, continue with empty blog posts
  }
  
  res.render('index', { 
    isRepoInitialized,
    blogPosts,
    message: req.query.message || '',
    error: req.query.error || ''
  });
});

// Initialize repository
app.post('/init', async (req, res) => {
  try {
    await initRepo();
    res.redirect('/?message=Repository initialized successfully!');
  } catch (error) {
    res.redirect(`/?error=${encodeURIComponent(error.message)}`);
  }
});

// Add blog post
app.post('/add', async (req, res) => {
  const { url } = req.body;
  
  if (!url) {
    return res.redirect('/?error=URL is required');
  }
  
  try {
    const filename = await addBlogPost(url);
    res.redirect(`/?message=Blog post saved as ${filename}`);
  } catch (error) {
    res.redirect(`/?error=${encodeURIComponent(error.message)}`);
  }
});

// View blog post
app.get('/view/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'posts', filename);
  
  try {
    if (!fs.existsSync(filePath)) {
      return res.redirect('/?error=Blog post not found');
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const metadataPath = path.join(__dirname, 'metadata', filename.replace('.txt', '.json'));
    
    let metadata = {};
    if (fs.existsSync(metadataPath)) {
      try {
        metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      } catch (error) {
        console.error(`Error reading metadata for ${filename}:`, error);
      }
    }
    
    res.render('view', { 
      content, 
      metadata, 
      filename,
      message: req.query.message || '',
      error: req.query.error || ''
    });
  } catch (error) {
    console.error('Error in view route:', error);
    return res.redirect(`/?error=${encodeURIComponent('Error viewing blog post: ' + error.message)}`);
  }
});

// Repository status
app.get('/status', async (req, res) => {
  try {
    const status = await getRepoStatus();
    res.render('status', { 
      status,
      message: req.query.message || '',
      error: req.query.error || ''
    });
  } catch (error) {
    console.error('Error in status route:', error);
    // Provide a fallback status object in case of error
    const fallbackStatus = {
      branch: 'unknown',
      isClean: false,
      modified: [],
      staged: [],
      ahead: 0,
      behind: 0,
      error: error.message
    };
    
    res.render('status', {
      status: fallbackStatus,
      message: '',
      error: `Error getting repository status: ${error.message}`
    });
  }
});

// Article AI Generator routes
app.get('/articles', (req, res) => {
  console.log('GET /articles route handler called');
  
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
});

app.post('/set-api-key', (req, res) => {
  const { apiKey } = req.body;
  
  if (!apiKey) {
    return res.json({ success: false, error: 'API key is required' });
  }
  
  try {
    setApiKey(apiKey);
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.get('/fetch-article/:articleId', async (req, res) => {
  const { articleId } = req.params;
  
  try {
    const filename = await fetchArticle(articleId);
    res.redirect(`/?message=Article saved as ${filename}`);
  } catch (error) {
    res.redirect(`/articles?error=${encodeURIComponent(error.message)}`);
  }
});

app.get('/fetch-all', async (req, res) => {
  try {
    const count = await fetchAllArticles();
    res.redirect(`/?message=${count} articles saved to repository`);
  } catch (error) {
    res.redirect(`/articles?error=${encodeURIComponent(error.message)}`);
  }
});

// Test route
app.get('/test-route', (req, res) => {
  console.log('Test route accessed');
  res.send('Test route works!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
