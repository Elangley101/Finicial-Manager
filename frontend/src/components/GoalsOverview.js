import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext'; // Ensure AuthContext is imported
import './css/GoalsOverview.css'; // Ensure this path is correct

const GoalsOverview = () => {
    const [goals, setGoals] = useState([]);
    const { authTokens } = useContext(AuthContext); // Use AuthContext to get auth tokens

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/goals/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`, // Include auth token
                    },
                });
                setGoals(response.data);
            } catch (error) {
                console.error('Error fetching goals:', error);
            }
        };

        if (authTokens) {
            fetchGoals();
        }
    }, [authTokens]);

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Goals Overview
            </Typography>
            <Box className="goal-list">
                {goals.length > 0 ? (
                    goals.map(goal => {
                        const targetAmount = parseFloat(goal.target_amount) || 0;
                        const currentAmount = parseFloat(goal.current_amount) || 0;
                        const progress = (currentAmount / targetAmount) * 100 || 0;

                        return (
                            <Paper key={goal.id} className="goal-item" sx={{ p: 2, mb: 2 }}>
                                <Typography variant="h6">{goal.name}</Typography>
                                <Typography variant="body2">
                                    Target Amount: ${targetAmount.toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    Current Amount: ${currentAmount.toFixed(2)}
                                </Typography>
                                <Typography variant="body2">
                                    Target Date: {goal.target_date}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{ mt: 1, mb: 1 }}
                                />
                                <Typography variant="body2" color="textSecondary">
                                    {progress.toFixed(2)}% Complete
                                </Typography>
                            </Paper>
                        );
                    })
                ) : (
                    <Typography>No goals available.</Typography>
                )}
            </Box>
        </Box>
    );
};

export default GoalsOverview;
