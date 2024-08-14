import React from 'react';
import Sidebar from '../components/Sidebar';
import RecentTransactions from '../components/RecentTransactions';
import TransactionForm from '../components/TransactionForm';

const TransactionsPage = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flexGrow: 1, padding: '16px' }} className="transactions-page">
                <RecentTransactions />
                <TransactionForm />
            </div>
        </div>
    );
};

export default TransactionsPage;
