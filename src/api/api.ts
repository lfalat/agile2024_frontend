import axios from 'axios';

const api = axios.create({
  baseURL: "https://localhost:5092/api",
  headers: {
    "Content-Type": 'application/json'
  }
});

export default api;