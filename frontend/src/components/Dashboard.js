// src/components/Dashboard.js

import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';
import AccountSummary from './AccountSummary';
import RecentTransactions from './RecentTransactions';
import ExpenseIncomeChart from './ExpenseIncomeChart';
import GoalsOverview from './GoalsOverview';
import AIChatbot from './AIChatBot';

const Dashboard = () => {
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
            </Box>
        </Box>
    );
};

export default Dashboard;
