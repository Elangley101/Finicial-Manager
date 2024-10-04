import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import './css/GoalSetting.css';
import AuthContext from '../context/AuthContext';

const GoalSetting = () => {
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [targetDate, setTargetDate] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);
    const [savedAmount, setSavedAmount] = useState(0); // Track saved amount
    const [progress, setProgress] = useState(0); // Track progress percentage
    const { authTokens } = useContext(AuthContext);

    // Fetch account/transaction data from Plaid on component mount
    useEffect(() => {
        const fetchPlaidData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setAccounts(response.data.accounts);
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };

        fetchPlaidData();
    }, [authTokens]);

    // Handle account selection with useCallback to prevent unnecessary re-renders
    const handleAccountSelection = useCallback((accountId) => {
        setSelectedAccounts((prevSelected) => {
            const updatedSelection = prevSelected.includes(accountId)
                ? prevSelected.filter((id) => id !== accountId)
                : [...prevSelected, accountId];
            
            updateProgress(updatedSelection);
            return updatedSelection;
        });
    }, [accounts, goalAmount]);

    // Update saved amount and progress
    const updateProgress = useCallback((selectedAccounts) => {
        if (!goalAmount) return;

        // Calculate saved amount from selected accounts
        const totalSaved = accounts
            .filter(account => selectedAccounts.includes(account.account_id))
            .reduce((acc, account) => acc + parseFloat(account.balance), 0);

        setSavedAmount(totalSaved);

        const progressPercentage = ((totalSaved / goalAmount) * 100).toFixed(2);
        setProgress(progressPercentage);
    }, [accounts, goalAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const amount = parseFloat(goalAmount);

            // Send goal data and selected accounts to the backend
            const response = await axios.post('http://localhost:8000/api/goals/', {
                name: goalName,
                target_amount: amount,
                target_date: targetDate,
                accounts: selectedAccounts,
            }, {
                headers: {
                    'Authorization': `Bearer ${authTokens.access}`,
                },
            });
            console.log('Goal successfully created:', response.data);
        } catch (error) {
            console.error('Error submitting goal:', error);
        }
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

                {/* Display accounts with checkboxes */}
                <div className="form-group">
                    <label>Select Accounts to Contribute</label>
                    <ul className="account-list">
                        {accounts.map(account => (
                            <li key={account.account_id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        value={account.account_id}
                                        checked={selectedAccounts.includes(account.account_id)}
                                        onChange={() => handleAccountSelection(account.account_id)}
                                    />
                                    {account.name}: ${account.balance}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Show goal progress and saved amount */}
                <div className="form-group">
                    <label>Goal Progress:</label>
                    <progress value={progress} max="100" />
                    <span>{progress}%</span>
                </div>
                <div className="form-group">
                    <label>Saved Amount:</label>
                    <p>${savedAmount} / ${goalAmount}</p>
                </div>

                <button type="submit" className="submit-btn">Set Goal</button>
            </form>
        </div>
    );
};

export default GoalSetting;
