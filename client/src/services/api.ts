import axios from "axios";

let BASE_URL;
if (process.env.NODE_ENV === "production") {
  BASE_URL = "https://master-tech.live/";
} else if (process.env.NODE_ENV === "development") {
  BASE_URL = "http://localhost:4000";
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Sets token from local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const currentToken = config.headers.Authorization;
  if (token && `Bearer ${token}` !== currentToken) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
