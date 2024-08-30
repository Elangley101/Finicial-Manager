import React, { useState, useEffect } from 'react';
import './css/GoalsOverview.css';

const GoalsOverview = () => {
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        // Fetch goals from the backend API
        fetch('/api/goals/')
            .then(response => response.json())
            .then(data => setGoals(data))
            .catch(error => console.error('Error fetching goals:', error));
    }, []);

    return (
        <div className="goals-overview">
            <h2>Goals Overview</h2>
            <div className="goal-list">
                {goals.length > 0 ? (
                    goals.map(goal => (
                        <div key={goal.id} className="goal-item">
                            <h3>{goal.name}</h3>
                            <p>Target Amount: ${goal.target_amount.toFixed(2)}</p>
                            <p>Current Amount: ${goal.current_amount.toFixed(2)}</p>
                            <p>Target Date: {goal.target_date}</p>
                            <div className="progress-bar">
                                <div 
                                    className="progress" 
                                    style={{ width: `${(goal.current_amount / goal.target_amount) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No goals available.</p>
                )}
            </div>
        </div>
    );
};

export default GoalsOverview;
