const db = require('../config/database');
const logger = require('../config/logger');
const { clearCache } = require('../middleware/cache');

class ForumService {
    async getPosts(contentId, userId) {
        try {
            // Get all posts for a content_id, join with users to get details
            const query = `
                SELECT 
                    fp.id, 
                    fp.content_id, 
                    fp.user_id, 
                    fp.parent_id, 
                    fp.message, 
                    fp.created_at, 
                    fp.updated_at,
                    u.first_name, 
                    u.last_name, 
                    u.profile_picture,
                    u.role,
                    up.level,
                    up.points,
                    (SELECT COUNT(*) FROM forum_post_upvotes fpu WHERE fpu.post_id = fp.id) as upvotes,
                    (SELECT COUNT(*) FROM forum_post_upvotes fpu WHERE fpu.post_id = fp.id AND fpu.user_id = ?) as has_upvoted
                FROM forum_posts fp
                JOIN users u ON fp.user_id = u.id
                LEFT JOIN user_points up ON u.id = up.user_id
                WHERE fp.content_id = ?
                ORDER BY fp.created_at ASC
            `;
            const rows = await db.query(query, [userId || 0, contentId]);

            // Build a tree of posts
            const postsMap = new Map();
            const rootPosts = [];

            // Initialize all posts in map and add a replies array
            rows.forEach(row => {
                postsMap.set(row.id, { 
                    ...row, 
                    has_upvoted: !!row.has_upvoted,
                    replies: [] 
                });
            });

            // Populate replies or add to root
            rows.forEach(row => {
                const post = postsMap.get(row.id);
                if (row.parent_id) {
                    const parent = postsMap.get(row.parent_id);
                    if (parent) {
                        parent.replies.push(post);
                    } else {
                        // Parent was deleted, but this shouldn't happen with CASCADE, but just in case:
                        rootPosts.push(post);
                    }
                } else {
                    rootPosts.push(post);
                }
            });

            return { success: true, posts: rootPosts };
        } catch (error) {
            console.error('Error fetching forum posts:', error);
            return { success: false, error: 'Error al obtener los mensajes del foro' };
        }
    }

    async createPost(contentId, userId, message) {
        try {
            const query = `
                INSERT INTO forum_posts (content_id, user_id, message)
                VALUES (?, ?, ?)
            `;
            const result = await db.query(query, [contentId, userId, message]);
            
            // Recompensas: Puntos por Post
            try {
                const [content] = await db.query('SELECT data FROM lesson_contents WHERE id = ?', [contentId]);
                if (content && content.data) {
                    const data = typeof content.data === 'string' ? JSON.parse(content.data) : content.data;
                    const points = parseInt(data.postPoints) || 0;
                    const maxPosts = parseInt(data.maxAwardedPosts) || 0; // 0 = sin límite
                    
                    if (points > 0) {
                        let shouldAward = true;
                        if (maxPosts > 0) {
                            const [pastActivities] = await db.query(
                                "SELECT COUNT(*) as count FROM gamification_activities WHERE user_id = ? AND activity_type = 'forum_post' AND reference_id = ?",
                                [userId, contentId]
                            );
                            if (pastActivities && pastActivities.count >= maxPosts) {
                                shouldAward = false;
                            }
                        }

                        if (shouldAward) {
                            await db.query(
                                `INSERT INTO gamification_activities (user_id, activity_type, points_earned, reference_id) 
                                 VALUES (?, 'forum_post', ?, ?)`,
                                [userId, points, contentId]
                            );

                            await db.query(
                                `INSERT INTO user_points (user_id, points) VALUES (?, ?) ON DUPLICATE KEY UPDATE points = points + ?`,
                                [userId, points, points]
                            );
                            
                            const { syncUserLevel } = require('../utils/gamification');
                            await syncUserLevel(userId);
                        }
                    }
                }
            } catch (gamificationErr) {
                logger.error('Error procesando gamificación de post de foro:', gamificationErr);
            }

            return { success: true, postId: result.insertId };
        } catch (error) {
            console.error('Error creating forum post:', error);
            return { success: false, error: 'Error al crear el mensaje' };
        }
    }

