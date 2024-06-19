import React from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import YouTubeIcon from '@mui/icons-material/YouTube';
import CodeIcon from '@mui/icons-material/Code';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddTextModal from '../components/AddTextModal';
import Draggable from 'react-draggable';
import AddImageModal from '../components/AddImageModal';
import AddCodeModal from '../components/AddCodeModal';
import CodeSyntax from '../components/CodeSyntax'
import AddVideoModal from '../components/AddVideoModal';

const PresentationSlides = styled('div')({
  position: 'relative',
  alignSelf: 'center',
  height: '50%',
  width: '100%',
  border: 'solid lightgrey 0.5px',
  flex: '5',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
});

const leftArrowStyles = {
  fontSize: '1.5em',
  color: 'black',
  zIndex: 1,
  cursor: 'pointer'
}

const rightArrowStyles = {
  fontSize: '1.5em',
  color: 'black',
  zIndex: 1,
  cursor: 'pointer'
}

const ArrowContainer = styled('div')({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'space-between',
  right: '5px',
  bottom: '5px',
  width: '50px'
})

const SlideNumberStyle = styled('div')({
  position: 'absolute',
  left: '0px',
  bottom: '0px',
  margin: '0px 0px 5px 5px',
});

const TextElementStyle = styled('div')(({ width, height, fontSize, textColor }) => ({
  border: '1px solid #bbbbbb',
  position: 'absolute',
  width: `${width}%`,
  height: `${height}%`,
  fontSize: `${fontSize}em`,
  color: textColor,
  overflow: 'hidden',
}));

const ImgElementStyle = styled('div')({
  position: 'absolute',
  overflow: 'hidden',
});

const VideoElementStyle = styled('div')({
  position: 'relative',
  overflow: 'hidden',
});

const StyledVideoElementWrapper = styled('div')(({ width, height }) => ({
  width: `${width}%`,
  height: `${height}%`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'grey',
}));

const CodeElementStyle = styled('div')(({ width, height, fontSize }) => ({
  border: '1px solid #bbbbbb',
  position: 'absolute',
  width: `${width}%`,
  height: `${height}%`,
  fontSize: `${fontSize}em`,
  overflow: 'hidden',
}));

const drawerWidth = 240;
const defaultTheme = createTheme();

const SideDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      whiteSpace: 'nowrap',
      position: 'relative',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: drawerWidth,
      boxSizing: 'border-box',
      ...(!open && {
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// Function that adds slides to the presentation
function Slides ({ token }) {
  if (token === null) {
    return <Navigate to='/login'/>;
  }

  // use states
  const [textModalOpen, setTextModalOpen] = React.useState(false);
  const [slideArray, setSlideArray] = React.useState([]);
  const [slideNum, setSlideNum] = React.useState(0);
  const [elementAddedToggle, setElementAddedToggle] = React.useState(false);
  const [imageModalOpen, setImageModalOpen] = React.useState(false);
  const [codeModalOpen, setCodeModalOpen] = React.useState(false);
  const [videoModalOpen, setVideoModalOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // parameters and navigations
  const params = useParams();
  const presentationid = params.id;
  const navigate = useNavigate();

  // Modal Toggles for opening and closing the modal
  const toggleTextModal = () => {
    setTextModalOpen(!textModalOpen);
  }

  const toggleCodeModal = () => {
    setCodeModalOpen(!codeModalOpen);
  }

  const toggleImageModal = () => {
    setImageModalOpen(!imageModalOpen);
  }

  const toggleVideoModal = () => {
    setVideoModalOpen(!videoModalOpen);
  }

  const toggleDrawer = () => {
    setOpen(!open);
  }

  // Function that adds a slide to the presentation
  const createSlide = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const newSlideId = `${params.id}-slide-${randomNum}`;
    const newSlide = {
      id: newSlideId,
      content: `this is slide ${slideArray.length + 1}`,
      elements: [],
    };
    try {
      putPresentationSlide(newSlide);
      setSlideNum(previd => previd + 1);
      setSlideArray(([...slideArray, newSlide]));
      navigate('/presentation/' + `${presentationid}` + `/${slideArray.length}`);
    } catch (error) {
      console.error('failed to create slide', error);
    }
  }

  // get all presentations from data store
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

  // Function that sets the side drawer contents
  const drawerContent = () => {
    return <>
      <React.Fragment>
        <ListItemButton onClick={createSlide}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Create Slide" />
        </ListItemButton>
        <ListItemButton onClick={deleteSlide}>
          <ListItemIcon>
            <RemoveIcon />
          </ListItemIcon>
          <ListItemText primary="Delete Slide" />
        </ListItemButton>
        <ListItemButton onClick={toggleTextModal}>
          <ListItemIcon>
            <TextFieldsIcon />
          </ListItemIcon>
          <ListItemText primary="Add Text" />
        </ListItemButton>
        <ListItemButton onClick={toggleImageModal}>
          <ListItemIcon>
            <InsertPhotoIcon />
          </ListItemIcon>
          <ListItemText primary="Add Image" />
        </ListItemButton>
        <ListItemButton button onClick={toggleVideoModal}>
          <ListItemIcon>
            <YouTubeIcon />
          </ListItemIcon>
          <ListItemText primary="Add Video" />
        </ListItemButton>
        <ListItemButton button onClick={toggleCodeModal}>
          <ListItemIcon>
            <CodeIcon />
          </ListItemIcon>
          <ListItemText primary="Add Code" />
        </ListItemButton>
      </React.Fragment>
    </>;
  }

  // UseEffect to render the slides
  React.useEffect(() => {
    const fetchSlides = async () => {
      try {
        const presentations = await getPresentations();
        const presentationIndex = presentations.findIndex(pres => pres.id === presentationid);

        if (presentationIndex !== -1) {
          const slides = presentations[presentationIndex].slides;

          setSlideArray(slides);

          // Initialize slide index based on the URL or set to 0 if not specified
          const slideIndexFromURL = parseInt(params.slidenum);
          if (slideIndexFromURL >= 0 && slideIndexFromURL < slides.length) {
            setSlideNum(slideIndexFromURL);
          } else {
            setSlideNum(0);
            navigate(`/presentation/${presentationid}/0`);
          }
        } else {
          console.error('No presentation found with the given ID');
        }
      } catch (error) {
        console.error('Failed to load slides', error);
      }
    };
    fetchSlides();
  }, [presentationid, slideNum, elementAddedToggle]);

  // Function that puts in changes to the slide back into the data store.
  const putPresentationSlide = async (slide) => {
    // Fetch the current store data
    const presentations = await getPresentations();
    const presentationIndex = presentations.findIndex(pres => pres.id === presentationid);

    if (presentationIndex !== -1) {
      const presentation = presentations[presentationIndex];
      presentation.slides = presentation.slides || [];
      presentation.slides.push(slide);
      presentation.no_slides = presentation.slides.length;

      putPresentations(presentations);
    } else {
      console.error('No presentation found with the given ID');
    }
  }

  // Function that deletes a slide
  const deleteSlide = () => {
    deleteSlideRequest(params.slidenum);
    navigate('/presentation/' + `${presentationid}` + `/${params.slidenum - 1}`);
    goToPrevious();
  }

  // Function that runs the request to delete slide
  const deleteSlideRequest = async (positionToDelete) => {
    try {
      // Fetch the current store data
      const presentations = await getPresentations();
      const presentationIndex = presentations.findIndex(pres => pres.id === presentationid);

      if (presentationIndex !== -1) {
        const presentation = presentations[presentationIndex];
        presentation.slides.splice(parseInt(positionToDelete), 1);
        presentation.no_slides = presentation.slides.length;

        putPresentations(presentations);
        setSlideArray(presentation.slides);
        goToPrevious();
        if (slideNum >= presentation.length) {
          setSlideNum(Math.max(0, presentation.length - 1)); // Adjust the slide index if needed
        }
      } else {
        console.error('No presentation found with the given ID');
      }
    } catch (error) {
      console.error('Failed to update presentations', error);
    }
  }

  // Function that allows for traversal to previous slide
  const goToPrevious = () => {
    const isFirstSlide = slideNum === 0;
    if (slideArray.length > 1) {
      const newIndex = isFirstSlide ? 0 : slideNum - 1;
      setSlideNum(newIndex);
      navigate('/presentation/' + `${presentationid}` + `/${newIndex}`);
    } else {
      setSlideNum(0);
    }
  }

  // Function that allows for traversal to next slide
  const goToNext = () => {
    const isLastSlide = slideNum === slideArray.length - 1;
    if (slideArray.length > 1) {
      const newIndex = isLastSlide ? slideArray.length - 1 : slideNum + 1;
      setSlideNum(newIndex);
      navigate('/presentation/' + `${presentationid}` + `/${newIndex}`);
    } else {
      setSlideNum(0);
    }
  }

  // Use Effect to show what tools are available to the user.
  React.useEffect(() => {
    if (textModalOpen || imageModalOpen || videoModalOpen || codeModalOpen) {
      return;
    }
    const handlePressArrowKey = (event) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handlePressArrowKey);
    return () => {
      window.removeEventListener('keydown', handlePressArrowKey);
    };
  }, [goToPrevious, goToNext]);

  // Function which handles right click using mounting.
  React.useEffect(() => {
    let isMounted = true;

    const handleRightClick = async (event) => {
      event.preventDefault();
      const target = event.target.closest('div');
      if (target && window.getComputedStyle(target).border === '1px solid rgb(187, 187, 187)') {
        const presentations = await getPresentations();
        const presentationIndex = presentations.findIndex(pres => pres.id === presentationid);
        if (presentationIndex === -1 || !isMounted) return; // Check if component is still mounted

        const presentation = presentations[presentationIndex];
        const slides = presentation.slides;
        const slide = slides[slideNum];
        slide.elements = slide.elements.filter(e => e.elementId !== target.id);

        putPresentations(presentations);
        if (isMounted) setSlideArray(slides);
      }
    }
    window.addEventListener('contextmenu', handleRightClick);

    return () => {
      window.removeEventListener('contextmenu', handleRightClick);
      isMounted = false;
    }
  }, [slideArray]);

  // function which logs the position of the item after dragging.
  const handleStop = async (id, data) => {
    const presentations = await getPresentations();
    const presentationIndex = presentations.findIndex(pres => pres.id === presentationid);
    const presentation = presentations[presentationIndex];
    const slides = presentation.slides;
    slides.map(slide => {
      return {
        ...slide,
        elements: slide.elements.map(e1 => {
          if (e1.elementId === id) {
            e1.top = `${data.y}`;
            e1.left = `${data.x}`;
            return e1;
          }
          return e1;
        })
      };
    });

    try {
      putPresentations(presentations);
      setSlideArray(slides);
    } catch (error) {
      console.error('Failed to save element position', error);
    }
  }

  // Function which wraps each element in a draggable tag.
  const renderSlideElements = (slide) => {
    return slide.elements.map((element, index) => {
      switch (element.type) {
        case 'text':
          return (
            <Draggable
              key={element.elementId}
              defaultPosition={{ x: parseInt(element.left), y: parseInt(element.top) }}
              onStop={(e, data) => handleStop(element.elementId, data)}
              bounds="parent"
            >
              <TextElementStyle
                key={index}
                id={element.elementId}
                width={element.width}
                height={element.height}
                fontSize={element.fontSize}
                textColor={element.textColor}
              >
                <p>{element.content}</p>
              </TextElementStyle>
            </Draggable>
          );
        case 'image':
          return (
            <Draggable
              key={element.elementId}
              defaultPosition={{ x: parseInt(element.left), y: parseInt(element.top) }}
              onStop={(e, data) => handleStop(element.elementId, data)}
              bounds="parent"
            >
              <ImgElementStyle
                key={index}
                id={element.elementId}
                style={{ width: `${element.width}%`, height: `${element.height}%` }}
              >
                <img
                  src={element.url}
                  alt={element.alt}
                  style={{ width: '100%', height: '100%' }}
                ></img>
              </ImgElementStyle>
            </Draggable>
          );
        case 'code':
          return (
            <Draggable
              key={index}
              defaultPosition={{ x: parseInt(element.left), y: parseInt(element.top) }}
              onStop={(e, data) => handleStop(element.elementId, data)}
              bounds="parent"
            >
              <CodeElementStyle
                key={index}
                id={element.elementId}
                width={element.width}
                height={element.height}
                fontSize={element.fontSize}
              >
                <CodeSyntax code={element.content} language={element.lang} />
              </CodeElementStyle>
            </Draggable>
          );
        case 'video': {
          const newElementWidth = parseInt(element.width);
          const newElementHeight = parseInt(element.height);
          return (
            <Draggable
              key={element.elementId}
              defaultPosition={{ x: parseInt(element.left), y: parseInt(element.top) }}
              onStop={(e, data) => handleStop(element.elementId, data)}
              bounds="parent"
            >
              <StyledVideoElementWrapper width={newElementWidth} height={newElementHeight}>
                <VideoElementStyle
                  key={index}
                  id={element.elementId}
                  style={{ width: '90%', height: '85%' }}
                >
                  <iframe
                    src={`${element.url}&mute=1${element.auto ? '&autoplay=1' : ''}`}
                    style={{ width: '100%', height: '100%' }}
                  ></iframe>
                </VideoElementStyle>
              </StyledVideoElementWrapper>
            </Draggable>
          );
        } default:
          return null;
      }
    })
  }

  // function which allows for elements to be inserted in the return statement
  const renderSlides = () => {
    const currentSlide = slideArray[slideNum];
    if (!currentSlide) return <p>Slide does not exist</p>;
    return (
      <>
        {renderSlideElements(currentSlide)}
      </>
    );
  };

  const displayIfEmpty = () => {
    if (slideArray.length === 0) {
      return <>
      <p>There are currently no slides in this presentation! Click on the plus button to add a new slide</p>
      </>
    }
  }

  // Display the left arrow based on which slide the user is on.
  const displayLeftArrows = () => {
    if (slideNum > 0 && slideArray.length > 1) {
      return (
        <div className="slides-left-arrow" style={leftArrowStyles} onClick={goToPrevious}>&lt;</div>
      );
    } else if (slideNum === 0) {
      return (
        <div className="slides-left-arrow" style={leftArrowStyles}></div>
      );
    }
  }

  // Display the right arrow based on which slide the user is on.
  const displayRightArrows = () => {
    if (slideNum < slideArray.length - 1) {
      return (
        <div className="slides-right-arrow" style={rightArrowStyles} onClick={goToNext}>&gt;</div>
      );
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <SideDrawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: [1],
            }}
          >
            <IconButton
              onClick={toggleDrawer}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {drawerContent()}
          </List>
        </SideDrawer>

        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '90vh',
            overflow: 'auto',
            display: 'flex',
          }}
        >
          <AddTextModal
            token={token}
            isOpen={textModalOpen}
            onClose={toggleTextModal}
            presentationid={presentationid}
            setTextModalOpen={setTextModalOpen}
            setElementAddedToggle={setElementAddedToggle}
            elementAddedToggle={elementAddedToggle}
          >
          </AddTextModal>
          <AddImageModal
            token={token}
            isOpen={imageModalOpen}
            onClose={toggleImageModal}
            presentationid={presentationid}
            elementAddedToggle={elementAddedToggle}
            setElementAddedToggle={setElementAddedToggle}
          >
          </AddImageModal>
          <AddCodeModal
            token={token}
            isOpen={codeModalOpen}
            onClose={toggleCodeModal}
            presentationid={presentationid}
            setCodeModalOpen={setCodeModalOpen}
            elementAddedToggle={elementAddedToggle}
            setElementAddedToggle={setElementAddedToggle}
          >
          </AddCodeModal>
          <AddVideoModal
            token={token}
            isOpen={videoModalOpen}
            onClose={toggleVideoModal}
            presentationid={presentationid}
            elementAddedToggle={elementAddedToggle}
            setElementAddedToggle={setElementAddedToggle}
          >
          </AddVideoModal>
          <PresentationSlides>
            {slideArray.length === 0 &&
              displayIfEmpty()
            }
            <ArrowContainer>
              {displayLeftArrows()}
              {displayRightArrows()}
            </ArrowContainer>
            {slideArray.length > 0 &&
              <>
                <SlideNumberStyle>
                  {parseInt(params.slidenum) + 1}
                </SlideNumberStyle>
                {renderSlides()}
              </>
            }
          </PresentationSlides>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Slides;
