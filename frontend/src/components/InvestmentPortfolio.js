import React from 'react';
import './css/InvestmentPortfolio.css';

// Mock Data (Replace with real data from props or state)
const investments = [
    {
        id: 1,
        name: 'Apple Inc.',
        type: 'Stock',
        value: 12000,
        performance: 5.6, // in percentage
    },
    {
        id: 2,
        name: 'Vanguard S&P 500 ETF',
        type: 'ETF',
        value: 8000,
        performance: 3.2, // in percentage
    },
    {
        id: 3,
        name: 'Bitcoin',
        type: 'Cryptocurrency',
        value: 15000,
        performance: 12.8, // in percentage
    },
];

const InvestmentPortfolio = () => {
    const totalValue = investments.reduce((acc, investment) => acc + investment.value, 0);

    return (
        <div className="investment-portfolio">
            <h2>Investment Portfolio</h2>
            <div className="portfolio-summary">
                <p>Total Value: ${totalValue.toFixed(2)}</p>
                <p>Number of Investments: {investments.length}</p>
            </div>
            <div className="investment-list">
                {investments.map(investment => (
                    <div key={investment.id} className="investment-item">
                        <h3>{investment.name}</h3>
                        <p>Type: {investment.type}</p>
                        <p>Value: ${investment.value.toFixed(2)}</p>
                        <p>Performance: {investment.performance}%</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InvestmentPortfolio;
