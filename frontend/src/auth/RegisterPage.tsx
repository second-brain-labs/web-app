// RegisterPage.tsx
import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid, Link } from '@mui/material';
import axios from "axios";
import { useNavigate } from 'react-router-dom';



const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

  // Placeholder for form handling logic
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try{
        await axios.post('http://localhost:3500/users/dummy/create/', 
        { email: email,
        name: name,
        password: password,
        });
        console.log("bro")
        navigate("/");
    } catch (err: any) {}
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem', borderRadius: '8px' }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Create your account
        </Typography>
        <Typography variant="body2" style={{ marginBottom: '2rem' }}>
          Already have an account? <Link href="/" underline="hover">Log in.</Link>
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth  value={name} onChange={(event) => {setName(event.target.value)}} label="Name" variant="outlined" margin="normal" required  />
          <TextField fullWidth value={email} onChange={(event) => {setEmail(event.target.value)}} label="Email address" variant="outlined" margin="normal" required />
          <TextField fullWidth value={password} onChange={(event) => {setPassword(event.target.value)}} label="Password" variant="outlined" type="password" margin="normal" required helperText="Must match." />
          <TextField fullWidth label="Confirm password" variant="outlined" type="password" margin="normal" required helperText="Match." />
          <Button variant="contained" color="primary" fullWidth type="submit" style={{ marginTop: '1rem' }}>
            Submit
          </Button>
        </form>
      </Paper>
      <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
        Terms of use | Privacy policy
      </Typography>
    </Container>
  );
};

export default RegisterPage;
