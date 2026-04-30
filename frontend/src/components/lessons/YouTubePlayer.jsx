import { useEffect, useRef } from 'react';

export default function YouTubePlayer({ id, videoId, onEnded, ytApiLoaded, isWatched, isRequired }) {
    const playerRef = useRef(null);
    const lastTimeRef = useRef(0);
    const onEndedRef = useRef(onEnded);

    useEffect(() => {
        onEndedRef.current = onEnded;
    }, [onEnded]);

    useEffect(() => {
        if (!ytApiLoaded || !videoId) return;

        let player;
        let interval;
        
        const initPlayer = () => {
            player = new window.YT.Player(`yt-player-${id}`, {
                videoId: videoId,
                width: '100%',
                height: '100%',
                playerVars: {
                    'rel': 0,
                    'modestbranding': 1,
                    'controls': 1 // Controls are always visible now
                },
                events: {
                    'onStateChange': (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            const duration = player.getDuration();
                            // Only mark as watched if they actually reached the end legitimately
                            // If isRequired is false, we always allow it
                            if (!isRequired || isWatched || lastTimeRef.current >= duration - 3) {
                                onEndedRef.current();
                            } else {
                                // User skipped to the end illegally
                                player.seekTo(lastTimeRef.current);
                                player.playVideo();
                            }
                        }
                    }
                }
            });
            playerRef.current = player;

            // Monitor seeking forward only if it's REQUIRED and not watched
            if (isRequired && !isWatched) {
                interval = setInterval(() => {
                    if (player && player.getCurrentTime) {
                        const currentTime = player.getCurrentTime();
                        // If they skip ahead more than 2 seconds from the last recorded max time
                        if (currentTime > lastTimeRef.current + 2) {
                            player.seekTo(lastTimeRef.current);
                        } else {
                            if (currentTime > lastTimeRef.current) {
                                lastTimeRef.current = currentTime;
                            }
                        }
                    }
                }, 1000);
            }
        };

        // Small delay to ensure container is ready in DOM
        const timer = setTimeout(initPlayer, 100);
        return () => {
            clearTimeout(timer);
            if (interval) clearInterval(interval);
            if (player && player.destroy) player.destroy();
        };
    }, [videoId, ytApiLoaded, id, isWatched]);

    return (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <div id={`yt-player-${id}`} className="w-full h-full"></div>
            {!ytApiLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm transition-all animate-pulse">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Cargando YouTube...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
