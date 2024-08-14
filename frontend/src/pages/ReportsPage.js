import React from 'react';
import Sidebar from '../components/Sidebar';
import { Box } from '@mui/material';
import InvestmentPortfolioPerformance from '../components/InvestmentPortfolioPerformance';
import DebtAndLiabilityReports from '../components/DebtAndLiabilityReports';
import SavingsAndGoalsTracking from '../components/SavingsAndGoalsTracking';

// Mock data for demonstration purposes
const portfolio = {
    growth: 12.5,
    returns: 5000,
    assets: [
        { name: 'Stocks', value: 50000 },
        { name: 'Bonds', value: 20000 },
        { name: 'Real Estate', value: 15000 },
        { name: 'Crypto', value: 10000 },
    ],
};

const debts = [
    { id: 1, name: 'Credit Card', balance: 3000, interestRate: 18.5 },
    { id: 2, name: 'Student Loan', balance: 15000, interestRate: 4.5 },
    { id: 3, name: 'Car Loan', balance: 7000, interestRate: 6.2 },
];

const goals = [
    { id: 1, name: 'Emergency Fund', targetAmount: 10000, savedAmount: 6000 },
    { id: 2, name: 'Vacation', targetAmount: 5000, savedAmount: 1500 },
    { id: 3, name: 'New Car', targetAmount: 20000, savedAmount: 8000 },
];

const ReportsPage = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <Box flexGrow={1} p={3} className="reports-page">
                <InvestmentPortfolioPerformance portfolio={portfolio} />
                <DebtAndLiabilityReports debts={debts} />
                <SavingsAndGoalsTracking goals={goals} />
            </Box>
        </div>
    );
};

export default ReportsPage;
