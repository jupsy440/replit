const fs = require('fs');
const path = require('path');

/**
 * Configuration manager for the application
 * Handles loading and saving configuration settings
 */
class Config {
  constructor() {
    this.configPath = path.join(process.cwd(), '.config.json');
    this.config = this.loadConfig();
  }

  /**
   * Load configuration from file
   * @returns {Object} Configuration object
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configPath)) {
        return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return { apiKey: '' };
  }

  /**
   * Save configuration to file
   */
  saveConfig() {
    try {
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  /**
   * Get the API key
   * @returns {string} API key
   */
  getApiKey() {
    return this.config.apiKey;
  }

  /**
   * Set the API key
   * @param {string} apiKey - API key to set
   */
  setApiKey(apiKey) {
    this.config.apiKey = apiKey;
    this.saveConfig();
  }
}

module.exports = new Config();
