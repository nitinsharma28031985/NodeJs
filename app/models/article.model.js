const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema({
    title: String,
    content: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Article', ArticleSchema);