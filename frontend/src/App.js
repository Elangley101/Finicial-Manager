import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios for API calls
import DashboardPage from './pages/DashboardPage';
import BudgetPage from './pages/BudgetPage';
import GoalsPage from './pages/GoalsPage';
import InvestmentPage from './pages/InvestmentPage';
import TransactionsPage from './pages/TransactionsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import ReferralRewardsPage from './pages/ReferralRewardsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import AccountsPage from './pages/AccountsPage';
import SessionExpiredModal from './components/SessionExpiredModal';  // Import your modal
import StarBackground from './components/StarBackground';

const App = () => {
  <StarBackground />  
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const navigate = useNavigate();  // Hook for programmatic navigation

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');  // Redirect to login page after logging out
  };

  // Function to reauthenticate using refresh token
  const handleReauth = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      try {
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refresh_token,
        });
        localStorage.setItem('access_token', response.data.access);  // Update the access token
        setIsSessionExpired(false);  // Close the modal
      } catch (error) {
        console.error('Error refreshing token:', error);
        handleLogout();  // Logout and redirect if refreshing fails
      }
    } else {
      handleLogout();  // If no refresh token, force logout
    }
  };

  // Axios interceptor to catch token expiration and show reauthentication modal
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          // If 401 (unauthorized), show session expired modal
          setIsSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );

    // Clean up interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <div>
      {/* Show modal when session expires */}
      {isSessionExpired && (
        <SessionExpiredModal onLogout={handleLogout} onReauth={handleReauth} />
      )}

      {/* Routes for different pages */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/investment" element={<InvestmentPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/referral-rewards" element={<ReferralRewardsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
      </Routes>
    </div>
  );
};

export default App;
