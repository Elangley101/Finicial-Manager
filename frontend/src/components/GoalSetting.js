import React, { useState } from 'react';
import './css/GoalSetting.css';

const GoalSetting = () => {
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the goal data to your backend
        console.log("Goal Submitted:", { goalName, goalAmount, targetDate });
    };

    return (
        <div className="goal-setting">
            <h2>Set a New Goal</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Goal Name</label>
                    <input 
                        type="text" 
                        value={goalName} 
                        onChange={(e) => setGoalName(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Goal Amount</label>
                    <input 
                        type="number" 
                        value={goalAmount} 
                        onChange={(e) => setGoalAmount(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Target Date</label>
                    <input 
                        type="date" 
                        value={targetDate} 
                        onChange={(e) => setTargetDate(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" className="submit-btn">Set Goal</button>
            </form>
        </div>
    );
};

export default GoalSetting;
