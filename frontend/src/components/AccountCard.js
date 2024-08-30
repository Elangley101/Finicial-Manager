// src/components/AccountCard.js
import React from 'react';

const AccountCard = ({ accountName, accountNumber, balance, lastTransaction }) => {
    return (
        <div className="account-card">
            <h3>{accountName}</h3>
            <p>Account Number: {accountNumber}</p>
            <p>Balance: {balance}</p>
            <p>Last Transaction: {lastTransaction}</p>
        </div>
    );
};

export default AccountCard;
