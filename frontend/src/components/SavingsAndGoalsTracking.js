import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Assuming you have an AuthContext for authentication

const SavingsAndGoalsTracking = () => {
    const [goals, setGoals] = useState([]);
    const { authTokens } = useContext(AuthContext); // Using authentication tokens from AuthContext
    const [loading, setLoading] = useState(true);  // State to manage loading
    const [error, setError] = useState(null);      // State to manage errors

    // Fetch the goals from the backend when the component mounts
    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/goals/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`, // Authentication header
                    },
                });
                setGoals(response.data); // Set the goals in state
            } catch (err) {
                setError('Failed to fetch goals');
                console.error('Error fetching goals:', err);
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchGoals(); // Fetch goals when component mounts
    }, [authTokens]);

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
                    const savedAmount = goal.saved_amount || 0; // Adjust key names based on API response
                    const targetAmount = goal.target_amount || 0; // Adjust key names based on API response
                    const progress = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;

                    return (
                        <Box key={goal.id} mb={2}>
                            <Typography variant="subtitle1">{goal.name} (Goal: ${targetAmount})</Typography>
                            <Typography variant="body2">Saved: ${savedAmount} / ${targetAmount}</Typography>
                            <LinearProgress variant="determinate" value={progress} />
                            <Typography variant="body2" color="textSecondary" style={{ marginTop: '8px' }}>
                                {progress.toFixed(2)}% Complete
                            </Typography>
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
