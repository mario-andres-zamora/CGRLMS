import { useState, useEffect } from 'react';

/**
 * Custom hook to manage the logic and state of the Terms Trap activity.
 * Handles failure state, point calculation with penalties, and UI transitions.
 * 
 * @param {Object} item - The lesson content item object
 * @param {Function} markLinkAsVisited - Function to trace progress in the backend
 * @returns {Object} State and actions for the activity
 */
export function useTermsTrap(item, markLinkAsVisited) {
    const isCompleted = !!item.isCompleted;
    
    // PENALTY_FACTOR: How much of the total points are awarded after a failure.
    // Currently set to 0.4 (40%) as requested by the user.
    const PENALTY_FACTOR = 0.4;

    const [state, setState] = useState(isCompleted ? 'winner' : 'initial'); // 'initial', 'alert', 'winner'
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [isShaking, setIsShaking] = useState(false);
    const [accepted, setAccepted] = useState(false);
    
    // Initialize hasFailed based on backend status if available
    const [hasFailed, setHasFailed] = useState(item.interactionData?.status === 'completed_after_failure');

    // Calculate current points based on failure state
    const earnedPoints = hasFailed 
        ? Math.round((item.points || 0) * PENALTY_FACTOR) 
        : (item.points || 0);

    // Sync state with completion on external updates (like page refresh)
    useEffect(() => {
        if (isCompleted && state !== 'winner') {
            setState('winner');
        }
    }, [isCompleted]);

    const handleAccept = () => {
        setIsShaking(true);
        setAccepted(true);
        setHasFailed(true);
        setState('alert');
        
        // Stop shaking after animation
        setTimeout(() => setIsShaking(false), 500);
    };

    const handleReject = (onSuccess) => {
        setState('winner');
        
        // Final points calculation using the defined factor
        const pointsToAward = hasFailed 
            ? Math.round((item.points || 0) * PENALTY_FACTOR) 
            : (item.points || 0);

        markLinkAsVisited(item.id, {
            status: hasFailed ? 'completed_after_failure' : 'success',
            points: pointsToAward,
            timestamp: new Date().toISOString()
        });

        if (onSuccess) onSuccess();
    };

    const resetActivity = () => {
        setState('initial');
        setAccepted(false);
        // Note: hasFailed is NOT reset to ensure the penalty persists in the current session
    };

    return {
        state,
        setState,
        showTerms,
        setShowTerms,
        showPrivacy,
        setShowPrivacy,
        isShaking,
        setIsShaking,
        accepted,
        setAccepted,
        hasFailed,
        setHasFailed,
        earnedPoints,
        handleAccept,
        handleReject,
        resetActivity
    };
}
