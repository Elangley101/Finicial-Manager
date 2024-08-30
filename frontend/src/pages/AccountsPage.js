// ./pages/AccountsPage.js
import React from 'react';
import AccountsList from '../components/AccountsList';
import TotalBalance from '../components/TotalBalance';
import RecentTransactions from '../components/RecentTransactions';
import LinkAccountButton from '../components/LinkAccountButton';

const AccountsPage = () => {
    const accounts = [
        { name: 'Checking Account', accountNumber: '1234', balance: 2000.50, lastTransaction: '2024-08-28' },
        { name: 'Savings Account', accountNumber: '5678', balance: 10500.75, lastTransaction: '2024-08-27' },
    ];

    const transactions = [
        { date: '2024-08-28', description: 'Grocery Store', amount: 45.99 },
        { date: '2024-08-27', description: 'Online Purchase', amount: 129.99 },
    ];

    const handleLinkAccount = () => {
        alert('Link a new account functionality to be implemented.');
    };

    return (
        <div>
            <h1>Accounts Overview</h1>
            <TotalBalance accounts={accounts} />
            <AccountsList accounts={accounts} />
            <RecentTransactions transactions={transactions} />
            <LinkAccountButton onLinkAccount={handleLinkAccount} />
        </div>
    );
};

export default AccountsPage;
