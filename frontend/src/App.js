import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Remove Router import
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

const App = () => {
  return (
    <Routes> {/* No need for <Router> here */}
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
  );
}

export default App;
