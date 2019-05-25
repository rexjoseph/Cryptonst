var express = require('express');
var router = express.Router({mergeParams: true});
var Blog = require('../models/blog');
var Comment = require('../models/comment');
var middleware = require('../middleware/index');

// Comments route
router.get('/new', middleware.isLoggedIn, (req, res) => {
	Blog.findById(req.params.id, (err, blog) => {
		if(err) {
			console.log(err);
		} else {
			res.render('comments/new', {blog: blog});
		}
	}) 
})

router.post('/', middleware.isLoggedIn, (req, res) => {
	// find blog using ID
	Blog.findById(req.params.id, (err, blog) => {
		if(err) {
			console.log(err);
			res.redirect('/blogs');
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err) {
					req.flash('error', 'Something went wrong');
					console.log(err);
				} else {
					// add id
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					blog.comments.push(comment);
					blog.save();
					res.redirect('/blogs/' + blog._id);
				}
			})
		}
	});
});

// Comment edit route
router.get('/:comments_id/edit', middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			res.redirect('back');
		} else {
			res.render('comments/edit', {blog_id: req.params.id, comment: foundComment});
		}
	})
});

// Comment update route
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	});
});

// Comment destroy route
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	// find by the given ID and destroy
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			res.redirect('back');
		} else {
			res.redirect('/blogs/' + req.params.id);
		}
	})
});

module.exports = router;
