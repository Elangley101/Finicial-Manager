import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, Box, Button, Collapse, CircularProgress, Alert } from '@mui/material';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import TransactionForm from '../components/TransactionForm';
import CSVUpload from '../components/CSVUpload';
import ExpenseIncomeChart from '../components/ExpenseIncomeChart';
import TransactionList from '../components/TransactionList';
import Sidebar from '../components/Sidebar';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const TransactionPage = () => {
    const [open, setOpen] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                
                console.log('API Response:', response.data); // Log the response data

                // Check if response.data is an array or contains an array
                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else if (response.data && Array.isArray(response.data.transactions)) {
                    setTransactions(response.data.transactions);
                } else {
                    setError('Unexpected response format');
                }
            } catch (error) {
                setError('Failed to fetch transactions from Plaid.');
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [authTokens]);

    const handleToggle = () => {
        setOpen(!open);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    // Ensure transactions is an array before using reduce
    const data = Array.isArray(transactions) ? transactions.reduce((acc, transaction) => {
        const category = transaction.category[0] || 'Other';
        const amount = Math.abs(transaction.amount);
        const existingCategory = acc.find(item => item.name === category);
        if (existingCategory) {
            existingCategory.value += amount;
        } else {
            acc.push({ name: category, value: amount });
        }
        return acc;
    }, []) : [];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />

            <Container sx={{ flexGrow: 1, ml: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Transactions Overview
                </Typography>

                <ExpenseIncomeChart />

                <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
                    Your Transactions
                </Typography>
                <TransactionList transactions={transactions} />

                <Button variant="contained" onClick={handleToggle} sx={{ mt: 4 }}>
                    {open ? 'Hide' : 'Add Transactions / Upload CSV'}
                </Button>
                <Collapse in={open} sx={{ mt: 2 }}>
                    <TransactionForm />
                    <CSVUpload />
                </Collapse>
            </Container>
        </Box>
    );
};

export default TransactionPage;
