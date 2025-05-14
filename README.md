# Blog to Git

A tool that extracts blog content from URLs and saves it to a Git repository in plain text format. The repository is structured to be compatible with Replit. Includes both a command-line interface and a web interface.

## Features

- Extract entire webpage content from any URL
- Save content in plain text format
- Store metadata about each blog post
- Create a Git repository structure compatible with Replit
- Provide commands for repository management
- Web interface for easy interaction
- Integration with Article AI Generator for automatic article fetching

## Installation

### Local Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd blog-to-git
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Link the package globally (optional):
   ```
   npm link
   ```

### Using on Replit

1. Create a new Replit project
2. Import this repository
3. Install dependencies:
   ```
   npm install
   ```

## Usage

### Web Interface

To start the web interface:

```
npm start
```

This will start a web server at http://localhost:3000 where you can:
- Initialize the Git repository
- Add blog posts by entering URLs
- View the content of saved blog posts
- Check the repository status

### Command-line Interface

#### Initialize a Repository

Before adding blog posts, initialize a Git repository:

```
npm run init-repo
```

Or if globally linked:

```
blog-to-git init
```

This will:
- Initialize a Git repository
- Create necessary directories
- Add a README.md file
- Add a .gitignore file
- Add a .replit configuration file

#### Add a Blog Post

To add a blog post from a URL:

```
npm run add -- https://example.com/blog-post
```

Or if globally linked:

```
blog-to-git add https://example.com/blog-post
```

This will:
- Fetch the webpage content
- Extract the entire content
- Save it as a plain text file in the `posts/` directory
- Save metadata in the `metadata/` directory

#### Check Repository Status

To check the status of the Git repository:

```
npm run status
```

Or if globally linked:

```
blog-to-git status
```

This will show which files are ready to be committed.

### Manual Git Operations

After adding blog posts, you can use standard Git commands to commit and push changes:

```
git add .
git commit -m "Added new blog posts"
git push
```

### Article AI Generator Integration

The app integrates with Article AI Generator to automatically fetch articles and save them to your Git repository.

#### Command-line Interface

```
# Set your API key
blog-to-git set-api-key YOUR_API_KEY

# List available articles
blog-to-git list-articles

# Fetch a specific article
blog-to-git fetch-article ARTICLE_ID

# Fetch all articles
blog-to-git fetch-all
```

#### Web Interface

The web interface provides a dedicated page for Article AI Generator integration:

1. Navigate to the "Article AI Generator" page
2. Enter your API key
3. View available articles
4. Fetch individual articles or all articles at once

### Using on Replit

When running on Replit, the web interface will automatically start. You can:
1. Click the "Run" button in Replit
2. Access the web interface in the Replit webview
3. Use the interface to initialize the repository, add blog posts, and view content

## Repository Structure

```
blog-to-git-repo/
├── posts/              # Contains the extracted blog posts in plain text format
├── metadata/           # Contains metadata about each blog post
├── .replit             # Replit configuration file
├── README.md           # Repository documentation
└── .gitignore          # Git ignore file
```

## Replit Compatibility

The repository is structured to be compatible with Replit:
- Includes a `.replit` configuration file
- Uses a simple directory structure
- Stores content in plain text format for easy viewing
- Provides a web interface for easy interaction

### Viewing on Replit

To view and use this app on Replit:

1. Create a new Replit project
2. Import this repository
3. Install dependencies:
   ```
   npm install
   ```
4. Click the "Run" button in Replit
5. The web interface will automatically start and be available in the Replit webview
6. Use the interface to:
   - Initialize the Git repository
   - Add blog posts by entering URLs
   - View the content of saved blog posts
   - Check the repository status

## License

ISC
