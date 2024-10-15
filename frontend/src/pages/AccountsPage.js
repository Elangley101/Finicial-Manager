import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Divider, CircularProgress, Alert, Drawer } from '@mui/material';
import Sidebar from '../components/Sidebar'; // Assuming you have a Sidebar component
import '../css/AccountsPage.css';

const AccountsPage = () => {
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(location.state?.selectedAccount || null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountsAndTransactions = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          setError('No access token found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAccounts(response.data.accounts || []);
        setTransactions(response.data.transactions || []);
      } catch (error) {
        setError('Failed to fetch accounts and transactions. Make sure the backend is running.');
        console.error('Error fetching accounts and transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsAndTransactions();
  }, []);

  const renderAccountDetails = () => {
    if (!selectedAccount) return <Typography>Select an account to view details</Typography>;

    const { account_id, balance, mask, name, official_name, subtype, type } = selectedAccount;
    const relatedTransactions = transactions.filter(transaction => transaction.account_id === account_id);

    return (
      <Box>
        <Typography variant="h4">{name}</Typography>
        <Typography variant="subtitle1">Official Name: {official_name || 'N/A'}</Typography>
        <Typography variant="body1">Account Type: {type}</Typography>
        <Typography variant="body1">Subtype: {subtype}</Typography>
        <Typography variant="body1">Balance: {balance ? `$${balance}` : 'Balance not available'}</Typography>
        <Typography variant="body1">Account Mask: {mask || 'N/A'}</Typography>
        <Typography variant="body1">Account ID: {account_id}</Typography>

        {relatedTransactions.length > 0 && (
          <Box mt={3}>
            <Typography variant="h5">Transactions</Typography>
            <List>
              {relatedTransactions.map((transaction, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`Date: ${transaction.date}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">Amount: ${transaction.amount}</Typography>
                        <br />
                        <Typography component="span" variant="body2">Merchant: {transaction.name || 'N/A'}</Typography>
                        <br />
                        <Typography component="span" variant="body2">Category: {transaction.category?.join(', ') || 'N/A'}</Typography>
                        <br />
                        <Typography component="span" variant="body2">Payment Channel: {transaction.payment_channel || 'N/A'}</Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    );
  };

  const handleAccountClick = (account) => {
    setSelectedAccount(account);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box display="flex">
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{ width: 240, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' } }}
      >
        <Sidebar />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h5">Your Accounts</Typography>
        <List>
          {accounts.map((account) => (
            <ListItem 
              key={account.account_id} 
              button 
              selected={selectedAccount?.account_id === account.account_id}
              onClick={() => handleAccountClick(account)}
            >
              <ListItemText
                primary={account.name}
                secondary={`Type: ${account.type}, Subtype: ${account.subtype}, Balance: ${account.balance ? `$${account.balance}` : 'N/A'}`}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        {renderAccountDetails()}
      </Box>
    </Box>
  );
};

export default AccountsPage;
