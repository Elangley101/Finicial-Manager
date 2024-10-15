import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import AuthContext from '../context/AuthContext';

const Insights = () => {
    const [insights, setInsights] = useState([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/insights/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setInsights(response.data.insights || []); // Ensure insights is an array
            } catch (error) {
                console.error('Error fetching insights:', error);
                setInsights([]); // Set to empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, [authTokens]);

    if (loading) return <CircularProgress />;

    return (
        <div className="insights">
            <h2>AI-Powered Insights</h2>
            {insights.length > 0 ? (
                <ul>
                    {insights.map((insight, index) => (
                        <li key={index}>{insight}</li>
                    ))}
                </ul>
            ) : (
                <p>No insights available at the moment.</p>
            )}
        </div>
    );
};

export default Insights;
