import React, { useEffect, useState, useContext } from 'react';
import { List, ListItem, ListItemText, Typography, Divider } from '@mui/material';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/transactions/recent/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
    }, [authTokens]);

    return (
        <List>
            {transactions.length === 0 ? (
                <Typography>No transactions found.</Typography>
            ) : (
                transactions.map((transaction) => (
                    <React.Fragment key={transaction.id}>
                        <ListItem>
                            <ListItemText
                                primary={`${transaction.description} - $${transaction.amount}`}
                                secondary={`${transaction.date} | ${transaction.category}`}
                            />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))
            )}
        </List>
    );
};

export default TransactionList;
