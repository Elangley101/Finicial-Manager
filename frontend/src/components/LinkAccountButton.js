// ./components/LinkAccountButton.js
import React from 'react';

const LinkAccountButton = ({ onLinkAccount }) => {
    return (
        <button onClick={onLinkAccount} className="link-account-button">
            Link a New Account
        </button>
    );
};

export default LinkAccountButton;
