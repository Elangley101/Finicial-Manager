// src/axiosConfig.js
import axios from 'axios';

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8000';

// Optional: Set other default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Handle response errors globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle specific error statuses here
    return Promise.reject(error);
  }
);

export default axios;
