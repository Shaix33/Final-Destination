import { useState, useContext } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      // Registration
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        await axios.post("http://localhost:8000/api/users/", {
          username: formData.name,
          email: formData.email,
          password: formData.password
        });
        alert("Registration successful! Please login.");
        setIsRegister(false);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      } catch (error) {
        console.error(error);
        alert("Registration failed");
      }
    } else {
      // Login
      try {
        const res = await axios.post("http://localhost:8000/api/token/login/", {
          email: formData.email,
          password: formData.password
        });
        login(res.data.auth_token, { email: formData.email });
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
        alert("Login failed");
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        {isRegister ? "Register" : "Login"}
      </Typography>

      <form onSubmit={handleSubmit}>
        {isRegister && (
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
        )}
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          type="password"
          name="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />
        {isRegister && (
          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            fullWidth
            margin="normal"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="text"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </Button>
          <Button variant="contained" type="submit">
            {isRegister ? "Register" : "Login"}
          </Button>
        </Box>
      </form>
    </Container>
  );
}
