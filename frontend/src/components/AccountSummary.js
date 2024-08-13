import React from 'react';

const accounts = [
  {
    id: 1,
    name: 'Checking Account',
    type: 'Bank Account',
    balance: 1500.75,
  },
  {
    id: 2,
    name: 'Savings Account',
    type: 'Bank Account',
    balance: 10250.00,
  },
  {
    id: 3,
    name: 'Credit Card',
    type: 'Liability',
    balance: -500.50,
  },
];

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
  },
  accountItemTitle: {
    margin: '0 0 10px',
    color: '#495057',
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
  },
  totalBalanceValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#28a745',
  },
};

const AccountSummary = () => {
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

  return (
    <div style={styles.accountSummary}>
      <h2 style={styles.accountTitle}>Account Summary</h2>
      <div style={styles.accountList}>
        {accounts.map(account => (
          <div key={account.id} style={styles.accountItem}>
            <h3 style={styles.accountItemTitle}>{account.name}</h3>
            <p style={styles.accountItemText}>Type: {account.type}</p>
            <p style={styles.accountItemText}>Balance: ${account.balance.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div style={styles.totalBalance}>
        <h3 style={styles.totalBalanceTitle}>Total Balance</h3>
        <p style={styles.totalBalanceValue}>${totalBalance.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default AccountSummary;
