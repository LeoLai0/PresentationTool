import React from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

function Register ({ token, setTokenFunction }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');

  const navigate = useNavigate();

  if (token !== null) {
    return <Navigate to='/dashboard'/>;
  }

  // Registers users data into the data store
  const register = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-try');
      return;
    }
    // do the fetch request.
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        email,
        password,
        name
      });
      setTokenFunction(response.data.token);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred while registering.');
      }
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component='img'
            src='/images/Presto.jpg'
            alt='presto-logo'
            sx={{
              height: 150,
            }}
          />
          <Typography component="h1" variant="h5">
            Create your account
          </Typography>
          <form onSubmit={register}>
            <TextField
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              margin="normal"
              required
              fullWidth
              autofocus
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
            <TextField
              id="password"
              label="Password"
              name="password"
              autoComplete="current-password"
              type="password"
              margin="normal"
              required
              fullWidth
              onChange={e => setPassword(e.target.value)}
              value={password}
            />
            <TextField
              id="confirm-password"
              label="Confirm Password"
              name="confirm-password"
              autoComplete="confirm-password"
              type="password"
              margin="normal"
              required
              fullWidth
              onChange={e => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <TextField
              id="name"
              label="Name"
              name="name"
              autoComplete="user-name"
              type="text"
              margin="normal"
              required
              fullWidth
              onChange={e => setName(e.target.value)}
              value={name}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              onClick={register}
            >
              Register
            </Button>
            {error && <div>{error}</div>}
            <span>Already have an account? <Link to="/login">Log In</Link></span>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Register;
