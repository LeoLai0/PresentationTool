import React from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Box, Typography, TextField, Button, styled } from '@mui/material';
import axios from 'axios';

const addTextStyle = {
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

const EditTextTools = styled('div')({
  margin: '10px 0px',
  display: 'flex',
  flexDirection: 'row',
})

// Function that adds text into the data store
function AddTextModal ({ token, isOpen, onClose, presentationid, setTextModalOpen, setElementAddedToggle, elementAddedToggle }) {
  // use states
  const [textInput, setTextInput] = React.useState('');
  const [widthInput, setWidthInput] = React.useState('');
  const [heightInput, setHeightInput] = React.useState('');
  const [fontSizeInput, setFontSizeInput] = React.useState('');
  const [textColorInput, setTextColorInput] = React.useState('');
  const params = useParams();

  // Function that sets input
  const inputTextChange = (event) => {
    setTextInput(event.target.value);
  }

  // Function that sets width
  const inputWidthChange = (event) => {
    setWidthInput(event.target.value);
  }

  // Function that sets height
  const inputHeightChange = (event) => {
    setHeightInput(event.target.value);
  }

  // Function that sets Font Size
  const inputFontSizeChange = (event) => {
    setFontSizeInput(event.target.value);
  }

  // Function that sets text colour given a HEX code
  const inputTextColorChange = (event) => {
    setTextColorInput(event.target.value);
  }

  // Function that closes modal
  const closeModal = () => {
    setTextModalOpen(false);
  }

  // If modal is closed, do not open the modal
  if (isOpen === false) {
    return <></>
  }

  // Function that adds the new text element into the data store.
  const addTextIntoPresentation = async (textBox) => {
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
        slide.elements.push(textBox);

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
        return slide.elements.length;
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
    const textId = `${params.id}-${params.slidenum}-text-${randomNum}`;
    const textElement = {
      elementId: textId,
      type: 'text',
      content: textInput,
      width: widthInput,
      height: heightInput,
      fontSize: fontSizeInput,
      textColor: textColorInput,
      left: '0',
      top: '0',
    };
    addTextIntoPresentation(textElement);

    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-add-text-title"
      aria-describedby="modal-add-text-description"
    >
      <Box sx={addTextStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Text
        </Typography>
        <Box mt={2}>
          <TextField
            id="outlined-basic"
            label="Enter Text"
            variant="outlined"
            onChange={inputTextChange}
            sx={{ width: '100%' }}
          />
          <EditTextTools>
            <TextField
              id="outlined-basic"
              label="Enter Box Width"
              variant="outlined"
              onChange={inputWidthChange}
              sx={{ width: '100%' }}
            />
            <TextField
              id="outlined-basic"
              label="Enter Box Height"
              variant="outlined"
              onChange={inputHeightChange}
              sx={{ width: '100%' }}
            />
          </EditTextTools>
          <EditTextTools>
            <TextField
              id="outlined-basic"
              label="Enter Font Size"
              variant="outlined"
              onChange={inputFontSizeChange}
              sx={{ width: '100%' }}
            />
            <TextField
              id="outlined-basic"
              label="Enter Text Color"
              variant="outlined"
              onChange={inputTextColorChange}
              sx={{ width: '100%' }}
            />
          </EditTextTools>
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

export default AddTextModal;
