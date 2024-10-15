import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import { Box, CircularProgress, Typography, Grid } from '@mui/material';
import InvestmentPortfolioPerformance from '../components/InvestmentPortfolioPerformance';
import DebtAndLiabilityReports from '../components/DebtAndLiabilityReports';
import SavingsAndGoalsTracking from '../components/SavingsAndGoalsTracking';
import GoalSetting from '../components/GoalSetting';  // Import the Goal Setting component
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const ReportsPage = () => {
    const [portfolio, setPortfolio] = useState(null);
    const [debts, setDebts] = useState(null);
    const [goals, setGoals] = useState(null);
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [debtsLoading, setDebtsLoading] = useState(true);
    const [goalsLoading, setGoalsLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const portfolioResponse = await axios.get('http://localhost:8000/api/portfolio/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setPortfolio(portfolioResponse.data);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
            } finally {
                setPortfolioLoading(false);
            }

            try {
                const debtsResponse = await axios.get('http://localhost:8000/api/debts/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setDebts(debtsResponse.data);
            } catch (error) {
                console.error('Error fetching debts data:', error);
            } finally {
                setDebtsLoading(false);
            }

            try {
                const goalsResponse = await axios.get('http://localhost:8000/api/goals/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`
                    }
                });
                setGoals(goalsResponse.data);
            } catch (error) {
                console.error('Error fetching goals data:', error);
            } finally {
                setGoalsLoading(false);
            }
        };

        fetchData();
    }, [authTokens]);

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <Box flexGrow={1} p={3} className="reports-page">
                <Grid container spacing={3}>
                    {/* Investment Portfolio Section */}
                    <Grid item xs={12} md={6}>
                        {portfolioLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            portfolio ? <InvestmentPortfolioPerformance portfolio={portfolio} /> : <Typography>No portfolio data available</Typography>
                        )}
                    </Grid>

                    {/* Debt and Liability Section */}
                    <Grid item xs={12} md={6}>
                        {debtsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            debts ? <DebtAndLiabilityReports debts={debts} /> : <Typography>No debt data available</Typography>
                        )}
                    </Grid>

                    {/* Savings and Goals Section */}
                    <Grid item xs={12} md={6}>
                        {goalsLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            goals ? <SavingsAndGoalsTracking goals={goals} /> : <Typography>No goals data available</Typography>
                        )}
                    </Grid>

                    {/* Goal Setting Section */}
                    <Grid item xs={12} md={6}>
                        <GoalSetting />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default ReportsPage;