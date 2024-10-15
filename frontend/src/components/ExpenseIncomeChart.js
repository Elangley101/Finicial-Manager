import React, { useEffect, useState, useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; 
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import AuthContext from '../context/AuthContext';

// Register all necessary Chart.js components
Chart.register(...registerables);

const ExpenseIncomeChart = () => {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                const accounts = response.data.transactions; // Access the accounts array
                let total_income = 0;
                let total_expense = 0;
                    
                // Iterate over each account to calculate total income and expenses
                accounts.forEach(transaction => {
                        if (transaction.amount > 0) {
                            total_income += transaction.amount;
                        } else {
                            total_expense += Math.abs(transaction.amount);
                        }
                });

                console.log('Total Income:', total_income); // Log total income
                console.log('Total Expense:', total_expense); // Log total expense

                // Initialize chart data
                const data = {
                    labels: ['Income', 'Expense'],
                    datasets: [
                        {
                            label: 'Amount',
                            data: [total_income, total_expense],
                            backgroundColor: ['#4caf50', '#f44336'],
                        },
                    ],
                };

                console.log('Chart Data:', data); // Log the chart data
                setChartData(data);
            } catch (error) {
                console.error('Error fetching accounts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [authTokens]);

    if (loading) {
        return <CircularProgress />; // Loading spinner while data is being fetched
    }

    return (
        <div>
            <h2>Income vs Expense</h2>
            <Pie 
                data={chartData} 
                options={{ 
                    responsive: true, 
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Income vs Expense Chart'
                        }
                    }
                }} 
            />
        </div>
    );
};

export default ExpenseIncomeChart;
