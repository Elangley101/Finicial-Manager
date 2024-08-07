import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
    const { user, logoutUser } = useContext(AuthContext);

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user ? user.email : 'Guest'}</p>
            {user && <button onClick={logoutUser}>Logout</button>}
        </div>
    );
};

export default Dashboard;
