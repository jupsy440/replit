const { isValidUrl, isUrlAccessible } = require('./validator');
const { fetchWebpage, extractContent } = require('./scraper');
const { saveBlogContent } = require('./fileManager');
const fs = require('fs');
const path = require('path');

/**
 * Adds a blog post from a URL to the repository
 * @param {string} url - The URL of the blog post to add
 * @returns {Promise<string>} - Promise resolving to the filename of the saved blog post
 */
async function addBlogPost(url) {
  // Validate URL
  if (!isValidUrl(url)) {
    throw new Error('Invalid URL format. Please provide a valid HTTP or HTTPS URL.');
  }
  
  // Check if URL is accessible
  const isAccessible = await isUrlAccessible(url);
  if (!isAccessible) {
    throw new Error('The URL is not accessible. Please check the URL and try again.');
  }
  
  try {
    // Fetch webpage content
    console.log(`Fetching content from ${url}...`);
    const webpage = await fetchWebpage(url);
    
    // Extract content
    console.log('Extracting content...');
    const { plainText, metadata } = extractContent(webpage.content, url);
    
    // Save content to repository
    console.log('Saving content to repository...');
    const { filename, contentPath, metadataPath } = saveBlogContent(plainText, metadata);
    
    console.log(`Blog post saved to ${contentPath}`);
    console.log(`Metadata saved to ${metadataPath}`);
    
    return filename;
  } catch (error) {
    console.error('Error adding blog post:', error.message);
    throw error;
  }
}

module.exports = {
  addBlogPost
};
