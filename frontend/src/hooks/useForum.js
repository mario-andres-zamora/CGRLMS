import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const useForum = (contentId) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });

    const fetchPosts = useCallback(async (targetPage = page) => {
        if (!contentId) return;
        setLoading(true);
        try {
            const response = await axios.get(
                `${API_URL}/forums/${contentId}/posts`, 
                { 
                    params: { page: targetPage, limit: 10 },
                    withCredentials: true 
                }
            );
            if (response.data.success) {
                setPosts(response.data.posts);
                setPagination(response.data.pagination);
                setPage(response.data.pagination.page);
                setError(null);
            }
        } catch (err) {
            console.error('Error fetching forum posts:', err);
            setError('Error al cargar los mensajes del foro.');
        } finally {
            setLoading(false);
        }
    }, [contentId, page]);

    useEffect(() => {
        fetchPosts();
    }, [contentId, page]);

    const goToPage = (num) => {
        setPage(num);
    };

    const submitPost = async (message) => {
        try {
            const response = await axios.post(
                `${API_URL}/forums/${contentId}/posts`, 
                { message },
                { withCredentials: true }
            );
            if (response.data.success) {
                await fetchPosts();
                return { success: true };
            }
        } catch (err) {
            console.error('Error submitting post:', err);
            return { success: false, error: err.response?.data?.error || 'Error al publicar el mensaje.' };
        }
    };

    const submitReply = async (postId, message) => {
        try {
            const response = await axios.post(
                `${API_URL}/forums/${contentId}/posts/${postId}/reply`, 
                { message },
                { withCredentials: true }
            );
            if (response.data.success) {
                await fetchPosts();
                return { success: true };
            }
        } catch (err) {
            console.error('Error submitting reply:', err);
            return { success: false, error: err.response?.data?.error || 'Error al publicar la respuesta.' };
        }
    };

    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(
                `${API_URL}/forums/posts/${postId}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                await fetchPosts();
                return { success: true };
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            return { success: false, error: err.response?.data?.error || 'Error al eliminar el mensaje.' };
        }
    };

    const toggleUpvote = async (postId) => {
        // Optimistic update
        const updatePostsArray = (postsArray) => {
            return postsArray.map(post => {
                if (post.id === postId) {
                    return {
                        ...post,
                        has_upvoted: !post.has_upvoted,
                        upvotes: post.has_upvoted ? Math.max(0, post.upvotes - 1) : (post.upvotes + 1)
                    };
                }
                if (post.replies && post.replies.length > 0) {
                    return { ...post, replies: updatePostsArray(post.replies) };
                }
                return post;
            });
        };
        
        setPosts(currentPosts => updatePostsArray(currentPosts));

        try {
            const response = await axios.post(
                `${API_URL}/forums/${contentId}/posts/${postId}/upvote`,
                {},
                { withCredentials: true }
            );
            if (!response.data.success) {
                // Revert on failure
                await fetchPosts();
            }
            return response.data;
        } catch (err) {
            console.error('Error toggling upvote:', err);
            // Revert on failure
            await fetchPosts();
            return { success: false };
        }
    };

    return {
        posts,
        loading,
        error,
        pagination,
        submitPost,
        submitReply,
        deletePost,
        toggleUpvote,
        goToPage,
        refreshPosts: fetchPosts
    };
};
