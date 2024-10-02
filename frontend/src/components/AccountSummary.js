import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
// Styling object
const styles = {
  accountSummary: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  accountTitle: {
    marginBottom: '20px',
    color: '#343a40',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  accountListContainer: {
    maxHeight: '300px', // Set a maximum height for the scrollable area
    overflowY: 'auto',  // Enable vertical scrolling
    marginBottom: '20px',
  },
  accountList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  accountItem: {
    backgroundColor: '#ffffff',
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: '0.3s',
  },
  accountItemTitle: {
    margin: '0 0 10px',
    color: '#495057',
    fontSize: '18px',
  },
  accountItemText: {
    margin: '5px 0',
    color: '#6c757d',
  },
  totalBalance: {
    marginTop: '30px',
    paddingTop: '15px',
    borderTop: '2px solid #dee2e6',
  },
  totalBalanceTitle: {
    color: '#343a40',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  totalBalanceValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#28a745',
  },
  accountCount: {
    fontSize: '1rem',
    color: '#495057',
  },
};

const AccountSummary = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No access token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:8000/api/plaid/accounts/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Fetched accounts:', data);
        setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
      } catch (error) {
        console.error('Error fetching accounts:', error);
        setError('Failed to fetch accounts.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Log accounts whenever it updates
  useEffect(() => {
    console.log('Accounts updated:', accounts);
  }, [accounts]);

  // Calculate total balance
  const totalBalance = accounts.reduce((acc, account) => {
    return acc + (account.balance || 0);
  }, 0);

  if (loading) {
    return <div>Loading accounts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Handle account click for navigation
  const handleAccountClick = (account) => {
    navigate('/accounts', { state: { selectedAccount: account } }); // Use navigate instead of history.push
  };

  return (
    <div style={styles.accountSummary}>
      <h2 style={styles.accountTitle}>Account Summary</h2>
      <div style={styles.accountListContainer}>
        <div style={styles.accountList}>
          {accounts.map(account => (
            <div key={account.account_id} style={styles.accountItem} onClick={() => handleAccountClick(account)}>
              <h3 style={styles.accountItemTitle}>{account.name}</h3>
              <p style={styles.accountItemText}>Type: {account.type}</p>
              <p style={styles.accountItemText}>Balance: ${account.balance !== undefined ? account.balance.toFixed(2) : 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.totalBalance}>
        <h3 style={styles.totalBalanceTitle}>Total Balance</h3>
        <p style={styles.totalBalanceValue}>${totalBalance.toFixed(2)}</p>
        <p style={styles.accountCount}>Total Accounts: {accounts.length}</p>
      </div>
    </div>
  );
};

export default AccountSummary;
