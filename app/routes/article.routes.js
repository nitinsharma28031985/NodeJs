module.exports = (app) => {
    const article = require('../controllers/article.controller.js');

    // Create a new Article
    app.post('/addArticleProcess', article.create);

    // Retrieve all Articles
    app.get('/articles', article.findAll);

    // Retrieve a single Article with articleId
    app.get('/article/:articleId', article.findOne);

    // Update a Article with articleId
    app.post('/articleUpdate/:articleId', article.update);

    // Delete a Article with articleId
    app.delete('/articleDelete/:articleId', article.delete);
}