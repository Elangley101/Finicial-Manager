import React from 'react';
import Login from '../components/Login';
import '../css/LoginPage.css';
const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Financial Manager</h1>
                <p className="login-subtitle">Manage your finances with ease</p>
                <Login />
            </div>
        </div>
    );
};

export default LoginPage;
