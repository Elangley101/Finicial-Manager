import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AccountsPage.css';  // We'll add CSS in an external file

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
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
        setAccounts(response.data.accounts);  // Set the accounts data
        setTransactions(response.data.transactions);  // Set the transactions data
      } catch (error) {
        setError('Failed to fetch accounts and transactions. Make sure the backend is running.');
        console.error('Error fetching accounts and transactions:', error);
      }
    };

    fetchAccountsAndTransactions();
  }, []);

  // Filter transactions by accountId
  const filterTransactionsByAccount = (accountId) => {
    return transactions.filter(transaction => transaction.account_id === accountId);
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
    const filteredTransactions = filterTransactionsByAccount(account.account_id);
    setAccountDetails({ account, transactions: filteredTransactions });
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
        {selectedAccount && accountDetails ? (
          <div>
            <h2>Transactions for {accountDetails.account.name}</h2>
            <ul>
              {accountDetails.transactions.length > 0 ? (
                accountDetails.transactions.map((transaction, index) => (
                  <li key={index}>
                    <p>Transaction Date: {transaction.date}</p>
                    <p>Amount: {transaction.amount}</p>
                    <p>Merchant: {transaction.name || 'N/A'}</p>
                  </li>
                ))
              ) : (
                <p>No transactions available for this account.</p>
              )}
            </ul>
          </div>
        ) : (
          <div>
            <h2>Select an account to view transactions</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsPage;
