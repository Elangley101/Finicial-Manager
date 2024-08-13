import React from 'react';
import RecentTransactions from '../components/RecentTransactions';
import TransactionForm from '../components/TransactionForm';

const TransactionsPage = () => {
    return (
        <div className="transactions-page">
            <RecentTransactions />
            <TransactionForm />
        </div>
    );
};

export default TransactionsPage;
