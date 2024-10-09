import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const DebtOverview = () => {
    const [debtAccounts, setDebtAccounts] = useState([]);
    const [debtTransactions, setDebtTransactions] = useState([]);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchDebtData = async () => {
            try {
                const accountsResponse = await axios.get('http://localhost:8000/api/debt-accounts/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setDebtAccounts(accountsResponse.data);

                const transactionsResponse = await axios.get('http://localhost:8000/api/debt-transactions/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setDebtTransactions(transactionsResponse.data);
            } catch (error) {
                console.error('Error fetching debt data:', error);
            }
        };

        fetchDebtData();
    }, [authTokens]);

    return (
        <div className="debt-overview">
            <h2>Debt Overview</h2>
            <h3>Accounts</h3>
            <ul>
                {debtAccounts.map(account => (
                    <li key={account.account_id}>
                        <p>{account.name}: ${account.balances.current.toFixed(2)}</p>
                    </li>
                ))}
            </ul>
            <h3>Transactions</h3>
            <ul>
                {debtTransactions.map(transaction => (
                    <li key={transaction.transaction_id}>
                        <p>{transaction.name}: ${transaction.amount.toFixed(2)} on {transaction.date}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DebtOverview;