    async createReply(contentId, userId, parentId, message) {
        try {
            // Verify parent exists and belongs to the same contentId
            const [parent] = await db.query('SELECT id FROM forum_posts WHERE id = ? AND content_id = ?', [parentId, contentId]);
            if (!parent) {
                return { success: false, error: 'El mensaje al que intentas responder no existe.' };
            }

            const query = `
                INSERT INTO forum_posts (content_id, user_id, parent_id, message)
                VALUES (?, ?, ?, ?)
            `;
            const result = await db.query(query, [contentId, userId, parentId, message]);
            
            // Recompensas: Puntos por Reply
            try {
                const [content] = await db.query('SELECT data FROM lesson_contents WHERE id = ?', [contentId]);
                if (content && content.data) {
                    const data = typeof content.data === 'string' ? JSON.parse(content.data) : content.data;
                    const points = parseInt(data.replyPoints) || 0;
                    const maxReplies = parseInt(data.maxAwardedReplies) || 0; // 0 = sin límite
                    
                    if (points > 0) {
                        let shouldAward = true;
                        if (maxReplies > 0) {
                            const [pastActivities] = await db.query(
                                "SELECT COUNT(*) as count FROM gamification_activities WHERE user_id = ? AND activity_type = 'forum_reply' AND reference_id = ?",
                                [userId, contentId]
                            );
                            if (pastActivities && pastActivities.count >= maxReplies) {
                                shouldAward = false;
                            }
                        }

                        if (shouldAward) {
                            await db.query(
                                `INSERT INTO gamification_activities (user_id, activity_type, points_earned, reference_id) 
                                 VALUES (?, 'forum_reply', ?, ?)`,
                                [userId, points, contentId]
                            );

                            await db.query(
                                `INSERT INTO user_points (user_id, points) VALUES (?, ?) ON DUPLICATE KEY UPDATE points = points + ?`,
                                [userId, points, points]
                            );
                            
                            const { syncUserLevel } = require('../utils/gamification');
                            await syncUserLevel(userId);
                        }
                    }
                }
            } catch (gamificationErr) {
                logger.error('Error procesando gamificación de reply de foro:', gamificationErr);
            }

            return { success: true, postId: result.insertId };
        } catch (error) {
            console.error('Error creating forum reply:', error);
            return { success: false, error: 'Error al enviar la respuesta' };
        }
    }

    async deletePost(postId, userId, userRole) {
        try {
            // Only the author or an admin can delete a post
            const [post] = await db.query('SELECT user_id FROM forum_posts WHERE id = ?', [postId]);
            
            if (!post) {
                return { success: false, error: 'Mensaje no encontrado' };
            }

            if (post.user_id !== userId && userRole !== 'admin') {
                return { success: false, error: 'No tienes permisos para eliminar este mensaje' };
            }

            await db.query('DELETE FROM forum_posts WHERE id = ?', [postId]);
            return { success: true };
        } catch (error) {
            console.error('Error deleting forum post:', error);
            return { success: false, error: 'Error al eliminar el mensaje' };
        }
    }
    async toggleUpvote(postId, userId) {
        try {
            const [existing] = await db.query('SELECT id FROM forum_post_upvotes WHERE post_id = ? AND user_id = ?', [postId, userId]);
            
            if (existing) {
                // Remove upvote
                await db.query('DELETE FROM forum_post_upvotes WHERE id = ?', [existing.id]);
                return { success: true, action: 'removed' };
            } else {
                // Add upvote
                await db.query('INSERT INTO forum_post_upvotes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
                return { success: true, action: 'added' };
            }
        } catch (error) {
            console.error('Error toggling forum upvote:', error);
            return { success: false, error: 'Error al registrar el voto' };
        }
    }
}

module.exports = new ForumService();
