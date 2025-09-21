import React, { useState, useContext } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await API.post("/auth/register/", { username, email, password });
      login(res.data.user, { access: res.data.access, refresh: res.data.refresh });
      navigate("/dashboard");
    } catch {
      setError("Registration failed");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await API.post("/auth/google/", {
        token: credentialResponse.credential,
      });
      login(res.data.user, {
        access: res.data.access,
        refresh: res.data.refresh,
      });
      navigate("/dashboard");
    } catch {
      setError("Google login failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Register
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#52b788" }}
          >
            Register
          </Button>

          <Typography align="center" sx={{ my: 2 }}>
            OR
          </Typography>

          <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setError("Google login failed")} />
        </Box>
      </Paper>
    </Container>
  );
}
