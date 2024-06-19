import React from 'react';
import { Navigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import NewPresentationModal from '../components/NewPresentationModal'
import axios from 'axios';
import { styled } from '@mui/system';
// import { Box } from '@mui/material'
import PresentationBox from '../components/PresentationBox';

const DashboardWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: '#F0F1F2'
});

const LeftDashboard = styled('div')({
  display: 'flex',
  marginTop: '2vh',
  flex: '20%',
  height: '100vh',
  border: '0.5px solid #DCDDDC',
  flexDirection: 'column'
});

const RightDashboard = styled('div')({
  marginTop: '2vh',
  flex: '80%',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
});

const PresentationBoxWrapper = styled('div')({
  minWidth: '100px',
  maxWidth: '300px',
  width: '25%',
  margin: '0 1vw',
});

const DashboardHeader = styled('div')({
  backgroundColor: '#1976D2',
  height: '8vh',
  display: 'flex',
  justifyContent: 'center'
});

const StyledHeading = styled('h1')({
  margin: 'auto 0',
  color: 'white',
  height: '80%'
});

const ButtonWrapper = styled('div')({
  width: '100px',
})

function Dashboard ({ token, setTokenFunction }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newPresentation, setNewPresentation] = React.useState(false);
  const [presentationArray, setNewPresentationArray] = React.useState([]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  }

  // Load Dashboard presentations
  React.useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get('http://localhost:5005/store', {
          headers: {
            Authorization: token,
          }
        });
        if (res.data.store.presentations === undefined) {
          setNewPresentationArray([]);
        } else {
          const newPresentationArray = res.data.store.presentations
          setNewPresentationArray(newPresentationArray);
        }
      } catch (err) {
        alert(err.response.data.error);
      }
    };
    getData();
  }, [newPresentation]);

  if (token === null) {
    return <Navigate to='/login'/>;
  }

  return <>
    <DashboardHeader>
      <StyledHeading>Presentations</StyledHeading>
    </DashboardHeader>
    <DashboardWrapper>
      <LeftDashboard>
        <ButtonWrapper>
          <LogoutButton token={token} setTokenFunction={setTokenFunction}/>
        </ButtonWrapper>
        <NewPresentationModal isOpen={modalOpen} token={token} onClose={toggleModal} setNewPresentation={setNewPresentation} presentationArray={presentationArray} newPresentation={newPresentation} setModalOpen={setModalOpen}/><br />
        <ButtonWrapper>
          <button onClick={toggleModal}>New Presentation</button>
        </ButtonWrapper>
      </LeftDashboard>
      <RightDashboard>
        {presentationArray.map((pres, index) => {
          return <PresentationBoxWrapper key={index}>
            <PresentationBox presentation={pres}/>
          </PresentationBoxWrapper>
        })}
      </RightDashboard>
    </DashboardWrapper>
  </>;
}

export default Dashboard;
