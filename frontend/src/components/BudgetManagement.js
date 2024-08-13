import React, { useState } from 'react';
import BudgetOverview from './BudgetManagementsub/BudgetOverview';
import CreateBudget from './BudgetManagementsub/CreateBudget';
import BudgetProgress from './BudgetManagementsub/BudgetProgress';
import BudgetActions from './BudgetManagementsub/BudgetActions';
import BudgetAnalysis from './BudgetManagementsub/BudgetAnalysis';
import './BudgetManagementsub/BudgetManagement.css'; 

const BudgetManagement = () => {
    const [budgets, setBudgets] = useState([]);

    const handleCreateBudget = (newBudget) => {
        setBudgets([...budgets, { ...newBudget, id: budgets.length + 1, spent: 0 }]);
    };

    const handleEditBudget = (updatedBudget) => {
        setBudgets(budgets.map(b => (b.id === updatedBudget.id ? updatedBudget : b)));
    };

    const handleDeleteBudget = (id) => {
        setBudgets(budgets.filter(b => b.id !== id));
    };

    return (
        <div className="budget-management">
            <h2>Budget Management</h2>
            <BudgetOverview budgets={budgets} />
            <CreateBudget onCreate={handleCreateBudget} />
            <BudgetProgress budgets={budgets} />
            {budgets.map(budget => (
                <BudgetActions
                    key={budget.id}
                    budget={budget}
                    onEdit={handleEditBudget}
                    onDelete={handleDeleteBudget}
                />
            ))}
            <BudgetAnalysis budgets={budgets} />
        </div>
    );
};

export default BudgetManagement;