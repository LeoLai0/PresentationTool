import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';

const style = {
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

// Opens a modal that allows you to create new presentations with user specified inputs
function NewPresentationModal ({ token, isOpen, onClose, setNewPresentation, presentationArray, newPresentation, setModalOpen }) {
  // use states
  const [textInput, setTextInput] = React.useState('');

  // sets the change for the text input
  const inputTextChange = (event) => {
    setTextInput(event.target.value);
  }

  // Function that adds new presentation into the data store
  const addNewPresentation = async (presentationBox) => {
    const requestBody = {
      store: {
        presentations: [...presentationArray, presentationBox]
      }
    }

    try {
      await axios.put('http://localhost:5005/store', requestBody, {
        headers: {
          Authorization: token,
        }
      })
    } catch (err) {
      alert(err.response.data.error);
    }

    setNewPresentation(!newPresentation);
  }

  // Function that constructs the new presentation to be stored, and closes the modal
  const handleClose = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const presentationName = textInput;
    const newPres = {
      name: presentationName,
      thumbnail: null,
      description: null,
      no_slides: 0,
      slides: [],
      id: presentationName + '-' + randomNum,
    }

    // const presentationBox = <PresentationBox>{presentationName}</PresentationBox>
    addNewPresentation(newPres);

    onClose();
  }

  // Sets the close for modal
  const closeModal = () => {
    setModalOpen(false);
  }

  // checks if the modal is open. If not, do not open modal.
  if (isOpen === false) {
    return <></>
  }

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Name of Presentation
        </Typography>
        <Box mt={2}>
          <TextField
            id="outlined-basic"
            label="Enter your presentation name"
            variant="outlined"
            onChange={inputTextChange}
            sx={{ width: '100%' }}
          />
          <Button
            variant="outlined"
            onClick={handleClose}>
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default NewPresentationModal;
