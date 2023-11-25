import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Paper, Grid, Link } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { CredentialResponse } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { JwtPayload } from 'jwt-decode';

interface newJwtPayload extends JwtPayload {
    name: string,
    email: string,
}


/**
 * A page allowing users to input their email and password to login. The default
 * starting page of the application
 */
function LoginPage() {
    const nav = useNavigate();

    const decode_jwt = (resp: CredentialResponse) => {
        if (resp.credential === null || resp.credential === undefined) {
            return;
        }
        const decoded: newJwtPayload = jwtDecode(resp.credential);
        console.log(decoded);
        const email = decoded.email;
        const name = decoded.name;
        
        nav("/home");
    }


    return ( 
        <Paper elevation={3} style={{ padding: '2rem' }}>
            <GoogleLogin onSuccess={decode_jwt} onError={console.log} />
        </Paper>
    );
}

export default LoginPage;
