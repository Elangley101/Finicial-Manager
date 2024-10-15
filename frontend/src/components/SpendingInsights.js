import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import AuthContext from '../context/AuthContext';

const SpendingInsights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/spending-insights/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setInsights(response.data);
            } catch (error) {
                console.error('Error fetching spending insights:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [authTokens]);

    if (loading) return <CircularProgress />;

    return (
        <div className="spending-insights">
            <h2>Spending Insights</h2>
            <ul>
                {insights.map(insight => (
                    <li key={insight.category}>
                        <h3>{insight.category}</h3>
                        <p>Total Spent: ${insight.total_spent.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SpendingInsights;
