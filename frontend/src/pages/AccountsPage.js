import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation
import '../css/AccountsPage.css';

const AccountsPage = () => {
  const location = useLocation(); // Get the location object
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(location.state?.selectedAccount || null); // Access selectedAccount from location state
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountsAndTransactions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No access token found. Please log in.');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,  // Send access token
          },
        });

        console.log('Full API Response:', response.data);  
        setAccounts(response.data.accounts || []);  
        setTransactions(response.data.transactions || []);  
      } catch (error) {
        setError('Failed to fetch accounts and transactions. Make sure the backend is running.');
        console.error('Error fetching accounts and transactions:', error);
      }
    };

    fetchAccountsAndTransactions();
  }, []);

  // Render account details based on selectedAccount
  const renderAccountDetails = () => {
    if (!selectedAccount) return <div>Select an account to view details</div>;

    const { account_id, balance, mask, name, official_name, subtype, type } = selectedAccount;

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

  const handleAccountClick = (account) => {
    setSelectedAccount(account); // Update the selected account when clicked
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Your Accounts</h2>
        <div>
          {accounts.map((account) => (
            <div 
              key={account.account_id} 
              className={`account-item ${selectedAccount?.account_id === account.account_id ? 'active' : ''}`}
              onClick={() => handleAccountClick(account)} // Set selected account on click
            >
              <h3>{account.name}</h3>
              <p>Type: {account.type}</p>
              <p>Subtype: {account.subtype}</p>
              <p>Balance: {account.balance ? account.balance : 'Balance not available'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {renderAccountDetails()} {/* Render account details */}
      </div>
    </div>
  );
};

export default AccountsPage;
