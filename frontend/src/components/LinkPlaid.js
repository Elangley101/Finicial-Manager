import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const LinkPlaid = ({ onSuccess }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Function to fetch the link token from the backend
    const createLinkToken = async () => {
      try {
        // Fetch the access token from local storage
        const token = localStorage.getItem('access_token');

        // Check if the token is available
        if (!token) {
          setErrorMessage('No access token found. Please log in.');
          return;
        }

        // Send a POST request to the backend to create the link token
        const response = await axios.post(
          'http://localhost:8000/api/create_link_token/',
          {}, // Additional parameters can be added here
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the authorization header
            },
          }
        );

        // Set the link token state if successful
        setLinkToken(response.data.link_token);
      } catch (error) {
        // Handle errors and set an error message
        console.error('Error creating link token:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.error || 'Failed to create link token.');
        } else {
          setErrorMessage('Failed to create link token. Please check your authentication and try again.');
        }
      }
    };

    createLinkToken(); // Fetch the link token when the component mounts
  }, []);

  // Configuration for Plaid Link
  const config = {
    token: linkToken,
    onSuccess: (public_token, metadata) => onSuccess(public_token, metadata),
  };

  const { open, ready, error } = usePlaidLink(config); // Initialize Plaid Link

  return (
    <div>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error messages */}
      <button onClick={() => open()} disabled={!ready || !linkToken}>
        Connect Bank
      </button>
    </div>
  );
};

export default LinkPlaid;
