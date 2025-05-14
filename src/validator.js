/**
 * URL validation module
 */

/**
 * Validates if a string is a properly formatted URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

/**
 * Validates if a URL is accessible
 * @param {string} url - The URL to check
 * @returns {Promise<boolean>} - Promise resolving to true if accessible
 */
async function isUrlAccessible(url) {
  // This function will be implemented in the scraper module
  // to avoid circular dependencies
  return true;
}

module.exports = {
  isValidUrl,
  isUrlAccessible
};
