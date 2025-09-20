import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Django backend
  headers: { "Content-Type": "application/json" },
});

// Attach JWT access token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh expired tokens
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/auth/refresh/", {
          refresh: refreshToken,
        });

        const newAccess = res.data.access;
        localStorage.setItem("accessToken", newAccess);

        API.defaults.headers.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
