import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Agriculture,
  WbSunny,
  Opacity,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // New states for time + location
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [location, setLocation] = useState("Fetching location...");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get location using browser geolocation + reverse geocoding
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const place =
              res.data.address.city ||
              res.data.address.town ||
              res.data.address.village ||
              res.data.address.country;
            setLocation(place);
          } catch (err) {
            console.error("Error fetching location:", err);
            setLocation("Unknown Location");
          }
        },
        () => setLocation("Location access denied")
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  const themeColors = {
    background: darkMode ? "#1b4332" : "#e9f5db",
    text: darkMode ? "#fefae0" : "#2d6a4f",
    cardBg: darkMode ? "#2d6a4f" : "#fff",
  };

  const forecast = [
    { day: "Mon", temp: "22°C", condition: "Sunny" },
    { day: "Tue", temp: "19°C", condition: "Cloudy" },
    { day: "Wed", temp: "24°C", condition: "Rainy" },
    { day: "Thu", temp: "21°C", condition: "Partly Cloudy" },
    { day: "Fri", temp: "20°C", condition: "Sunny" },
  ];

  const crops = [
    {
      name: "Maize",
      instructions:
        "Plant in well-drained soil with full sunlight. Water regularly.",
      icon: <Agriculture fontSize="large" />,
    },
    {
      name: "Wheat",
      instructions:
        "Sow in cool seasons. Needs moderate watering and fertile soil.",
      icon: <WbSunny fontSize="large" />,
    },
    {
      name: "Rice",
      instructions:
        "Requires wet soil conditions. Ideal for paddy fields.",
      icon: <Opacity fontSize="large" />,
    },
  ];

  return (
    <div
      style={{
        background: themeColors.background,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar
        position="static"
        style={{ background: darkMode ? "#081c15" : "#74c69d" }}
      >
        <Toolbar style={{ justifyContent: "space-between" }}>
          <Typography variant="h6" style={{ color: themeColors.text }}>
            🌱 Binary Blossom
          </Typography>
          <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        style={{ flexGrow: 1, padding: "2rem 1rem", textAlign: "center" }}
      >
        <Typography variant="h3" gutterBottom style={{ color: themeColors.text }}>
          Welcome to Binary Blossom
        </Typography>
        <Typography variant="h6" gutterBottom style={{ color: themeColors.text }}>
          {user
            ? `Hello, ${user.username}`
            : "Login or Register to access more functionality"}
        </Typography>

        {/* Time + Location here */}
        <Typography
          variant="subtitle1"
          style={{ color: themeColors.text, marginBottom: "1rem" }}
        >
          🕒 {time} | 📍 {location}
        </Typography>

        <div style={{ margin: "1.5rem 0" }}>
          {user ? (
            <Button
              variant="contained"
              style={{ marginRight: "1rem", background: "#d62828", color: "#fff" }}
              onClick={logout}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                style={{ marginRight: "1rem", background: "#52b788", color: "#fff" }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                style={{ borderColor: "#52b788", color: "#52b788" }}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </div>

        {/* --- Your existing dashboard content (weather + crops) --- */}
        <Typography
          variant="h5"
          gutterBottom
          style={{ color: themeColors.text }}
        >
          Current Weather
        </Typography>
        <Typography style={{ color: themeColors.text }}>
          Temperature: 21.5°C
        </Typography>
        <Typography style={{ color: themeColors.text }}>
          Condition: Sunny
        </Typography>

        <Typography
          variant="h5"
          style={{
            marginTop: "2rem",
            marginBottom: "1rem",
            color: themeColors.text,
          }}
        >
          5-Day Forecast
        </Typography>
        <Grid container spacing={3}>
          {forecast.map((day, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <Card
                style={{
                  background: themeColors.cardBg,
                  borderRadius: "1rem",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" style={{ color: themeColors.text }}>
                    {day.day}
                  </Typography>
                  <Typography style={{ color: themeColors.text }}>
                    {day.temp}
                  </Typography>
                  <Typography style={{ color: themeColors.text }}>
                    {day.condition}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="h5"
          style={{
            marginTop: "2rem",
            marginBottom: "1rem",
            color: themeColors.text,
          }}
        >
          Suggested Crops
        </Typography>
        <Grid container spacing={3}>
          {crops.map((crop, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                style={{
                  background: themeColors.cardBg,
                  borderRadius: "1rem",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  transition: "transform 0.3s",
                }}
                onClick={() => alert(crop.instructions)}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <CardContent>
                  {crop.icon}
                  <Typography
                    variant="h6"
                    style={{ marginTop: "0.5rem", color: themeColors.text }}
                  >
                    {crop.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
