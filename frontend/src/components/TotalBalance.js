// ./components/TotalBalance.js
import React from 'react';

const TotalBalance = ({ accounts }) => {
    const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

    return (
        <div className="total-balance">
            <h2>Total Balance: ${totalBalance.toFixed(2)}</h2>
        </div>
    );
};

export default TotalBalance;
