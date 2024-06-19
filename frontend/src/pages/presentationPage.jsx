import React from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';
import Slides from './slides';
import { fileToDataUrl } from '../helper';
import IconButton from '@mui/material/IconButton';
import DoorBackIcon from '@mui/icons-material/DoorBack';
import DeleteIcon from '@mui/icons-material/Delete';
import LandscapeIcon from '@mui/icons-material/Landscape';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const TitleHeading = styled('span')({
  textAlign: 'center',
  fontSize: '4.5vw',
  fontWeight: 'bold',
});

const EditImage = styled('img')({
  width: '1.7vw',
});

const TitleWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
});

const IconText = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '0.4em'
})

function PresentationPage ({ token }) {
  if (token === null) {
    return <Navigate to='/login'/>;
  }

  // navigation and parameters
  const params = useParams();
  const navigate = useNavigate();

  // use States
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [textInput, setTextInput] = React.useState('');
  const [thumbnailModalOpen, setThumbnailModalOpen] = React.useState(false);
  const [imgInput, setImgInput] = React.useState('');

  // Rendering presentation name
  React.useEffect(() => {
    const getCurrentPresentationName = async () => {
      try {
        const presentations = await getPresentations();
        const currPresentation = presentations.filter(pres => pres.id === params.id);
        const currName = currPresentation[0].name;
        setTextInput(currName);
      } catch (err) {
        alert(err.response.data.error);
      }
    };

    getCurrentPresentationName();
  }, []);

  // Toggles for modals
  const toggleEditTitleModal = () => {
    setEditModalOpen(!editModalOpen);
  }

  const toggleEditThumbnailModal = () => {
    setThumbnailModalOpen(!thumbnailModalOpen);
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  // Navigates to dashboard
  const goToDashboard = () => {
    navigate('/dashboard');
  }

  // sets an input change for the heading
  const inputTextChange = (event) => {
    setTextInput(event.target.value);
  }

  // sets change of thumbnail
  const inputImgChange = async (event) => {
    const targetFile = event.target.files[0];
    const encoded = await fileToDataUrl(targetFile);
    setImgInput(encoded);
  }

  // function that retrieves all presentations in datastore.
  const getPresentations = async () => {
    try {
      const res = await axios.get('http://localhost:5005/store', {
        headers: {
          Authorization: token,
        }
      });
      const ret = res.data.store.presentations;
      if (ret === undefined) {
        alert('Presentations should not be empty when deleting');
        return [];
      } else {
        return ret;
      }
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  // function that puts back the presentation array into the datastore.
  const putPresentations = async (presentationArray) => {
    const requestBody = {
      store: {
        presentations: presentationArray
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
  }

  // Make a get request to the backend, delete the required presentation and put the new presentations into the backend
  const deletePresentation = async () => {
    let presentations = await getPresentations();
    presentations = presentations.filter(pres => pres.id !== params.id);
    await putPresentations(presentations);
    goToDashboard();
  }

  // Function that sets the format of the Title Bar
  const TitleBar = () => {
    return (
    <>
      <TitleWrapper
        sx={{
          borderBottom: 'solid lightgrey 1px'
        }}
      >
        <IconButton
          aria-label="back"
          onClick={goToDashboard}
          sx={{
            ml: '15px',
            mr: '15px',
          }}
        >
          <IconText>
            <DoorBackIcon />
            <p>Back To Dashboard</p>
          </IconText>
        </IconButton>
        <div>
          <IconButton aria-label="edit-thumbnail" onClick={toggleEditThumbnailModal}>
            <LandscapeIcon />
          </IconButton>
          <TitleHeading>{textInput}</TitleHeading>&nbsp;&nbsp;
          <IconButton href="#" onClick={toggleEditTitleModal}>
            <EditImage src="/images/edit-icon.jpg" alt="edit-icon" onClick={toggleEditTitleModal}/>
          </IconButton>
        </div>
        <IconButton
          aria-label="delete-presentation"
          onClick={toggleModal}
          sx={{
            ml: '15px',
            mr: '15px',
          }}
        >
          <IconText>
            <DeleteIcon />
            <p>Delete Presentation</p>
          </IconText>
        </IconButton>
      </TitleWrapper>
    </>
    )
  }

  // Function that updates the presentation name in the data store.
  const updatePresentationName = async () => {
    const currentPresentations = await getPresentations();
    for (const pres of currentPresentations) {
      if (pres.id === params.id) {
        pres.name = textInput;
      }
    }

    putPresentations(currentPresentations);
    toggleEditTitleModal();
  }

  // Function that updates the presentation thumbnail in the data store.
  const updatePresentationThumbnail = async () => {
    const currentPresentations = await getPresentations();
    for (const pres of currentPresentations) {
      if (pres.id === params.id) {
        pres.thumbnail = imgInput;
      }
    }

    putPresentations(currentPresentations);
    toggleEditThumbnailModal();
  }

  return (
    <>
      <TitleBar params={params}></TitleBar>
      <Modal
        open={modalOpen}
        onClose={toggleModal}
      >
        <Box sx={style}>
          <Typography id='presentation-modal-title' variant='h6' component='h2'>
            Are you sure?
          </Typography>
          <Button variant="contained" sx={{ mr: 1 }} onClick={deletePresentation}>Yes</Button>
          <Button variant="outlined" onClick={toggleModal}>No</Button>
        </Box>
      </Modal>

      <Modal
        open={editModalOpen}
        onClose={updatePresentationName}
      >
        <Box sx={style}>
          <Typography id='presentation-edit-modal-title' variant='h6' component='h2'>
            New Title:
          </Typography>
          <TextField
            label="Enter your new presentation name"
            variant="outlined"
            onChange={inputTextChange}
            sx={{ width: '100%' }}
          />
          <Button variant="contained" sx={{ mr: 1 }} onClick={updatePresentationName}>Enter</Button>
        </Box>
      </Modal>

      <Modal
        open={thumbnailModalOpen}
        onClose={toggleEditThumbnailModal}
      >
        <Box sx={style}>
          <Typography id='presentation-edit-thumbnail-title' variant='h6' component='h2'>
            New Thumbnail:
          </Typography>
          <input type="file" onChange={inputImgChange}></input>
          <Button variant="contained" sx={{ mr: 1 }} onClick={updatePresentationThumbnail}>Enter</Button>
        </Box>
      </Modal>
      <Slides token={token}/>
    </>
  )
}

export default PresentationPage;
