import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Logout ({ token, setTokenFunction }) {
  const navigate = useNavigate();

  // button which logs out user, and removes user from local storage.
  const logout = async () => {
    try {
      await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          Authorization: token,
        }
      });
      setTokenFunction(null);
      localStorage.removeItem('token');
    } catch (err) {
      // console.log('HERE')
      alert(err.response.data.error);
    }
  }

  if (setTokenFunction == null) {
    navigate('/login');
  }
  return (
    <button onClick={logout}>Logout</button>
  );
}

export default Logout;
