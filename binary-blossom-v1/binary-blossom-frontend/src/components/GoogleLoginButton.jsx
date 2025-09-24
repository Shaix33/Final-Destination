import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function GoogleLoginButton() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse) => {
    if (!credentialResponse.credential) return;

    try {
      const res = await API.post("/auth/google/", {
        token: credentialResponse.credential,
      });

      login(res.data.user, {
        access: res.data.access,
        refresh: res.data.refresh,
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login failed", err);
      alert("Google login failed");
    }
  };

  return (
    <div style={{ marginTop: "16px", textAlign: "center" }}>
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => alert("Google login failed")}
        useOneTap
      />
    </div>
  );
}
