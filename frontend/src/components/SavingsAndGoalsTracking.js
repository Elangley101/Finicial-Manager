import React from 'react';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';

const SavingsAndGoalsTracking = ({ goals }) => {
    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h6" gutterBottom>
                Savings and Goals Tracking
            </Typography>
            {goals.map(goal => (
                <Box key={goal.id} mb={2}>
                    <Typography variant="subtitle1">{goal.name} (Goal: ${goal.targetAmount})</Typography>
                    <Typography variant="body2">Saved: ${goal.savedAmount} / ${goal.targetAmount}</Typography>
                    <LinearProgress variant="determinate" value={(goal.savedAmount / goal.targetAmount) * 100} />
                </Box>
            ))}
        </Paper>
    );
};

export default SavingsAndGoalsTracking;
