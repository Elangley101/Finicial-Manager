import React from 'react';

const BudgetProgress = ({ budgets }) => {
    return (
        <div className="budget-progress">
            <h2>Budget Progress</h2>
            {budgets.map(budget => (
                <div key={budget.id}>
                    <h3>{budget.name}</h3>
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{
                                width: `${(budget.spent / budget.allocated) * 100}%`,
                                backgroundColor: budget.spent > budget.allocated ? 'red' : 'green',
                            }}
                        ></div>
                    </div>
                    <p>{budget.spent} / {budget.allocated}</p>
                </div>
            ))}
        </div>
    );
};

export default BudgetProgress;