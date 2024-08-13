import React from 'react';
import './css/GoalsOverview.css';

// Mock Data (Replace with real data from backend)
const goals = [
    {
        id: 1,
        name: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 5000,
        targetDate: '2024-12-31',
    },
    {
        id: 2,
        name: 'Vacation',
        targetAmount: 3000,
        currentAmount: 1000,
        targetDate: '2024-06-30',
    },
];

const GoalsOverview = () => {
    return (
        <div className="goals-overview">
            <h2>Goals Overview</h2>
            <div className="goal-list">
                {goals.map(goal => (
                    <div key={goal.id} className="goal-item">
                        <h3>{goal.name}</h3>
                        <p>Target Amount: ${goal.targetAmount.toFixed(2)}</p>
                        <p>Current Amount: ${goal.currentAmount.toFixed(2)}</p>
                        <p>Target Date: {goal.targetDate}</p>
                        <div className="progress-bar">
                            <div 
                                className="progress" 
                                style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalsOverview;
