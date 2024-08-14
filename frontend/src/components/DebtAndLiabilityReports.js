import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DebtAndLiabilityReports = ({ debts }) => {
    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h6" gutterBottom>
                Debt and Liability Reports
            </Typography>
            <List>
                {debts.map(debt => (
                    <ListItem key={debt.id}>
                        <ListItemText primary={debt.name} secondary={`Balance: $${debt.balance} - Interest Rate: ${debt.interestRate}%`} />
                    </ListItem>
                ))}
            </List>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={debts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="balance" stroke="#8884d8" />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default DebtAndLiabilityReports;
