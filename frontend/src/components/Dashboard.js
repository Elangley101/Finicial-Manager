// src/components/Dashboard.js

import React, { useState, useEffect } from 'react';
import { Box, Grid, Button } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import AccountSummary from './AccountSummary';
import RecentTransactions from './RecentTransactions';
import ExpenseIncomeChart from './ExpenseIncomeChart';
import GoalsOverview from './GoalsOverview';
import AIChatbot from './AIChatBot';
import PlaidReauthenticate from './PlaidReauthenticate';  // Import Plaid re-authentication component

const Dashboard = () => {
    const [linkToken, setLinkToken] = useState(null);
    const [itemLoginRequired, setItemLoginRequired] = useState(false);

    // Fetch the Plaid link token for reauthentication
    useEffect(() => {
        fetch('http://localhost:8000/api/get_plaid_link_token/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.link_token) {
                setLinkToken(data.link_token);
            } else if (data.action === 'update_link') {
                setLinkToken(data.link_token);
                setItemLoginRequired(true);  // Set the flag to indicate re-authentication is required
            } else {
                console.error('Failed to retrieve Plaid link token:', data);
            }
        })
        .catch(error => console.error('Error fetching Plaid link token:', error));
    }, []);

    // Function to reset Plaid login in Sandbox (for testing)
    const handleResetLogin = () => {
        fetch('http://localhost:8000/api/reset_plaid_login/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert('Login reset successfully');
            } else {
                alert('Failed to reset login');
            }
        })
        .catch(error => console.error('Error resetting login:', error));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Header />
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={4}>
                        <AccountSummary />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <RecentTransactions />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <ExpenseIncomeChart />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <GoalsOverview />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <AIChatbot />
                    </Grid>
                </Grid>

                {/* Plaid re-authentication */}
                {linkToken && itemLoginRequired && (
                    <PlaidReauthenticate linkToken={linkToken} />
                )}

                {/* Button to reset login (for testing sandbox mode) */}
                <Button onClick={handleResetLogin} variant="contained" color="secondary">
                    Reset Plaid Login (Sandbox)
                </Button>
            </Box>
        </Box>
    );
};

export default Dashboard;
