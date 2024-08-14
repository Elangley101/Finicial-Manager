import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const InvestmentPortfolioPerformance = ({ portfolio }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Paper elevation={3} style={{ padding: '16px', marginBottom: '16px' }}>
            <Typography variant="h6" gutterBottom>
                Investment Portfolio Performance
            </Typography>
            <Box>
                <Typography variant="subtitle1">Portfolio Growth: {portfolio.growth}%</Typography>
                <Typography variant="subtitle1">Overall Returns: ${portfolio.returns}</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={portfolio.assets}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        label
                    >
                        {portfolio.assets.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default InvestmentPortfolioPerformance;
