import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, LinearProgress, Button } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Assuming you have an AuthContext for authentication

const SavingsAndGoalsTracking = () => {
    const [goals, setGoals] = useState([]);
    const { authTokens } = useContext(AuthContext); // Using authentication tokens from AuthContext
    const [loading, setLoading] = useState(true);  // State to manage loading
    const [error, setError] = useState(null);      // State to manage errors

    // Fetch the goals and their associated account balances from the backend
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/goals/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`, // Authentication header
                    },
                });
                const goalsData = response.data;
                setGoals(goalsData); // Set the goals in state
                // Fetch account balances for each goal
                const updatedGoals = await Promise.all(
                    goalsData.map(async (goal) => {
                        const balanceResponse = await axios.get(`http://localhost:8000/api/goals/${goal.id}/account-balances/`, {
                            headers: {
                                'Authorization': `Bearer ${authTokens.access}`,
                            },
                        });
                        return {
                            ...goal,
                            total_balance: balanceResponse.data.total_balance,
                            accounts: balanceResponse.data.accounts,
                        };
                    })
                );
                setGoals(updatedGoals); // Update goals with account balances
            } catch (err) {
                setError('Failed to fetch goals');
                console.error('Error fetching goals:', err);
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchGoals(); // Fetch goals when component mounts
    }, [authTokens]);

    // Function to handle goal deletion
    const deleteGoal = async (goalId) => {
        if (window.confirm('Are you sure you want to delete this goal?')) {
            try {
                await axios.delete(`http://localhost:8000/api/goals/${goalId}/`, {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setGoals(goals.filter(goal => goal.id !== goalId)); // Remove deleted goal from state
            } catch (err) {
                console.error('Error deleting goal:', err);
                setError('Failed to delete goal');
            }
        }
    };

    if (loading) {
        return <Typography variant="body1">Loading goals...</Typography>;
    }

    if (error) {
        return <Typography variant="body1" color="error">{error}</Typography>;
    }

    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h6" gutterBottom>
                Savings and Goals Tracking
            </Typography>
            {goals && goals.length > 0 ? (
                goals.map(goal => {
                    const savedAmount = parseFloat(goal.total_balance) || 0;
                    const targetAmount = parseFloat(goal.target_amount) || 0;
                    const progress = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;

                    return (
                        <Box key={goal.id} mb={2}>
                            <Typography variant="subtitle1">{goal.name} (Goal: ${targetAmount.toFixed(2)})</Typography>
                            <Typography variant="body2">Saved: ${savedAmount.toFixed(2)} / ${targetAmount.toFixed(2)}</Typography>
                            <Typography variant="body2" color="textSecondary">
                                Associated Accounts:
                                <ul>
                                    {(goal.accounts || []).map(account => (
                                        <li key={account.account_id}>
                                            {account.name}: ${account.balance} (Account ID: {account.account_id})
                                        </li>
                                    ))}
                                </ul>
                            </Typography>
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                                {progress.toFixed(2)}% Complete
                            </Typography>

                            {/* Delete Button */}
                            <Button 
                                variant="outlined" 
                                color="error" 
                                onClick={() => deleteGoal(goal.id)} 
                                style={{ marginTop: '8px' }}
                            >
                                Delete Goal
                            </Button>
                        </Box>
                    );
                })
            ) : (
                <Typography variant="body2" color="textSecondary">
                    No goals found. Please add a goal to track your progress.
                </Typography>
            )}
        </Paper>
    );
};


export default SavingsAndGoalsTracking;