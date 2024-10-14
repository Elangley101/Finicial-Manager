import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const FraudAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/fraud-alerts/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setAlerts(response.data);
            } catch (error) {
                console.error('Error fetching fraud alerts:', error);
            }
        };

        fetchAlerts();
    }, [authTokens]);

    return (
        <div className="fraud-alerts">
            <h2>Fraud Alerts</h2>
            <ul>
                {alerts.map(alert => (
                    <li key={alert.transaction_id}>
                        <h3>{alert.description}</h3>
                        <p>Amount: ${alert.amount.toFixed(2)}</p>
                        <p>Date: {new Date(alert.date).toLocaleDateString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FraudAlerts;

