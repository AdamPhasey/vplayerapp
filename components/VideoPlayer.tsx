'use client';

import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { getYouTubeVideoId } from '@/utils/youtube';


interface Video {
  id: string;
  url: string;
  title: string;
}

const VideoWrapper = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100vh',
  overflow: 'hidden',
});

const VideoElement = styled('video')({
  width: '100%',
  height: 'calc(100% - 64px)', // Adjust height to make space for the info bar
  objectFit: 'cover',
});

const VideoInfoBar = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '16px',
  backgroundColor: '#f5f5f5',
  color: '#333',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '64px',
});

const VideoPlayer: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);



  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/videos');
      const data = await response.json();
      const videosWithDirectUrl = await Promise.all(
        data.map(async (video: Video) => {
          if (video.url.includes('youtube.com')) {
            const proxyResponse = await fetch(`/api/proxy?url=${encodeURIComponent(video.url)}`);
            const videoInfo = await proxyResponse.json();
            video.url = videoInfo.url;
            video.title = videoInfo.title;
          }
          return video;
        })
      );
      setVideos(videosWithDirectUrl);
      console.log('Fetched videos:', videosWithDirectUrl)
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleSwipeUp = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const handleDoubleTap = () => {
    setIsLiked((prevLiked) => !prevLiked);
  };

  const swipeHandlers = useSwipeable({
    onSwipedUp: handleSwipeUp,
  });


  return (
    <VideoWrapper {...swipeHandlers} onDoubleClick={handleDoubleTap}>
  {videos.length > 0 && (
    <iframe
      width="100%"
      height="100%"
      src={videos[currentIndex].url}
      allowFullScreen
      autoplay
    ></iframe>
  )}
      {videos.length > 0 && (
        <VideoInfoBar>
          <Typography variant="subtitle1">{videos[currentIndex].title}</Typography>
          {isLiked && <Typography variant="subtitle2">Liked!</Typography>}
        </VideoInfoBar>
      )}
    </VideoWrapper>
  );
};

export default VideoPlayer;