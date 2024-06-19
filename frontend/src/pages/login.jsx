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

function Login ({ token, setTokenFunction }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  if (token !== null) {
    return <Navigate to='/dashboard'/>;
  }

  // Logs in user with the data provided, and matches to data store.
  const login = async (e) => {
    e.preventDefault();
    // do the fetch request.
    try {
      const response = await axios.post('http://localhost:5005/admin/auth/login', {
        email,
        password
      });
      setTokenFunction(response.data.token);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response.data.error);
      alert(err.response.data.error);
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
          >
          </Box>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={login}>
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              onClick={login}
            >
              Login
            </Button>
            {error && <div>{error}</div>}

            <span>Don&apos;t have an account? <Link to="/register">Register Here</Link></span>
          </form>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Login;
