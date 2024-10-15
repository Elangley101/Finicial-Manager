import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import AuthContext from '../context/AuthContext';

const CreditScore = () => {
    const [creditScore, setCreditScore] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchCreditScore = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/credit-score/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setCreditScore(response.data);
            } catch (error) {
                console.error('Error fetching credit score:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCreditScore();
    }, [authTokens]);

    if (loading) return <CircularProgress />;

    if (!creditScore) return <div>No credit score data available.</div>;

    return (
        <div className="credit-score">
            <h2>Credit Score</h2>
            <p>Your current credit score is: {creditScore.score}</p>
            <p>Score Range: {creditScore.range}</p>
            {/* Add more insights or visualizations as needed */}
        </div>
    );
};

export default CreditScore;
