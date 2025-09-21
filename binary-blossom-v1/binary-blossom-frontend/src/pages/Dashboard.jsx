import { Container, Typography } from "@mui/material";

function Dashboard() {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Search for locations, view history, and get crop suggestions.
      </Typography>
    </Container>
  );
}

export default Dashboard;
