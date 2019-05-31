var express = require('express');
var router = express.Router();
var Blog = require('../models/blog');
var middleware = require('../middleware/index');

// Show all blogs in DB
router.get('/', (req, res) => {
    Blog.find({}, (err, allBlogs) => {
        if(err) {
            console.log(err);
        } else {
            res.render('blogs/index', {blogs: allBlogs, currentUser: req.user})
        }
    }).sort({created: -1});
});

// Post to all blogs
router.post('/', middleware.isLoggedIn, (req, res) => {
    var title = req.body.title;
    var image = req.body.image;
    var content = req.body.content;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    console.log(req.body.content);
    var newBlog = {title: title, image: image, content: content, author: author}
    // create the blog

    console.log(newBlog);
    
    Blog.create(newBlog, (err, newlyCreated) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/blogs');
        }
    });
});

// Render the new blog form
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('blogs/new');
});

// Show more info about a blog
router.get('/:id', (req, res) => {
    // find blog with provided ID
    Blog.findById(req.params.id).populate('comments').exec((err, foundBlog) => {
        if(err) {
            console.log(err);
        } else {
            res.render('blogs/show', {blog: foundBlog});
        }
    });
});

// edit blog
router.get('/:id/edit', middleware.checkBlogOwnership, (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        res.render('blogs/edit', {bog: foundBlog})
    });
});

// update blog
router.put('/:id', middleware.checkBlogOwnership, (req, res) => {
    // find and update
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            // redirect
            res.redirect('/blogs/' + req.params.id);
        }
    });
});

// delete blog route
router.delete('/:id', middleware.checkBlogOwnership, (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err) => {
        if(err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs');
        }
    });
});

module.exports = router;