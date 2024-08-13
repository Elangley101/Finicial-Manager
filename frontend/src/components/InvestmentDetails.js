import React from 'react';
import './css/InvestmentDetails.css';

const InvestmentDetails = ({ investment }) => {
    return (
        <div className="investment-details">
            <h2>{investment.name} Details</h2>
            <p>Type: {investment.type}</p>
            <p>Current Value: ${investment.value.toFixed(2)}</p>
            <p>Performance: {investment.performance}%</p>
            {/* Add more details as needed */}
        </div>
    );
};

export default InvestmentDetails;
