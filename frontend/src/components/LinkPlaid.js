import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import axios from 'axios';

const LinkPlaid = ({ onSuccess }) => {
  const [linkToken, setLinkToken] = useState(null);  // State to store link token
  const [errorMessage, setErrorMessage] = useState('');  // State to store error message
  const [loading, setLoading] = useState(true);  // Track loading state

  // Fetch the link token from backend when component mounts
  useEffect(() => {
    const createLinkToken = async () => {
      try {
        // Retrieve the access token from local storage (for authentication)
        const token = localStorage.getItem('access_token');
        console.log('JWT Token:', token);
        
        if (!token) {
          setErrorMessage('No access token found. Please log in.');
          setLoading(false);  // End loading state
          return;
        }

        // Send a POST request to your backend to get the link token
        const response = await axios.post(
          'http://localhost:8000/api/create_link_token/',  // Adjust this URL to match your backend endpoint
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the access token in the authorization header
            },
          }
        );

        // Set the link token from response
        const fetchedLinkToken = response.data.link_token;
        setLinkToken(fetchedLinkToken);

        // Log the fetched link token for debugging purposes
        console.log('Fetched link token:', fetchedLinkToken);

      } catch (error) {
        console.error('Error creating link token:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.error || 'Failed to create link token.');
        } else {
          setErrorMessage('Failed to create link token. Please check your authentication and try again.');
        }
      } finally {
        setLoading(false);  // End loading state
      }
    };

    createLinkToken();  // Call the function to fetch the link token when the component mounts
  }, []);

  // Configuration for Plaid Link
  const config = {
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      console.log('Public token received from Plaid:', public_token);  // Log public token
      console.log('Plaid metadata:', metadata);  // Log Plaid metadata

      // Retrieve the access token from local storage
      const token = localStorage.getItem('access_token');
      if (!token) {
        setErrorMessage('No access token found. Please log in.');
        return;
      }

      try {
        // Send the public_token to your backend to exchange for access_token
        const response = await axios.post(
          'http://localhost:8000/api/exchange_public_token/',  // Adjust this URL to match your backend endpoint
          {
            public_token,  // Payload sent to the backend
            institution: metadata.institution  // Institution data from Plaid metadata
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Pass the JWT token in the authorization header
            },
          }
        );

        console.log('Backend response:', response.data);

        // Handle success callback (optional)
        if (onSuccess) {
          onSuccess(public_token, metadata);  // You can also pass the access token if needed
        }

      } catch (error) {
        console.error('Error exchanging public token:', error);
        setErrorMessage('Failed to exchange public token.');
      }
    },
    onExit: (err, metadata) => {
      if (err) {
        console.error('User exited Plaid Link with error:', err);
        setErrorMessage('Exited Plaid link. Please try again.');
      }
    },  // Handle exit scenarios
  };

  const { open, ready, error } = usePlaidLink(config);  // Initialize Plaid Link

  return (
    <div>
      {loading && <p>Loading...</p>}  {/* Show loading message while fetching link token */}
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}  {/* Display error messages */}
      
      {!loading && !errorMessage && (
        <button onClick={() => open()} disabled={!ready || !linkToken}>
          {ready ? 'Connect Bank' : 'Loading...'}  {/* Show button state based on readiness */}
        </button>
      )}
    </div>
  );
};

export default LinkPlaid;
