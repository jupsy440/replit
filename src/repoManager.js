const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

// Initialize Git repository
async function initRepo() {
  const git = simpleGit();
  const repoPath = process.cwd();
  
  // Check if .git directory already exists
  if (fs.existsSync(path.join(repoPath, '.git'))) {
    console.log('Git repository already initialized.');
    return;
  }
  
  try {
    // Initialize repository
    await git.init();
    console.log('Git repository initialized.');
    
    // Create README.md if it doesn't exist
    const readmePath = path.join(repoPath, 'README.md');
    if (!fs.existsSync(readmePath)) {
      const readmeContent = `# Blog to Git Repository

A collection of blog posts saved from the web.

## Structure

- \`posts/\`: Contains the extracted blog posts in plain text format
- \`metadata/\`: Contains metadata about each blog post

## Usage

This repository was created using the blog-to-git tool.

### Adding new blog posts

\`\`\`
blog-to-git add https://example.com/blog-post
\`\`\`

### Viewing on Replit

This repository is structured to be compatible with Replit. You can view and edit the content directly on Replit.
`;
      
      fs.writeFileSync(readmePath, readmeContent);
      console.log('Created README.md');
    }
    
    // Create .gitignore if it doesn't exist
    const gitignorePath = path.join(repoPath, '.gitignore');
    if (!fs.existsSync(gitignorePath)) {
      const gitignoreContent = `# Node.js
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log

# Editor files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db
`;
      
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('Created .gitignore');
    }
    
    // Create posts and metadata directories
    const postsDir = path.join(repoPath, 'posts');
    const metadataDir = path.join(repoPath, 'metadata');
    
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir);
      console.log('Created posts directory');
    }
    
    if (!fs.existsSync(metadataDir)) {
      fs.mkdirSync(metadataDir);
      console.log('Created metadata directory');
    }
    
    // Create .replit file for Replit compatibility
    const replitPath = path.join(repoPath, '.replit');
    if (!fs.existsSync(replitPath)) {
      const replitContent = `run = "echo 'This is a repository of blog posts. Browse the files to view content.'"
`;
      
      fs.writeFileSync(replitPath, replitContent);
      console.log('Created .replit configuration file');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing repository:', error.message);
    throw error;
  }
}

// Get repository status
async function getRepoStatus() {
  const git = simpleGit();
  
  try {
    const status = await git.status();
    return {
      current: status.current,
      tracking: status.tracking,
      files: {
        not_added: status.not_added,
        modified: status.modified,
        created: status.created,
        deleted: status.deleted,
        renamed: status.renamed,
        staged: status.staged
      }
    };
  } catch (error) {
    console.error('Error getting repository status:', error.message);
    throw error;
  }
}

module.exports = {
  initRepo,
  getRepoStatus
};
