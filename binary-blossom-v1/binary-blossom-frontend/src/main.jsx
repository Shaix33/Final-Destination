import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Load client ID from Vite environment variables (.env file in project root)
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", clientId);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);

