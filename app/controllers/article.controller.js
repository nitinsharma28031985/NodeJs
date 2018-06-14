const Article = require('../models/article.model.js');
const mongoose = require('mongoose');

// Create and Save a new Article
exports.create = (req, res) => {
	// Validate request
    if(!req.body.title) {
        return res.status(400).send({
            message: "Article title can not be empty"
        });
    }
    if(!req.body.content) {
        return res.status(400).send({
            message: "Article content can not be empty"
        });
    }

    // Create a Article
    const article = new Article({
        title: req.body.title,
        content:req.body.content    
    });



    // Save Article in the database
    article.save()
    .then(data => {
        res.redirect(`/articles?new=${data._id}`); 
       //res.render("articles", { ResultData: article })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Article."
        });
    });
};

// Retrieve and return all articles from the database.
exports.findAll = (req, res) => {
    let newItemId = req.query.new || '';
    let updateVal = req.query.update || '';

    try{
        newItemId = mongoose.Types.ObjectId(newItemId)
    }
    catch(error){
        newItemId = undefined;
    }

    Promise.all([Article.findById(newItemId), Article.find()])
    .then(result => {

        if(updateVal=='updated'){
            var printMessage = 'Artcle Updated successfully';
        }else{
            var printMessage = null;
        }


        res.render("articles", { AllArticlesData: result[1], ResultData: result[0], message: printMessage })
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving articles."
        });
    });
};

// Find a single article with a articleId
exports.findOne = (req, res) => {
	Article.findById(req.params.articleId)
    .then(article => {
        if(!article) {
            return res.status(404).send({
                message: "Article not found with id " + req.params.articleId
            });            
        }
        res.send(article);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Article not found with id " + req.params.articleId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving article with id " + req.params.articleId
        });
    });
};

// Update a article identified by the articleId in the request
exports.update = (req, res) => {
    
	// Validate Request
    if(!req.body.title) {
        return res.status(400).send({
            message: "Article title can not be empty"
        });
    }
    if(!req.body.content) {
        return res.status(400).send({
            message: "Article content can not be empty"
        });
    }


    // Find article and update it with the request body
    Article.findByIdAndUpdate(req.params.articleId, {
        title: req.body.title,
        content: req.body.content
    }, {new: true})
    .then(article => {
        if(!article) {
            return res.status(404).send({
                message: "Article not found with id " + req.params.articleId
            });
        }
        res.redirect('/articles?update=updated'); 
        //res.render("articles", { message: "Article Updated successfully!", ResultData: null, AllArticlesData: article[1] })
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Article not found with id " + req.params.articleId
            });                
        }
        return res.status(500).send({
            message: "Error updating article with id " + req.params.articleId
        });
    });
};

// Delete a article with the specified articleId in the request
exports.delete = (req, res) => {
    //console.log(req.params.articleId)
	Article.findByIdAndRemove(req.params.articleId)
    .then(article => {
        if(!article) {
            return res.status(404).send({
                message: "Article not found with id " + req.params.articleId
            });
        }
        //res.redirect('/articles?message=deleted'); 
        res.render("articles", { message: "Article deleted successfully!", ResultData: null, AllArticlesData: null })
        //res.send({message: "Article deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.title === 'NotFound') {
            return res.status(404).send({
                message: "Article not found with id " + req.params.articleId
            });                
        }
        return res.status(500).send({
            message: "Could not delete article with id " + req.params.articleId
        });
    });
};
