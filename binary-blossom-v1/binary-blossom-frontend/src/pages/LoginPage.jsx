import React, { useState, useContext } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axiosInstance.post("/auth/login/", { email, password });
      login(res.data.user, { access: res.data.access, refresh: res.data.refresh });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setError(null);
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/google/", {
        token: credentialResponse.credential,
      });
      login(res.data.user, { access: res.data.access, refresh: res.data.refresh });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#52b788" }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>

          <Typography align="center" sx={{ my: 2 }}>
            OR
          </Typography>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google login failed")}
          />
        </Box>
      </Paper>
    </Container>
  );
}
