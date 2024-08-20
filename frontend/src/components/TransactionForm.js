import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';

const TransactionForm = () => {
    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('expense');

    // Hardcoded categories that match the model's CATEGORY_CHOICES
    const categories = [
        { value: 'groceries', label: 'Groceries' },
        { value: 'rent', label: 'Rent' },
        { value: 'salary', label: 'Salary' },
        { value: 'entertainment', label: 'Entertainment' },
        { value: 'utilities', label: 'Utilities' },
        { value: 'transportation', label: 'Transportation' },
        { value: 'dining', label: 'Dining' },
        { value: 'healthcare', label: 'Healthcare' },
        { value: 'insurance', label: 'Insurance' },
        { value: 'savings', label: 'Savings' },
        { value: 'investments', label: 'Investments' },
        { value: 'debt_payment', label: 'Debt Payment' },
        { value: 'charity', label: 'Charity' },
        { value: 'education', label: 'Education' },
        { value: 'personal_care', label: 'Personal Care' },
        { value: 'other', label: 'Other' },
    ];

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
            // Reset form or display success message
            setDate('');
            setDescription('');
            setAmount('');
            setCategory('');
            setType('expense');
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
                    {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                            {cat.label}
                        </MenuItem>
                    ))}
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
