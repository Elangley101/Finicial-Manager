// src/components/PlaidReauthenticate.js

import React, { useEffect } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { useNavigate } from 'react-router-dom';

const PlaidReauthenticate = ({ linkToken }) => {
    const navigate = useNavigate();

    const { open, ready } = usePlaidLink({
        token: linkToken,  // Link token for Plaid re-authentication
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
                console.log('Successfully re-authenticated:', data);
                navigate('/dashboard');  // Navigate back to dashboard
            })
            .catch(error => console.error('Error exchanging Plaid public token:', error));
        },
        onExit: (err, metadata) => {
            if (err != null) {
                console.error('Error during Plaid re-authentication:', err);
            }
        },
    });

    // Automatically open Plaid Link once the user is authenticated and the link token is available
    useEffect(() => {
        if (ready) {
            open();  // Open Plaid Link UI once ready
        }
    }, [ready, open]);

    return <div>Re-authenticating with Plaid...</div>;
};

export default PlaidReauthenticate;
