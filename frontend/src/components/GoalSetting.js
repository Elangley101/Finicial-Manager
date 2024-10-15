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
    const [savedAmount, setSavedAmount] = useState(0);
    const [progress, setProgress] = useState(0);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchPlaidData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                console.log('Accounts fetched from Plaid:', response.data.accounts);
                setAccounts(response.data.accounts);
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };

        fetchPlaidData();
    }, [authTokens]);

    const handleAccountSelection = useCallback((accountId) => {
        setSelectedAccounts((prevSelected) => {
            const updatedSelection = prevSelected.includes(accountId)
                ? prevSelected.filter((id) => id !== accountId)
                : [...prevSelected, accountId];
            console.log('Selected Accounts:', updatedSelection);
            updateProgress(updatedSelection);
            return updatedSelection;
        });
    }, [accounts, goalAmount]);

    const updateProgress = useCallback((selectedAccounts) => {
        console.log('Current goal amount (before parsing):', goalAmount);
        const parsedGoalAmount = parseFloat(goalAmount);
        if (!parsedGoalAmount || isNaN(parsedGoalAmount)) {
            console.log('Invalid goal amount:', goalAmount);
            setProgress(0);
            setSavedAmount(0);
            return;
        }

        console.log('Selected accounts for the goal:', selectedAccounts);

        const totalSaved = accounts
            .filter(account => selectedAccounts.includes(account.account_id))
            .reduce((acc, account) => {
                const accountBalance = parseFloat(account.balance);
                if (isNaN(accountBalance) || accountBalance === null || accountBalance === undefined) {
                    console.error(`Invalid or missing balance for account ${account.account_id}:`, account.balance);
                    return acc;
                }
                return acc + accountBalance;
            }, 0);

        console.log('Total saved amount for goal:', totalSaved);

        setSavedAmount(totalSaved);
        const progressPercentage = ((totalSaved / parsedGoalAmount) * 100).toFixed(2);
        console.log('Progress percentage:', progressPercentage);
        setProgress(isNaN(progressPercentage) ? 0 : progressPercentage);
    }, [accounts, goalAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const parsedGoalAmount = parseFloat(goalAmount);
        
            if (isNaN(parsedGoalAmount)) {
                console.error('Invalid goal amount:', goalAmount);
                return;
            }

            console.log('Submitting goal with accounts:', selectedAccounts);

            const response = await axios.post(
                'http://localhost:8000/api/goals/',
                {
                    name: goalName,
                    target_amount: parsedGoalAmount,
                    target_date: targetDate,
                    accounts: selectedAccounts,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                }
            );
            
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
                                    {account.name}: ${account.balance !== undefined ? account.balance : 'No balance available'}
                                </label>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="submit">Submit Goal</button>
            </form>
        </div>
    );
};

export default GoalSetting;
