import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import './css/GoalSetting.css';
import AuthContext from '../context/AuthContext';

const GoalSetting = () => {
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');  // Goal amount as a string initially
    const [targetDate, setTargetDate] = useState('');
    const [accounts, setAccounts] = useState([]);  // All accounts fetched from Plaid
    const [selectedAccounts, setSelectedAccounts] = useState([]);  // Accounts selected for the goal
    const [savedAmount, setSavedAmount] = useState(0);  // Track saved amount from selected accounts
    const [progress, setProgress] = useState(0);  // Track progress percentage
    const { authTokens } = useContext(AuthContext);

    // Fetch account data from Plaid API on component mount
    useEffect(() => {
        const fetchPlaidData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/plaid/accounts', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                console.log('Accounts fetched from Plaid:', response.data.accounts); // Log accounts fetched
                setAccounts(response.data.accounts);  // Set the fetched accounts
            } catch (error) {
                console.error('Error fetching account data:', error);
            }
        };

        fetchPlaidData();
    }, [authTokens]);

    // Handle account selection
    const handleAccountSelection = useCallback((accountId) => {
        setSelectedAccounts((prevSelected) => {
            const updatedSelection = prevSelected.includes(accountId)
                ? prevSelected.filter((id) => id !== accountId)
                : [...prevSelected, accountId];

            // Debugging selected accounts
            console.log('Selected Accounts:', updatedSelection);  // Log selected accounts for debugging

            // Update progress whenever selected accounts change
            updateProgress(updatedSelection);
            return updatedSelection;
        });
    }, [accounts, goalAmount]);

    // Update saved amount and progress percentage based on selected accounts
    const updateProgress = useCallback((selectedAccounts) => {
        console.log('Current goal amount (before parsing):', goalAmount);  // Debug raw goalAmount

        const parsedGoalAmount = parseFloat(goalAmount);  // Parse the goal amount as a float

        if (!parsedGoalAmount || isNaN(parsedGoalAmount)) {  // Ensure goalAmount is a valid number
            console.log('Invalid goal amount:', goalAmount);  // Debug invalid goal amount
            setProgress(0);
            setSavedAmount(0);
            return;
        }

        // Log selected accounts for each goal
        console.log('Selected accounts for the goal:', selectedAccounts);

        // Calculate total saved amount from selected accounts
        const totalSaved = accounts
            .filter(account => selectedAccounts.includes(account.account_id))  // Only selected accounts
            .reduce((acc, account) => {
                const accountBalance = parseFloat(account.balance);  // Ensure balance is parsed as a number
                console.log(`Processing account ID: ${account.account_id}, balance: ${account.balance}`);  // Log balance

                if (isNaN(accountBalance) || accountBalance === null || accountBalance === undefined) {
                    console.error(`Invalid or missing balance for account ${account.account_id}:`, account.balance);  // Log invalid balances
                    return acc;  // Skip invalid balances
                }

                return acc + accountBalance;  // Sum their balances
            }, 0);  // Sum their balances

        console.log('Total saved amount for goal:', totalSaved);  // Log total saved amount

        setSavedAmount(totalSaved);  // Update saved amount in state

        // Calculate progress percentage
        const progressPercentage = ((totalSaved / parsedGoalAmount) * 100).toFixed(2);
        console.log('Progress percentage:', progressPercentage);  // Debug progress percentage
        setProgress(isNaN(progressPercentage) ? 0 : progressPercentage);  // Ensure progress is valid
    }, [accounts, goalAmount]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const parsedGoalAmount = parseFloat(goalAmount);  // Parse goal amount to ensure it's a valid number

            if (isNaN(parsedGoalAmount)) {
                console.error('Invalid goal amount:', goalAmount);  // Debug invalid goal amount
                return;
            }

            // Debugging selected accounts before submission
            console.log('Submitting goal with accounts:', selectedAccounts);

            // Send goal data along with selected accounts to the backend
            const response = await axios.post(
                'http://localhost:8000/api/goals/',
                {
                    name: goalName,
                    target_amount: parsedGoalAmount,
                    target_date: targetDate,
                    accounts: selectedAccounts,  // Send the selected accounts' IDs
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
                                    {account.name}: ${account.balance !== undefined ? account.balance : 'No balance available'}  {/* Show account balance */}
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
                    <p>${savedAmount.toFixed(2)} / ${goalAmount}</p>  {/* Ensure saved amount is formatted */}
                </div>

                <button type="submit" className="submit-btn">Set Goal</button>
            </form>
        </div>
    );
};

export default GoalSetting;
