const forumService = require('../services/forumService');

class ForumController {
    async getPosts(req, res) {
        try {
            const { contentId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const userId = req.user.id;
            
            const result = await forumService.getPosts(contentId, userId, page, limit);
            
            if (!result.success) {
                return res.status(500).json({ success: false, error: result.error });
            }
            
            res.json({ 
                success: true, 
                posts: result.posts,
                pagination: result.pagination
            });
        } catch (error) {
            console.error('Error in ForumController.getPosts:', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }

    async createPost(req, res) {
        try {
            const { contentId } = req.params;
            const { message } = req.body;
            const userId = req.user.id;

            if (!message || message.trim() === '') {
                return res.status(400).json({ success: false, error: 'El mensaje no puede estar vacío' });
            }

            const result = await forumService.createPost(contentId, userId, message);
            
            if (!result.success) {
                return res.status(500).json({ success: false, error: result.error });
            }
            
            res.status(201).json({ success: true, postId: result.postId });
        } catch (error) {
            console.error('Error in ForumController.createPost:', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }

    async createReply(req, res) {
        try {
            const { contentId, postId } = req.params;
            const { message } = req.body;
            const userId = req.user.id;

            if (!message || message.trim() === '') {
                return res.status(400).json({ success: false, error: 'El mensaje no puede estar vacío' });
            }

            const result = await forumService.createReply(contentId, userId, postId, message);
            
            if (!result.success) {
                return res.status(400).json({ success: false, error: result.error });
            }
            
            res.status(201).json({ success: true, postId: result.postId });
        } catch (error) {
            console.error('Error in ForumController.createReply:', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }

    async deletePost(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user.id;
            const userRole = req.user.role;

            const result = await forumService.deletePost(postId, userId, userRole);
            
            if (!result.success) {
                return res.status(403).json({ success: false, error: result.error });
            }
            
            res.json({ success: true, message: 'Mensaje eliminado correctamente' });
        } catch (error) {
            console.error('Error in ForumController.deletePost:', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
    async toggleUpvote(req, res) {
        try {
            const { postId } = req.params;
            const userId = req.user.id;

            const result = await forumService.toggleUpvote(postId, userId);
            
            if (!result.success) {
                return res.status(400).json({ success: false, error: result.error });
            }
            
            res.json({ success: true, action: result.action });
        } catch (error) {
            console.error('Error in ForumController.toggleUpvote:', error);
            res.status(500).json({ success: false, error: 'Error del servidor' });
        }
    }
}

module.exports = new ForumController();
