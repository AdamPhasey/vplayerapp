'use client';

import React from 'react';
import { Box } from '@mui/material';
import VideoPlayer from '../components/VideoPlayer';

const Home: React.FC = () => {
  return (
    <Box>
      {/* Render the VideoPlayer component for each video */}
      <VideoPlayer />
    </Box>
  );
};

export default Home;