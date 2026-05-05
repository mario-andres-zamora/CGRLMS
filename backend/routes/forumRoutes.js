const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { authMiddleware } = require('../middleware/auth');

// All forum routes require authentication
router.use(authMiddleware);

// Get posts for a specific lesson content
router.get('/:contentId/posts', forumController.getPosts);

// Create a new post in a specific lesson content
router.post('/:contentId/posts', forumController.createPost);

// Reply to an existing post
router.post('/:contentId/posts/:postId/reply', forumController.createReply);

// Delete a post
router.delete('/posts/:postId', forumController.deletePost);

// Toggle upvote on a post
router.post('/:contentId/posts/:postId/upvote', forumController.toggleUpvote);

module.exports = router;
