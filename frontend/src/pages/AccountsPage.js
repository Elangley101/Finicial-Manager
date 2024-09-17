import React, { useState, useEffect } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import '../css/AccountsPage.css';  // CSS for layout
=======
>>>>>>> parent of e8e9eea8 (Frontend and Auth Changes)

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

<<<<<<< HEAD
  const handleAccountClick = async (account) => {
    try {
      const token = localStorage.getItem('access_token');
      let endpoint = '';
  
      // Decide the endpoint based on the account type
      switch (account.type) {
        case 'investment':
          endpoint = `http://localhost:8000/api/plaid/investment/${account.account_id}/`;
          break;
        case 'credit':
          endpoint = `http://localhost:8000/api/plaid/credit/${account.account_id}/`;
          break;
        case 'loan':
          endpoint = `http://localhost:8000/api/plaid/loan/${account.account_id}/`;
          break;
        case '401k':
          endpoint = `http://localhost:8000/api/plaid/401k/${account.account_id}/`;
          break;
        default:
          endpoint = `http://localhost:8000/api/plaid/account/${account.account_id}/`;  // General account details
          break;
      }
  
      // Make the API call to the selected endpoint
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setAccountDetails(response.data);  // Set the account details in state
    } catch (error) {
=======
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
>>>>>>> parent of e8e9eea8 (Frontend and Auth Changes)
      console.error('Error fetching account details:', error);
    }
  };

  const renderAccountDetails = () => {
    if (!accountDetails) return <div>Select an account to view details</div>;
  
    const { account, holdings, transactions } = accountDetails;
  
    switch (account.type) {
      case 'investment':
        return (
          <div>
            <h2>{account.name}</h2>
            <p>Investment Account</p>
            <p>Balance: {account.balances?.current}</p>
            <h3>Holdings</h3>
            <ul>
              {holdings.length > 0 ? (
                holdings.map((holding, index) => (
                  <li key={index}>
                    <p>Security: {holding.security_name}</p>
                    <p>Quantity: {holding.quantity}</p>
                    <p>Value: {holding.market_value}</p>
                  </li>
                ))
              ) : (
                <p>No holdings available</p>
              )}
            </ul>
            <h3>Transactions</h3>
            <ul>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <li key={index}>
                    <p>Date: {transaction.date}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Merchant: {transaction.name || 'N/A'}</p>
                  </li>
                ))
              ) : (
                <p>No transactions available</p>
              )}
            </ul>
          </div>
        );
      case 'credit':
        return (
          <div>
            <h2>{account.name} (Credit Card)</h2>
            <p>Available Credit: {account.balances?.available || 'Not available'}</p>
            <p>Current Balance: {account.balances?.current}</p>
            <h3>Transactions</h3>
            <ul>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <li key={index}>
                    <p>Date: {transaction.date}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Merchant: {transaction.name || 'N/A'}</p>
                  </li>
                ))
              ) : (
                <p>No transactions available</p>
              )}
            </ul>
          </div>
        );
      // Other account types...
      default:
        return (
          <div>
            <h2>{account.name}</h2>
            <p>Account Type: {account.type}</p>
            <p>Balance: {account.balances?.current || 'Balance not available'}</p>
            <h3>Transactions</h3>
            <ul>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <li key={index}>
                    <p>Date: {transaction.date}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Merchant: {transaction.name || 'N/A'}</p>
                  </li>
                ))
              ) : (
                <p>No transactions available</p>
              )}
            </ul>
          </div>
        );
    }
  };
  

  if (error) {
    return <div>{error}</div>;
  }

  return (
<<<<<<< HEAD
    <div className="container">
      {/* Sidebar: List of accounts */}
      <div className="sidebar">
        <h2>Your Accounts</h2>
        <div>
          {accounts.map((account) => {
            return (
              <div 
                key={account.account_id}  // Use account_id as the unique key
                onClick={() => handleAccountClick(account)} // Handle click to fetch account details
                className={`account-item ${selectedAccount?.account_id === account.account_id ? 'active' : ''}`}  // Highlight active account
              >
                <h3>{account.name}</h3>
                <p>Type: {account.type}</p>
                <p>Subtype: {account.subtype}</p>
                {/* Add null checks to ensure balances exists */}
                <p>Balance: {account.balances?.current || 'Balance not available'}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content: Transactions */}
      <div className="main-content">
        {renderAccountDetails()}
      </div>
=======
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
>>>>>>> parent of e8e9eea8 (Frontend and Auth Changes)
    </div>
  );
};

export default AccountsPage;
