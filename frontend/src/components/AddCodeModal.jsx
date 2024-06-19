import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, Box, Typography, TextField, Button, styled } from '@mui/material';
import axios from 'axios';
import LanguagesSelector from './LanguagesSelector';
import { Editor } from '@monaco-editor/react';

const addCodeStyle = {
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

const EditCodeTools = styled('div')({
  margin: '10px 0px',
  display: 'flex',
  flexDirection: 'row',
})

// Function that adds code into the slide
function AddCodeModal ({ token, isOpen, onClose, presentationid, setCodeModalOpen, setElementAddedToggle, elementAddedToggle }) {
  // use states
  const [value, setValue] = React.useState('');
  const [language, setLanguage] = React.useState('javascript');
  const [widthInput, setWidthInput] = React.useState('');
  const [heightInput, setHeightInput] = React.useState('');
  const [fontSizeInput, setFontSizeInput] = React.useState('');
  const params = useParams();
  const editorRef = useRef();

  // Function that sets width of code
  const inputWidthChange = (event) => {
    setWidthInput(event.target.value);
  }

  // Function that sets height of code
  const inputHeightChange = (event) => {
    setHeightInput(event.target.value);
  }

  // Function that sets font size of code
  const inputFontSizeChange = (event) => {
    setFontSizeInput(event.target.value);
  }

  // Function that closes the modal
  const closeModal = () => {
    setCodeModalOpen(false);
  }

  // If modal is closed, do not open
  if (isOpen === false) {
    return <></>
  }

  // Function that adds the code element into the data store
  const addCodeIntoPresentation = async (codeBox) => {
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
        slide.elements.push(codeBox);

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

  // Function that creates a code element to add into datastore, and closes modal
  const handleClose = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const codeId = `${params.id}-${params.slidenum}-code-${randomNum}`;
    const codeElement = {
      elementId: codeId,
      type: 'code',
      content: value,
      lang: language,
      width: widthInput,
      height: heightInput,
      fontSize: fontSizeInput,
      left: '0',
      top: '0',
    };
    addCodeIntoPresentation(codeElement);
    setValue('');

    onClose();
  }

  // Mounting system for specifying the code block that is being created
  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  }

  // Function which sets the language of the code element.
  const onSelect = (language) => {
    setLanguage(language);
  }

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-add-code-title"
      aria-describedby="modal-add-code-description"
    >
      <Box sx={addCodeStyle}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Code
        </Typography>
        <Box mt={2}>
          <LanguagesSelector language={language} onSelect={onSelect} />
          <Box mt={2}>
            <Editor
            height="10vh"
            language={language}
            onMount={onMount}
            value={value}
            onChange={((value) => setValue(value))}
            />
          </Box>
          <EditCodeTools>
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
          </EditCodeTools>
          <EditCodeTools>
            <TextField
              id="outlined-basic"
              label="Enter Font Size"
              variant="outlined"
              onChange={inputFontSizeChange}
              sx={{ width: '100%' }}
            />
          </EditCodeTools>
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

export default AddCodeModal;
