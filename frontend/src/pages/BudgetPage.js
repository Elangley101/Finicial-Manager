import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import BudgetManagement from '../components/BudgetManagement';
import BudgetOverview from '../components/BudgetManagementsub/BudgetOverview';
import BudgetProgress from '../components/BudgetManagementsub/BudgetProgress';
import BudgetAnalysis from '../components/BudgetManagementsub/BudgetAnalysis';
import AuthContext from '../context/AuthContext';

const BudgetPage = () => {
    const [budgets, setBudgets] = useState([]);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/budgets/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setBudgets(response.data);
            } catch (error) {
                console.error('Error fetching budgets:', error);
            }
        };

        fetchBudgets();
    }, [authTokens]);

    return (
        <div className="budget-page">
            <BudgetManagement />
            <BudgetOverview budgets={budgets} />
            <BudgetProgress budgets={budgets} />
            <BudgetAnalysis budgets={budgets} />
        </div>
    );
};

export default BudgetPage;
