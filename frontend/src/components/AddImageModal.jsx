import React from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { fileToDataUrl } from '../helper';

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

// Function that adds Image into the data store
function AddImageModal ({ token, isOpen, onClose, presentationid, elementAddedToggle, setElementAddedToggle }) {
  // use states
  const [imgInput, setImgInput] = React.useState('');
  const [altInput, setAltInput] = React.useState('');
  const [imgWidth, setImgWidth] = React.useState('');
  const [imgHeight, setImgHeight] = React.useState('');

  // parameters
  const params = useParams();

  // Upon upload action of file change the state of inputImg to base64 encoding of image
  const inputImgChange = async (event) => {
    const targetFile = event.target.files[0];
    const encoded = await fileToDataUrl(targetFile);
    setImgInput(encoded);
  }

  // Function that sets an alt text for the image
  const altImgChange = (event) => {
    setAltInput(event.target.value);
  }

  // Function that adds image into the data store.
  const addImageIntoPresentation = async (imgBox) => {
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
        slide.elements.push(imgBox);

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

  // closes modal
  const closeModal = () => {
    onClose();
  }

  // Function that sets the image width
  const handleImageWidthChange = (event) => {
    setImgWidth(event.target.value);
  }

  // Function that sets the image height
  const handleImageHeightChange = (event) => {
    setImgHeight(event.target.value);
  }

  // Function that creates an object to be stored into the data store, and closes modal
  const handleClose = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const imageId = `${params.id}-${params.slidenum}-image-${randomNum}`;

    const textElement = {
      elementId: imageId,
      type: 'image',
      url: imgInput,
      alt: altInput,
      width: imgWidth,
      height: imgHeight,
      left: '0',
      top: '0',
    };

    addImageIntoPresentation(textElement);
    onClose();
  }

  // If modal is closed, do not open the modal.
  if (isOpen === false) {
    return <></>
  }

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-add-image-title"
      aria-describedby="modal-add-image-description"
    >
      <Box sx={modalStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Upload Image
        </Typography>
        <Box mt={2}>
          <input type="file" onChange={inputImgChange}></input>
          <TextField
            id="outlined-basic"
            label="Enter alt tag"
            variant="outlined"
            onChange={altImgChange}
            sx={{ width: '100%' }}
          />
          <TextField
            id="outlined-basic"
            label="Enter Width"
            variant="outlined"
            onChange={handleImageWidthChange}
            sx={{ width: '50%', display: 'inline-block' }}
          />
          <TextField
            id="outlined-basic"
            label="Enter Height"
            variant="outlined"
            onChange={handleImageHeightChange}
            sx={{ width: '50%', display: 'inline-block' }}
          />
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

export default AddImageModal;
