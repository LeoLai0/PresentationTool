import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// Function which opens the modal to take input for uploading a video onto the slide.
function AddVideoModal ({ token, isOpen, onClose, presentationid, elementAddedToggle, setElementAddedToggle }) {
  if (isOpen === false) {
    return <></>
  }

  // use states
  const [videoUrl, setVideoUrl] = React.useState('');
  const [videoWidth, setVideoWidth] = React.useState('');
  const [videoHeight, setVideoHeight] = React.useState('');
  const [autoplay, setAutoplay] = React.useState(false);

  // parameter
  const params = useParams();

  // Function which allows for taking in a URL for input
  const inputVideoChange = (event) => {
    setVideoUrl(event.target.value);
  }

  // Function which allows for setting video width
  const handleVideoWidthChange = (event) => {
    setVideoWidth(event.target.value);
  }

  // Function which allows for setting video height
  const handleVideoHeightChange = (event) => {
    setVideoHeight(event.target.value);
  }

  // Function which allow for setting video width
  const handleCheckboxChange = () => {
    setAutoplay(!autoplay);
  }

  // Function that adds video into presentation
  const addVideoIntoPresentation = async (videoBox) => {
    try {
      const res = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });

      const presentations = res.data.store.presentations;
      const presIndex = presentations.findIndex(pres => pres.id === presentationid);
      if (presIndex !== -1) {
        const presentation = presentations[presIndex];
        const slide = presentation.slides[params.slidenum];
        slide.elements.push(videoBox);

        const newStore = {
          store: {
            presentations,
          }
        };

        await axios.put('http://localhost:5005/store', newStore, {
          headers: {
            Authorization: token,
          }
        });

        setElementAddedToggle(!elementAddedToggle);
      } else {
        console.error('No presentation found with the given ID');
      }
    } catch (error) {
      console.error('Failed to update slide', error);
    }
  }

  // Function that creates an object to be stored into the data store, and closes modal
  const handleClose = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const videoId = `${params.id}-${params.slidenum}-video-${randomNum}`;

    const videoElement = {
      elementId: videoId,
      type: 'video',
      url: videoUrl,
      width: videoWidth,
      height: videoHeight,
      left: '0',
      top: '0',
      auto: autoplay,
    };

    addVideoIntoPresentation(videoElement);
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-add-video-title"
      aria-describedby="modal-add-video-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Upload video
        </Typography>
        <Box mt={2}>
          <TextField
            id="outlined-basic"
            label="Enter embedded Youtube URL"
            variant="outlined"
            onChange={inputVideoChange}
            sx={{ width: '100%' }}
          />
          <TextField
            id="outlined-basic"
            label="Enter Width"
            variant="outlined"
            onChange={handleVideoWidthChange}
            sx={{ width: '50%', display: 'inline-block' }}
          />
          <TextField
            id="outlined-basic"
            label="Enter Height"
            variant="outlined"
            onChange={handleVideoHeightChange}
            sx={{ width: '50%', display: 'inline-block' }}
          />
          <div>
            <input
              type="checkbox"
              checked={autoplay}
              onChange={handleCheckboxChange}
            />
            <label>Autoplay</label>
          </div>
          <Button
            variant="outlined"
            onClick={handleClose}>
            Upload
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddVideoModal;
