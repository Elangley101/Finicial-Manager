import React, { useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import apiClient from '../context/axiosSetup';  // Import Axios client

const LinkPlaid = ({ onSuccess }) => {
  const [linkToken, setLinkToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await apiClient.post('http://localhost:8000/api/create_link_token/');
        setLinkToken(response.data.link_token);  // Set the link token
        console.log('Fetched link token:', response.data.link_token);
      } catch (error) {
        console.error('Error creating link token:', error);
        setErrorMessage('Failed to create link token.');
      } finally {
        setLoading(false);
      }
    };

    createLinkToken();  // Fetch the link token when the component mounts
  }, []);

  const config = {
    token: linkToken,
    onSuccess: async (public_token, metadata) => {
      console.log('Public token received from Plaid:', public_token);

      try {
        const response = await apiClient.post('http://localhost:8000/api/exchange_public_token/', {
          public_token,
          institution: metadata.institution,
        });
        console.log('Backend response:', response.data);
        onSuccess(public_token, metadata);
      } catch (error) {
        console.error('Error exchanging public token:', error);
        setErrorMessage('Failed to exchange public token.');
      }
    },
    onExit: (err) => {
      if (err) {
        setErrorMessage('Exited Plaid link. Please try again.');
      }
    },
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {!loading && !errorMessage && (
        <button onClick={() => open()} disabled={!ready || !linkToken}>
          {ready ? 'Connect Bank' : 'Loading...'}
        </button>
      )}
    </div>
  );
};

export default LinkPlaid;
