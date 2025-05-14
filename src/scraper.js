const axios = require('axios');
const cheerio = require('cheerio');
const { isValidUrl } = require('./validator');

/**
 * Fetches the content of a webpage
 * @param {string} url - The URL to fetch
 * @returns {Promise<Object>} - Promise resolving to the webpage content and metadata
 */
async function fetchWebpage(url) {
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format');
  }
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // 10 seconds timeout
    });
    
    return {
      content: response.data,
      status: response.status,
      headers: response.headers,
      url: response.config.url
    };
  } catch (error) {
    if (error.response) {
      throw new Error(`Failed to fetch webpage: HTTP status ${error.response.status}`);
    } else if (error.request) {
      throw new Error('Failed to fetch webpage: No response received');
    } else {
      throw new Error(`Failed to fetch webpage: ${error.message}`);
    }
  }
}

/**
 * Extracts the entire content of a webpage as plain text
 * @param {string} html - The HTML content of the webpage
 * @returns {Object} - Object containing the extracted content and metadata
 */
function extractContent(html, url) {
  const $ = cheerio.load(html);
  
  // Extract title
  const title = $('title').text().trim() || 'Untitled';
  
  // Extract metadata
  const metadata = {
    title,
    url,
    date: new Date().toISOString(),
    description: $('meta[name="description"]').attr('content') || '',
    author: $('meta[name="author"]').attr('content') || ''
  };
  
  // Extract the entire HTML content
  const bodyContent = $('body').html() || '';
  
  // Convert HTML to plain text (simple approach)
  let plainText = '';
  
  // Add the title
  plainText += `# ${title}\n\n`;
  
  // Add the URL
  plainText += `Source: ${url}\n`;
  plainText += `Retrieved: ${new Date().toLocaleString()}\n\n`;
  
  // Add the body content (stripped of HTML tags)
  plainText += `${$('body').text().trim()}\n`;
  
  return {
    plainText,
    metadata
  };
}

/**
 * Checks if a URL is accessible
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Promise resolving to true if accessible
 */
async function isUrlAccessible(url) {
  try {
    const response = await axios.head(url, {
      timeout: 5000,
      validateStatus: status => status < 400
    });
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = {
  fetchWebpage,
  extractContent,
  isUrlAccessible
};
