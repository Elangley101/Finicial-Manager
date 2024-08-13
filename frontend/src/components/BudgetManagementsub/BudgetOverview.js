const BudgetOverview = ({ budgets }) => {
    return (
        <div className="budget-overview">
            <h2>Current Budgets</h2>
            <ul>
                {budgets.map(budget => (
                    <li key={budget.id}>
                        <h3>{budget.name}</h3>
                        <p>Allocated: ${budget.allocated}</p>
                        <p>Spent: ${budget.spent}</p>
                        <p>Remaining: ${budget.allocated - budget.spent}</p>
                    </li>
                ))}
            </ul>
            {/* Add progress bars and visual elements here */}
        </div>
    );
};

export default BudgetOverview;