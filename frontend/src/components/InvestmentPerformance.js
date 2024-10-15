import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import AuthContext from '../context/AuthContext';

const InvestmentPerformance = () => {
    const [performance, setPerformance] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/investment-performance/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setPerformance(response.data);
            } catch (error) {
                console.error('Error fetching investment performance:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, [authTokens]);

    if (loading) return <CircularProgress />;

    if (!performance) return <div>No performance data available.</div>;

    return (
        <div className="investment-performance">
            <h2>Investment Performance</h2>
            <p>Total Value: ${performance.total_value.toFixed(2)}</p>
            <p>Total Cost: ${performance.total_cost.toFixed(2)}</p>
            <p>ROI: {performance.roi.toFixed(2)}%</p>
            <h3>Holdings</h3>
            <ul>
                {performance.holdings.map(holding => (
                    <li key={holding.name}>
                        <p>{holding.name}: ${holding.market_value.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InvestmentPerformance;
