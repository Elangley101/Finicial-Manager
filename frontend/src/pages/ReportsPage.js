import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { Box, CircularProgress, Typography } from '@mui/material';
import InvestmentPortfolioPerformance from '../components/InvestmentPortfolioPerformance';
import DebtAndLiabilityReports from '../components/DebtAndLiabilityReports';
import SavingsAndGoalsTracking from '../components/SavingsAndGoalsTracking';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const ReportsPage = () => {
    const [portfolio, setPortfolio] = useState(null);
    const [debts, setDebts] = useState(null);
    const [goals, setGoals] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const portfolioResponse = await axios.get('http://localhost:8000/api/portfolio/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                const debtsResponse = await axios.get('http://localhost:8000/api/debts/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                const goalsResponse = await axios.get('http://localhost:8000/api/goals/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });

                setPortfolio(portfolioResponse.data);
                setDebts(debtsResponse.data);
                setGoals(goalsResponse.data);
            } catch (error) {
                console.error('Error fetching report data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authTokens]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <Box flexGrow={1} p={3} className="reports-page">
                {portfolio && <InvestmentPortfolioPerformance portfolio={portfolio} />}
                {debts && <DebtAndLiabilityReports debts={debts} />}
                {goals && <SavingsAndGoalsTracking goals={goals} />}
                {!portfolio && !debts && !goals && (
                    <Typography variant="h6">No data available</Typography>
                )}
            </Box>
        </div>
    );
};

export default ReportsPage;
