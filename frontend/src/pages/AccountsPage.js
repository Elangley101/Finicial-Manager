import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AccountsPage.css';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountsAndTransactions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No access token found. Please log in.');
          return;
        }

        // Fetch the user's linked accounts and transactions from the backend
        const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,  // Send access token
          },
        });

        console.log('Full API Response:', response.data);  // Log the full API response for inspection
        setAccounts(response.data.accounts || []);  // Set the accounts data or an empty array to prevent errors
        setTransactions(response.data.transactions || []);  // Set the transactions data or an empty array
      } catch (error) {
        setError('Failed to fetch accounts and transactions. Make sure the backend is running.');
        console.error('Error fetching accounts and transactions:', error);
      }
    };

    fetchAccountsAndTransactions();
  }, []);

  const handleAccountClick = (account) => {
    setSelectedAccount(account);  // Set the selected account when clicked
  };

  const renderAccountDetails = () => {
    if (!selectedAccount) return <div>Select an account to view details</div>;

    const { account_id, balance, mask, name, official_name, subtype, type } = selectedAccount;

    // Filter the transactions related to the selected account
    const relatedTransactions = transactions.filter(transaction => transaction.account_id === account_id);

    return (
      <div>
        <h2>{name}</h2>
        <p>Official Name: {official_name || 'N/A'}</p>
        <p>Account Type: {type}</p>
        <p>Subtype: {subtype}</p>
        <p>Balance: {balance ? balance : 'Balance not available'}</p>
        <p>Account Mask: {mask || 'N/A'}</p>
        <p>Account ID: {account_id}</p>

        {/* Render Transactions if available */}
        {relatedTransactions.length > 0 && (
          <div>
            <h3>Transactions</h3>
            <ul>
              {relatedTransactions.map((transaction, index) => (
                <li key={index}>
                  <p>Date: {transaction.date}</p>
                  <p>Amount: {transaction.amount}</p>
                  <p>Merchant: {transaction.name || 'N/A'}</p>
                  <p>Category: {transaction.category?.join(', ') || 'N/A'}</p>
                  <p>Payment Channel: {transaction.payment_channel || 'N/A'}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      {/* Sidebar: List of accounts */}
      <div className="sidebar">
        <h2>Your Accounts</h2>
        <div>
          {accounts.map((account) => (
            <div 
              key={account.account_id}  // Use account_id as the unique key
              onClick={() => handleAccountClick(account)} // Handle click to fetch account details
              className={`account-item ${selectedAccount?.account_id === account.account_id ? 'active' : ''}`}  // Highlight active account
            >
              <h3>{account.name}</h3>
              <p>Type: {account.type}</p>
              <p>Subtype: {account.subtype}</p>
              <p>Balance: {account.balance ? account.balance : 'Balance not available'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content: Account Details and Transactions */}
      <div className="main-content">
        {renderAccountDetails()}
      </div>
    </div>
  );
};

export default AccountsPage;
