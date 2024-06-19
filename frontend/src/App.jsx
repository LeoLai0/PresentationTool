import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import Login from './pages/login';
import Register from './pages/register';
import PresentationPage from './pages/presentationPage';
// import Presentation from './pages/presentation';

function App () {
  let lsToken = null;
  if (localStorage.getItem('token')) {
    lsToken = localStorage.getItem('token');
  }

  const [token, setToken] = React.useState(lsToken);

  const setTokenAbstract = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/dashboard/" element={<Dashboard token={token} setTokenFunction={setTokenAbstract}/>} />
          <Route path="/register" element={<Register token={token} setTokenFunction={setTokenAbstract}/>} />
          <Route path="/login" element={<Login token={token} setTokenFunction={setTokenAbstract}/>} />
          <Route path="/presentation/:id" element={<PresentationPage token={token}/>} />
          <Route path="/presentation/:id/:slidenum" element={<PresentationPage token={token}/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
