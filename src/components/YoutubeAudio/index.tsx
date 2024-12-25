import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

interface YouTubeAudioPlayerProps {
  videoId: string;
  isPlaying: boolean;
}

const YouTubeAudioPlayer: React.FC<YouTubeAudioPlayerProps> = ({ videoId, isPlaying }) => {
  const playerRef = useRef<any>(null);
  const isPlayerReady = useRef(false);


  const loadYouTubeAPI = () => {
    console.log('Loading YouTube IFrame API...');
    if (!document.getElementById('youtube-iframe-api')) {
      const script = document.createElement('script');
      script.id = 'youtube-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
    }

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API is ready.');
      initializePlayer();
    };
  };

  const initializePlayer = () => {
    console.log('Initializing player with videoId:', videoId);
    
    // Ensure we don't have an existing player
    if (playerRef.current) {
      playerRef.current.destroy();
    }
  
    playerRef.current = new window.YT.Player('youtube-player', {
      height: '0',
      width: '0',
      videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        showinfo: 0,
        modestbranding: 1,
        disablekb: 1,
      },
      events: {
        onReady: () => {
          console.log('Player is ready.');
          isPlayerReady.current = true;
          if (isPlaying) {
            playerRef.current.playVideo();
          } else {
            playerRef.current.pauseVideo();
          }
        },
        onError: (event: any) => {
          console.error('Error occurred:', event.data);
          isPlayerReady.current = false;
        },
      },
    });
  };

  useEffect(() => {
    if (isPlaying && !playerRef.current) {
      if (!window.YT) {
        loadYouTubeAPI();
      } else {
        initializePlayer();
      }
    }
  
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
        isPlayerReady.current = false;
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (playerRef.current && isPlayerReady.current) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);
  
  useEffect(() => {
    if (playerRef.current && isPlayerReady.current) {
      playerRef.current.loadVideoById(videoId);
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [videoId]);

  return <div id="youtube-player" />;
};

export default YouTubeAudioPlayer;