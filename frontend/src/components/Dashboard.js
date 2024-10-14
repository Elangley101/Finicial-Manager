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
import CreditScore from './CreditScore'; // Adjust the path if necessary
import BillReminders from './BillReminders'; // Adjust the path if necessary
import GoalRecommendations from './GoalRecommendations'; // Adjust the path if necessary
import CurrencyExchange from './CurrencyExchange'; // Adjust the path if necessary
import FraudAlerts from './FraudAlerts'; // Adjust the path if necessary
import TaxReport from './TaxReport'; // Adjust the path if necessary

const Dashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Header />
                <Typography variant="h4" component="h1" gutterBottom>
                    Dashboard
                </Typography>
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
                    <Grid item xs={12} md={6} lg={4}>
                        <CreditScore />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <BillReminders />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <GoalRecommendations />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <CurrencyExchange />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <FraudAlerts />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <TaxReport />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Dashboard;
