// src/pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { Container, Typography, Button, Paper, Grid, Box, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export default function Dashboard() {
  const { user, logout, tokens, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRefreshToken = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const res = await API.post("/auth/refresh/", { refresh: tokens.refresh });
      login(user, { access: res.data.access, refresh: tokens.refresh });
    } catch (err) {
      console.error("Failed to refresh token:", err);
      setError("Failed to refresh token.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await API.get("/activities/", {
          headers: { Authorization: `Bearer ${tokens?.access}` },
        });
        setRecentActivities(res.data);
      } catch (err) {
        console.error("Failed to fetch activities:", err);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [tokens]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4">Welcome, {user?.username || "User"}!</Typography>
        <Button variant="contained" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Profile Info</Typography>
            <Typography>Email: {user?.email}</Typography>
            <Typography>Username: {user?.username}</Typography>
            <Typography>Login Method: {user?.google ? "Google OAuth" : "JWT"}</Typography>
          </Paper>
        </Grid>

        {/* Token Info */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">JWT Token Info</Typography>
            <Typography>Access Token: {tokens?.access ? tokens.access.slice(0, 20) + "..." : "N/A"}</Typography>
            <Typography>Refresh Token: {tokens?.refresh ? tokens.refresh.slice(0, 20) + "..." : "N/A"}</Typography>
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }} 
              onClick={handleRefreshToken} 
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh Access Token"}
            </Button>
          </Paper>
        </Grid>

        {/* Recent Activities */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Recent Activities</Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : recentActivities.length === 0 ? (
              <Typography>No recent activity yet.</Typography>
            ) : (
              recentActivities.map((act, idx) => (
                <Typography key={idx}>• {act.action} at {new Date(act.date).toLocaleString()}</Typography>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
