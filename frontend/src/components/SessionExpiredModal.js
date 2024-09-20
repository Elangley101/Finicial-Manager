import React from 'react';
import '../css/Modal.css';

const SessionExpiredModal = ({ onLogout, onReauth }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Session Expired</h2>
        <p>Your session has expired. Please log in again to continue.</p>
        <button onClick={onReauth}>Reauthenticate</button>
        <button onClick={onLogout}>Log Out</button>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
