import React from 'react';
import Insights from '../components/Insights';
import Dashboard from '../components/Dashboard';
import DebtOverview from '../components/DebtOverview';
import SpendingInsights from '../components/SpendingInsights';
import InvestmentPerformance from '../components/InvestmentPerformance';

const DashboardPage = () => {
    return (
        <div className="dashboard-page">
            <h1>Dashboard</h1>
            <InvestmentPerformance />
            <CreditScore />
            <BillReminders />
            <GoalRecommendations />
            <SpendingInsights />
            <DebtOverview />
            <Dashboard />
            <Insights />
            <CurrencyExchange />
            <FraudAlerts />
            <TaxReport />
        </div>
    );
};

export default DashboardPage;
