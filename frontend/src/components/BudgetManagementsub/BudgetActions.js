import React from 'react';

const BudgetActions = ({ budget, onEdit, onDelete }) => {
    return (
        <div className="budget-actions">
            <h3>{budget.name}</h3>
            <button onClick={() => onEdit(budget)}>Edit</button>
            <button onClick={() => onDelete(budget.id)}>Delete</button>
        </div>
    );
};

export default BudgetActions;