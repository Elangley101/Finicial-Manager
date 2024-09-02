import React, { useEffect, useState, useContext } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; // Import Chart and registerables
import axios from 'axios';
import AuthContext from '../context/AuthContext';

// Register all necessary Chart.js components
Chart.register(...registerables);

const ExpenseIncomeChart = () => {
    const [chartData, setChartData] = useState(null);
    const { authTokens } = useContext(AuthContext); // Access the authTokens from the context

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/transaction-summary/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`, // Include the access token in the request
                    },
                });
                const { total_income, total_expense } = response.data;

                // Initialize chart data
                const data = {
                    labels: ['Income', 'Expense'],
                    datasets: [
                        {
                            label: 'Amount',
                            data: [total_income || 0, total_expense || 0], // Ensure values are provided or default to 0
                            backgroundColor: ['#4caf50', '#f44336'],
                        },
                    ],
                };

                setChartData(data);
            } catch (error) {
                console.error('Error fetching transaction summary:', error);
            }
        };

        fetchData();
    }, [authTokens]); // Add authTokens as a dependency to re-fetch data when tokens change

    if (!chartData) {
        return <p>Loading chart data...</p>; // Loading state while data is being fetched
    }

    return (
        <div>
            <h2>Income vs Expense</h2>
            <Pie 
                data={chartData} 
                options={{ 
                    responsive: true, 
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }} 
            />
        </div>
    );
};

export default ExpenseIncomeChart;
