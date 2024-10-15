import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContextProvider } from './context/ThemeProviderComponent';
import { LanguageProvider } from './context/LanguageProvider';
import LandingPage from './pages/LandingPage';
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
import AccountsPage from './pages/AccountsPage';
import SessionExpiredModal from './components/SessionExpiredModal';
import StarBackground from './components/StarBackground';

const App = () => {
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const handleReauth = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      try {
        const response = await axios.post('http://localhost:8000/api/token/refresh/', {
          refresh: refresh_token,
        });
        localStorage.setItem('access_token', response.data.access);
        setIsSessionExpired(false);
      } catch (error) {
        console.error('Error refreshing token:', error);
        handleLogout();
      }
    } else {
      handleLogout();
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          setIsSessionExpired(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <ThemeContextProvider>
      <LanguageProvider>
        <StarBackground />
        <div>
          {isSessionExpired && (
            <SessionExpiredModal onLogout={handleLogout} onReauth={handleReauth} />
          )}
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
      </LanguageProvider>
    </ThemeContextProvider>
  );
};

export default App;
