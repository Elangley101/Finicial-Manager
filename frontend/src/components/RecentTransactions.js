import React from 'react';
import { List, Avatar } from 'antd';

// Mock Data (Replace this with real data from props or state)
const transactions = [
  {
    id: 1,
    name: 'Grocery Store',
    date: '2024-08-10',
    amount: -50.25,
    type: 'debit',
  },
  {
    id: 2,
    name: 'Salary',
    date: '2024-08-01',
    amount: 1500.00,
    type: 'credit',
  },
  {
    id: 3,
    name: 'Electric Bill',
    date: '2024-08-05',
    amount: -75.00,
    type: 'debit',
  },
  {
    id: 4,
    name: 'Gym Membership',
    date: '2024-08-08',
    amount: -25.00,
    type: 'debit',
  },
];

const RecentTransactions = () => {
  return (
    <div className="recent-transactions" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#343a40' }}>Recent Transactions</h2>
      <List
        itemLayout="horizontal"
        dataSource={transactions}
        renderItem={transaction => (
          <List.Item style={{ padding: '10px 0', borderBottom: '1px solid #dee2e6' }}>
            <List.Item.Meta
              avatar={<Avatar style={{ backgroundColor: transaction.type === 'credit' ? '#28a745' : '#dc3545', color: '#ffffff' }}>{transaction.type === 'credit' ? '+' : '-'}</Avatar>}
              title={<span style={{ color: '#495057' }}>{transaction.name}</span>}
              description={<span style={{ color: '#6c757d' }}>{transaction.date}</span>}
            />
            <div style={{ color: transaction.type === 'credit' ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
              {transaction.type === 'credit' ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default RecentTransactions;
