import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const ExpenseIncomeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the backend API
    fetch('/api/transactions/summary/')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching transaction summary:', error));
  }, []);

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
