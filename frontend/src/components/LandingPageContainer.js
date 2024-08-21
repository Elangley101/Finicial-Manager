

import React from 'react';
import { Link } from 'react-router-dom';

const LandingPageContainer = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to Financial Manager</h1>
            <p>Please login or register to continue</p>
            <div>
                <Link to="/login">
                    <button style={{ marginRight: '20px' }}>Login</button>
                </Link>
                <Link to="/signup">
                    <button>Register</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPageContainer;
