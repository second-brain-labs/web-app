import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Grid, Link } from '@mui/material';

/**
 * A page allowing users to input their email and password to login. The default
 * starting page of the application
 */
function LoginPage() {

    return ( 
        <Paper elevation={3} style={{ padding: '2rem' }}>
            <Typography variant="h5" gutterBottom>
            Welcome back
            </Typography>
            <form>
            <TextField fullWidth label="Email address" margin="normal" />
            <TextField fullWidth label="Password" type="password" margin="normal" />
            <Button variant="contained" color="primary" fullWidth type="submit">
                Sign in
            </Button>
            </form>
            <Grid container justifyContent="space-between" alignItems="center" style={{ marginTop: '1rem' }}>
            <Grid item>
                <Link href="#" variant="body2">
                Forgot your password?
                </Link>
            </Grid>
            <Grid item>
                <Typography variant="body2">
                Using Second Brain for the first time? <Link href="/createaccount">Create an account</Link>
                </Typography>
            </Grid>
            </Grid>
        </Paper>
    );
}

export default LoginPage;
