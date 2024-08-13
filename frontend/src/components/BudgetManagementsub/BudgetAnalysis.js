import React from 'react';

const BudgetAnalysis = ({ budgets }) => {
    // Implement logic to analyze spending trends and suggest changes
    const totalSpent = budgets.reduce((acc, budget) => acc + budget.spent, 0);
    const totalAllocated = budgets.reduce((acc, budget) => acc + budget.allocated, 0);

    return (
        <div className="budget-analysis">
            <h2>Analysis and Insights</h2>
            <p>Total Spent: ${totalSpent}</p>
            <p>Total Allocated: ${totalAllocated}</p>
            <p>Overall Spending: {(totalSpent / totalAllocated * 100).toFixed(2)}%</p>
            {/* Add charts and graphs to visualize the data */}
        </div>
    );
};

export default BudgetAnalysis;