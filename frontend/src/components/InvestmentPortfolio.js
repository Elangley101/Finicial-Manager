import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import './css/InvestmentPortfolio.css';

const InvestmentPortfolio = () => {
    const [investments, setInvestments] = useState([]);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/investments/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setInvestments(response.data);
            } catch (error) {
                console.error('Error fetching investments:', error);
            }
        };

        fetchInvestments();
    }, [authTokens]);

    const totalValue = investments.reduce((acc, investment) => acc + investment.market_value, 0);

    return (
        <div className="investment-portfolio">
            <h2>Investment Portfolio</h2>
            <div className="portfolio-summary">
                <p>Total Value: ${totalValue.toFixed(2)}</p>
                <p>Number of Investments: {investments.length}</p>
            </div>
            <div className="investment-list">
                {investments.map(investment => (
                    <div key={investment.account_id} className="investment-item">
                        <h3>{investment.name}</h3>
                        <p>Type: {investment.type}</p>
                        <p>Value: ${investment.market_value.toFixed(2)}</p>
                        <p>Performance: {investment.performance}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvestmentPortfolio;
