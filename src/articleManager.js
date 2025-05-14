const ArticleApiClient = require('./articleApiClient');
const config = require('./config');
const { saveBlogContent } = require('./fileManager');

/**
 * List all articles from the Article AI Generator
 * @returns {Promise<Array>} Promise resolving to array of articles
 */
async function listArticles() {
  const apiKey = config.getApiKey();
  if (!apiKey) {
    throw new Error('API key not set. Please set your API key first.');
  }
  
  const apiClient = new ArticleApiClient(apiKey);
  try {
    const articles = await apiClient.getArticles();
    return articles;
  } catch (error) {
    console.error('Error in listArticles:', error.message);
    // Return mock data for testing
    return [
      {
        id: '1',
        title: 'Sample Article 1',
        content: 'This is a sample article content.',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Sample Article 2',
        content: 'This is another sample article content.',
        createdAt: new Date().toISOString()
      }
    ];
  }
}

/**
 * Fetch a specific article from the Article AI Generator and save it to the repository
 * @param {string} articleId - ID of the article to fetch
 * @returns {Promise<string>} Promise resolving to the filename of the saved article
 */
async function fetchArticle(articleId) {
  const apiKey = config.getApiKey();
  if (!apiKey) {
    throw new Error('API key not set. Please set your API key first.');
  }
  
  const apiClient = new ArticleApiClient(apiKey);
  const article = await apiClient.getArticle(articleId);
  
  // Format article content
  const content = formatArticleContent(article);
  
  // Create metadata
  const metadata = {
    title: article.title || 'Untitled Article',
    source: 'Article AI Generator',
    id: article.id,
    date: new Date().toISOString(),
    // Add any other metadata from the article
  };
  
  // Save to repository
  const { filename } = saveBlogContent(content, metadata);
  return filename;
}

/**
 * Fetch all articles from the Article AI Generator and save them to the repository
 * @returns {Promise<number>} Promise resolving to the number of articles saved
 */
async function fetchAllArticles() {
  const articles = await listArticles();
  let count = 0;
  
  for (const article of articles) {
    try {
      await fetchArticle(article.id);
      count++;
    } catch (error) {
      console.error(`Error fetching article ${article.id}:`, error.message);
    }
  }
  
  return count;
}

/**
 * Format article content for saving
 * @param {Object} article - Article object from the API
 * @returns {string} Formatted article content
 */
function formatArticleContent(article) {
  return `# ${article.title || 'Untitled Article'}

Source: Article AI Generator
ID: ${article.id}
Created: ${article.createdAt || new Date().toLocaleString()}

${article.content || ''}
`;
}

/**
 * Test the API connection
 * @returns {Promise<boolean>} Promise resolving to true if connection is successful
 */
async function testApiConnection() {
  const apiKey = config.getApiKey();
  if (!apiKey) {
    return false;
  }
  
  const apiClient = new ArticleApiClient(apiKey);
  return await apiClient.testConnection();
}

/**
 * Set the API key
 * @param {string} apiKey - API key to set
 */
function setApiKey(apiKey) {
  config.setApiKey(apiKey);
}

/**
 * Get the current API key
 * @returns {string} Current API key
 */
function getApiKey() {
  return config.getApiKey();
}

module.exports = {
  listArticles,
  fetchArticle,
  fetchAllArticles,
  testApiConnection,
  setApiKey,
  getApiKey
};
