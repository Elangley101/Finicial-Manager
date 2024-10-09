import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
const BudgetManagement = () => {
    const { authTokens } = useContext(AuthContext);
    const [budgets, setBudgets] = useState([]);
    const [newBudget, setNewBudget] = useState({ category: '', allocated_amount: 0 });

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const response = await axios.get('/api/budgets/', {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const handleCreateBudget = async () => {
        try {
            const response = await axios.post('/api/budgets/', newBudget, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            setBudgets([...budgets, response.data]);
            setNewBudget({ category: '', allocated_amount: 0 });
        } catch (error) {
            console.error('Error creating budget:', error);
        }
    };

    return (
        <div className="budget-management">
            <h2>Budget Management</h2>
            <div>
                <input
                    type="text"
                    placeholder="Category"
                    value={newBudget.category}
                    onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                />
                <input
                    type="number"
                    placeholder="Allocated Amount"
                    value={newBudget.allocated_amount}
                    onChange={(e) => setNewBudget({ ...newBudget, allocated_amount: parseFloat(e.target.value) })}
                />
                <button onClick={handleCreateBudget}>Create Budget</button>
            </div>
            <ul>
                {budgets.map(budget => (
                    <li key={budget.id}>
                        <h3>{budget.category}</h3>
                        <p>Allocated: ${budget.allocated_amount.toFixed(2)}</p>
                        <p>Spent: ${budget.spent_amount.toFixed(2)}</p>
                        <p>Remaining: ${(budget.allocated_amount - budget.spent_amount).toFixed(2)}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BudgetManagement;