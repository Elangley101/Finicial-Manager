import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/', // Base URL of your API
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token'); // Get the refresh token from localStorage
  if (!refreshToken) throw new Error("No refresh token available.");

  try {
    // Send a POST request to refresh the access token using the refresh token
    const response = await axios.post('http://localhost:8000/api/token/refresh/', {
      refresh: refreshToken,
    });
    const newAccessToken = response.data.access;

    // Store the new access token in localStorage
    localStorage.setItem('access_token', newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error; // Throw the error to be caught in the interceptor
  }
};

// Add an interceptor to attach the access token to all outgoing requests
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`; // Attach the access token to the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

// Add an interceptor to handle token refreshing on 401 (Unauthorized) errors
apiClient.interceptors.response.use(
  (response) => response, // Forward successful responses directly
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized) and the request hasn't been retried yet
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark the request as retried

      try {
        // Attempt to refresh the access token
        const newToken = await refreshAccessToken();
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`; // Update the request with the new token

        // Retry the original request with the refreshed token
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError); // Reject if token refresh fails
      }
    }

    return Promise.reject(error); // Reject other errors as usual
  }
);

export default apiClient;
