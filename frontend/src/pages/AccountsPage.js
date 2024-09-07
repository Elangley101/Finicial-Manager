import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);   // State to store accounts
  const [error, setError] = useState(null);       // State to store errors
  const [loading, setLoading] = useState(true);   // Loading state while fetching accounts

  // Fetch accounts from backend when the component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('access_token');


        // If no token is found, display an error message
        if (!token) {
          setError('No access token found. Please log in.');
          setLoading(false);
          return;
        }

        // Log the token for debugging purposes
        console.log('JWT Token:', token);

        // Make an API request to fetch accounts using the JWT token for authentication
        const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,  // Attach the token to the Authorization header
          },
        });

        // Log the response from the backend for debugging purposes
        console.log('Accounts Response:', response.data);

        // Store the retrieved accounts in state
        setAccounts(response.data.accounts);
        setLoading(false);  // End loading state
      } catch (err) {
        setError('Failed to fetch accounts. Make sure the backend is running.');
        console.error('Error fetching accounts:', err);
        setLoading(false);  // End loading state
      }
    };

    fetchAccounts();  // Fetch accounts when the component mounts
  }, []);

  // If there was an error, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  // If still loading, display a loading message
  if (loading) {
    return <div>Loading accounts...</div>;
  }

  // If there are no accounts, display a message
  if (accounts.length === 0) {
    return <div>No accounts found. Please link an account.</div>;
  }

  // Render the list of accounts
  return (
    <div>
      <h1>Accounts</h1>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            <strong>{account.name}</strong>: {account.subtype} - Balance: ${account.balance.current}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountsPage;
