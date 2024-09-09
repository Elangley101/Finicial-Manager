import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No access token found. Please log in.');
          return;
        }

        // Fetch the user's linked accounts
        const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,  // Send access token
          },
        });

        console.log('Full API Response:', response.data);  // Log the full API response for inspection
        setAccounts(response.data.accounts);  // Set the accounts data
      } catch (error) {
        setError('Failed to fetch accounts. Make sure the backend is running.');
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  const fetchAccountDetails = async (accountId) => {
    if (!accountId) {
      setError('Account ID is missing.');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('No access token found. Please log in.');
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/plaid/account/${accountId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,  // Send access token
        },
      });

      setAccountDetails(response.data);
      setSelectedAccount(accountId);
    } catch (error) {
      setError('Failed to fetch account details. Make sure the backend is running.');
      console.error('Error fetching account details:', error);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {accounts.map((account, index) => {
        // Use account.id if available, otherwise generate a unique id using index
        const accountId = account.id || `account-${index}`;
        
        return (
          <div key={accountId}>
            <h3>{account.name}</h3>
            <p>Type: {account.type}</p>
            <p>Subtype: {account.subtype}</p>
            <p>Balance: {account.balance}</p>
          </div>
        );
      })}
    </div>
  );
};

export default AccountsPage;
