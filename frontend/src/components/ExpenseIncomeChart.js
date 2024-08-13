import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Mock Data (Replace this with real data from props or state)
const data = [
  {
    name: 'January', Income: 4000, Expenses: 2400,
  },
  {
    name: 'February', Income: 3000, Expenses: 1398,
  },
  {
    name: 'March', Income: 2000, Expenses: 9800,
  },
  {
    name: 'April', Income: 2780, Expenses: 3908,
  },
  {
    name: 'May', Income: 1890, Expenses: 4800,
  },
  {
    name: 'June', Income: 2390, Expenses: 3800,
  },
  {
    name: 'July', Income: 3490, Expenses: 4300,
  },
];

const ExpenseIncomeChart = () => {
  return (
    <div className="expense-income-chart" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#343a40' }}>Income vs Expenses</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Income" fill="#82ca9d" />
          <Bar dataKey="Expenses" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExpenseIncomeChart;
