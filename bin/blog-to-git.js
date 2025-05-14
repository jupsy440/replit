#!/usr/bin/env node

const { program } = require('commander');
const { initRepo } = require('../src/repoManager');
const { addBlogPost } = require('../src/cli');
const { getRepoStatus } = require('../src/repoManager');
const { 
  listArticles, 
  fetchArticle, 
  fetchAllArticles, 
  setApiKey,
  getApiKey,
  testApiConnection
} = require('../src/articleManager');
const path = require('path');
const fs = require('fs');
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('A CLI tool to extract blog content and save it to a Git repository');

program
  .command('init')
  .description('Initialize a new Git repository for blog posts')
  .action(() => {
    initRepo()
      .then(() => console.log('Repository initialized successfully!'))
      .catch(err => console.error('Error initializing repository:', err.message));
  });

program
  .command('add <url>')
  .description('Add a blog post from the specified URL')
  .action((url) => {
    addBlogPost(url)
      .then(filename => console.log(`Blog post saved as ${filename}`))
      .catch(err => console.error('Error adding blog post:', err.message));
  });

program
  .command('status')
  .description('Check the status of the Git repository')
  .action(() => {
    getRepoStatus()
      .then(status => {
        console.log('Repository Status:');
        console.log(status);
        console.log('\nUse Git commands to commit and push changes.');
      })
      .catch(err => console.error('Error getting repository status:', err.message));
  });

// Article AI Generator commands
program
  .command('set-api-key <apiKey>')
  .description('Set the API key for Article AI Generator')
  .action((apiKey) => {
    setApiKey(apiKey);
    console.log('API key set successfully.');
    console.log('Testing API connection...');
    testApiConnection()
      .then(isConnected => {
        if (isConnected) {
          console.log('API connection successful!');
        } else {
          console.log('API connection failed. Please check your API key.');
        }
      })
      .catch(err => console.error('Error testing API connection:', err.message));
  });

program
  .command('get-api-key')
  .description('Get the current API key for Article AI Generator')
  .action(() => {
    const apiKey = getApiKey();
    if (apiKey) {
      console.log(`Current API key: ${apiKey}`);
    } else {
      console.log('No API key set. Use "set-api-key" command to set one.');
    }
  });

program
  .command('list-articles')
  .description('List articles from Article AI Generator')
  .action(() => {
    console.log('Fetching articles from Article AI Generator...');
    listArticles()
      .then(articles => {
        if (articles && articles.length > 0) {
          console.log(`Found ${articles.length} articles:`);
          articles.forEach(article => {
            console.log(`- ID: ${article.id}, Title: ${article.title || 'Untitled'}`);
          });
        } else {
          console.log('No articles found.');
        }
      })
      .catch(err => console.error('Error listing articles:', err.message));
  });

program
  .command('fetch-article <articleId>')
  .description('Fetch an article from Article AI Generator and save it to the repository')
  .action((articleId) => {
    console.log(`Fetching article ${articleId} from Article AI Generator...`);
    fetchArticle(articleId)
      .then(filename => console.log(`Article saved as ${filename}`))
      .catch(err => console.error('Error fetching article:', err.message));
  });

program
  .command('fetch-all')
  .description('Fetch all articles from Article AI Generator and save them to the repository')
  .action(() => {
    console.log('Fetching all articles from Article AI Generator...');
    fetchAllArticles()
      .then(count => console.log(`${count} articles saved to repository`))
      .catch(err => console.error('Error fetching articles:', err.message));
  });

program.parse(process.argv);

// If no arguments provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
