import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const BillReminders = () => {
    const [reminders, setReminders] = useState([]);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/bill-reminders/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setReminders(response.data);
            } catch (error) {
                console.error('Error fetching bill reminders:', error);
            }
        };

        fetchReminders();
    }, [authTokens]);

    return (
        <div className="bill-reminders">
            <h2>Upcoming Bill Reminders</h2>
            <ul>
                {reminders.map(reminder => (
                    <li key={reminder.name}>
                        <h3>{reminder.name}</h3>
                        <p>Amount: ${reminder.amount.toFixed(2)}</p>
                        <p>Due Date: {new Date(reminder.due_date).toLocaleDateString()}</p>
                        <p>Frequency: {reminder.frequency}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BillReminders;

