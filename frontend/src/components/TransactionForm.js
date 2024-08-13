// src/components/TransactionForm.js

import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const TransactionForm = () => {
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/transactions/', {
                date,
                description,
                amount,
                category,
                type,
            });
            // Handle success (e.g., reset form or display a message)
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                required
                sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <MenuItem value="Groceries">Groceries</MenuItem>
                    <MenuItem value="Rent">Rent</MenuItem>
                    <MenuItem value="Salary">Salary</MenuItem>
                    {/* Add more categories as needed */}
                </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <MenuItem value="income">Income</MenuItem>
                    <MenuItem value="expense">Expense</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
                Add Transaction
            </Button>
        </Box>
    );
};

export default TransactionForm;
