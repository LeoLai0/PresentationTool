import React from 'react';
// import { styled } from '@mui/system'
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Card component imported from material UI
const PresentationBox = ({ presentation }) => {
  const navigate = useNavigate();
  const goToPresentationPage = () => {
    navigate(`/presentation/${presentation.id}`);
  };

  let imgSrc = '/images/grey-default-thumbnail.jpg';

  if (presentation.thumbnail !== null) {
    imgSrc = presentation.thumbnail;
  }

  return (
    <Card sx={{
      width: '100%',
      aspectRatio: '2/1'
    }}>
      <CardActionArea sx={{ height: '100%' }} onClick={goToPresentationPage}>
        <CardMedia
          component='img'
          image={imgSrc}
          sx={{ width: '100%', height: '60%' }}
        />
        <CardContent sx = {{ padding: '0 0', height: '40%', overflow: 'auto' }}>
          <Typography variant='h5' component='h2' sx={{ fontSize: '1.1em' }}>
            {presentation.name}
          </Typography>
          <Typography color='text.secondary' gutterBottom sx={{ fontSize: '0.8em' }}>
            Number of slides: {presentation.no_slides}
          </Typography>
          <Typography variant='body2' component='p' sx={{ fontSize: '0.8em' }}>
            {presentation.description || ''}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PresentationBox;
