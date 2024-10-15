import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import AuthContext from '../context/AuthContext';

const GoalRecommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/goal-recommendations/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setRecommendations(response.data);
            } catch (error) {
                console.error('Error fetching goal recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [authTokens]);

    if (loading) return <CircularProgress />;

    return (
        <div className="goal-recommendations">
            <h2>Recommended Financial Goals</h2>
            <ul>
                {recommendations.map((recommendation, index) => (
                    <li key={index}>
                        <h3>{recommendation.goal}</h3>
                        <p>Suggested Amount: ${recommendation.suggested_amount.toFixed(2)}</p>
                        <p>Reason: {recommendation.reason}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalRecommendations;
