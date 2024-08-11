import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useContext(AuthContext); // Assuming AuthContext provides the user object
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user/data/', {
                    headers: {
                        Authorization: `Bearer ${user.token}` // Send the token in the Authorization header
                    }
                });
                setUserData(response.data);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };

        fetchUserData();
    }, [user]);

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Welcome, {userData.first_name}</h1>
            <p>Your email: {userData.email}</p>
            {/* Display other user-specific data here */}
        </div>
    );
};

export default Dashboard;