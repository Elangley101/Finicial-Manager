import React, { useState, useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { usePlaidLink } from 'react-plaid-link';  // Import Plaid Link SDK
import './css/Login.css';  // Import custom styles

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useContext(AuthContext);  // Access loginUser from AuthContext
    const [error, setError] = useState('');
    const [linkToken, setLinkToken] = useState(null);  // State to store Plaid link token
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent page reload
        const plaidLinkToken = await loginUser(email, password);  // Call loginUser from AuthContext

        if (plaidLinkToken) {
            setLinkToken(plaidLinkToken);  // Set the Plaid link token if login succeeds
        } else {
            setError('Login failed or Plaid link token could not be retrieved');
        }
    };

    // Initialize Plaid Link when the link token is available
    const { open, ready } = usePlaidLink({
        token: linkToken,  // Plaid link token retrieved after login
        onSuccess: (public_token, metadata) => {
            // Send the public_token to your backend for token exchange
            fetch('/api/exchange_public_token/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,  // Send access token for authentication
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ public_token }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Successfully linked bank accounts:', data);
                navigate('/dashboard');  // Navigate to dashboard after success
            })
            .catch(error => console.error('Error exchanging Plaid public token:', error));
        },
        onExit: (err, metadata) => {
            if (err != null) {
                // Handle the case when Plaid Link is closed by the user or an error occurs
                console.error('Plaid link error:', err);
            }
        }
    });

    // Automatically open Plaid Link once the user is authenticated and the link token is available
    useEffect(() => {
        if (linkToken && ready) {
            open();  // Open Plaid Link UI once ready
        }
    }, [linkToken, ready]);

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Login</h1>
                <form onSubmit={handleSubmit} className="login-form">
                    {error && <p className="error-message">{error}</p>}
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
