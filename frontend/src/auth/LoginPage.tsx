import React, { useEffect } from "react";
import { Box, Button, Typography, Container, Paper, Link } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { JwtPayload } from "jwt-decode";
import { post } from "../util/api";
import "./login.css";
import { useAuth } from "../util/redux/hooks/useAuth";
import { useUser } from "../util/redux/hooks/useUser";

interface newJwtPayload extends JwtPayload {
  name: string;
  email: string;
}

/**
 * A page allowing users to input their email and password to login. The default
 * starting page of the application
 */
function LoginPage() {
  const nav = useNavigate();
  const { login } = useAuth();
  const { username, userID, newUserLogin } = useUser();

  useEffect(() => {
    if (username !== null && userID !== null) {
      nav("/home");
    }
  }, []);

  const loginUser = async (name: string, email: string) => {
    try {
      const response = await post(`users/login`, {
        email: email,
        name: name,
      });
      login();
      const data = (await response).data;
      newUserLogin(data.uuid, data.name);
      nav("/home");
    } catch (err) {
      console.error(err);
    }
  };

  const decode_jwt = (resp: CredentialResponse) => {
    if (resp.credential === null || resp.credential === undefined) {
      return;
    }
    const decoded: newJwtPayload = jwtDecode(resp.credential);
    const email = decoded.email;
    const name = decoded.name;
    loginUser(name, email);
  };

  return (
    <Container maxWidth="lg" className="loginScreen">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: "100vh",
          padding: 3,
        }}
      >
        {/* Left side - Form Section */}
        <Paper elevation={3} className="formSection">
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              Welcome back
            </Typography>
            <Box component="form" noValidate autoComplete="off">
              <Paper elevation={3} style={{ padding: "2rem" }}>
                <GoogleLogin onSuccess={decode_jwt} onError={console.log} />
              </Paper>
              <Typography
                variant="body2"
                className="linkSpacing"
                style={{ padding: "1rem" }}
              >
                <Link href="#" underline="hover">
                  Forgot your password?
                </Link>
              </Typography>
              <Box textAlign="center" mt={2}>
                <Typography variant="body2" sx={{ display: "block", mb: 1 }}>
                  Using Second Brain for the first time?
                </Typography>
                <Button variant="outlined">Create an account</Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Right side - Stats Section */}
        <Box className="statsSection">
          <Typography variant="h5" gutterBottom>
            In the past day
          </Typography>
          <Typography variant="body2" gutterBottom>
            our users have visited
          </Typography>
          <Typography variant="h6" gutterBottom>
            2,419 web pages
          </Typography>
          {/* ... include other stats and paragraphs similarly */}
          <Typography variant="body2">
            Close the tabs. Clean the clutter. Clear your mind.
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
