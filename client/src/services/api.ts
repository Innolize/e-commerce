import axios from 'axios';

let BASE_URL;
if (process.env.NODE_ENV === 'production') {
  BASE_URL = 'https://master-tech.live/';
} else if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:4000';
}

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
