const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');
const crypto = require('crypto');

/**
 * Generates a safe filename from a URL and title
 * @param {string} url - The URL of the blog post
 * @param {string} title - The title of the blog post
 * @returns {string} - A safe filename
 */
function generateFilename(url, title) {
  // Create a base filename from the title
  let baseFilename = title ? sanitize(title) : 'untitled';
  
  // Limit the length
  baseFilename = baseFilename.substring(0, 50);
  
  // Add a hash of the URL to ensure uniqueness
  const urlHash = crypto.createHash('md5').update(url).digest('hex').substring(0, 8);
  
  // Combine with timestamp for uniqueness
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  return `${baseFilename}_${urlHash}_${timestamp}.txt`;
}

/**
 * Saves blog content to the repository
 * @param {string} content - The blog content to save
 * @param {Object} metadata - Metadata about the blog post
 * @returns {Object} - Information about the saved file
 */
function saveBlogContent(content, metadata) {
  const repoPath = process.cwd();
  const postsDir = path.join(repoPath, 'posts');
  const metadataDir = path.join(repoPath, 'metadata');
  
  // Ensure directories exist
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir, { recursive: true });
  }
  
  // Generate filename
  const filename = generateFilename(metadata.url, metadata.title);
  const contentPath = path.join(postsDir, filename);
  const metadataPath = path.join(metadataDir, `${path.parse(filename).name}.json`);
  
  // Save content
  fs.writeFileSync(contentPath, content);
  
  // Save metadata
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  
  return {
    filename,
    contentPath,
    metadataPath
  };
}

module.exports = {
  generateFilename,
  saveBlogContent
};
