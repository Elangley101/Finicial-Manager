import React from 'react';
import Insights from '../components/Insights';
import Dashboard from '../components/Dashboard';
import DebtOverview from '../components/DebtOverview';

const DashboardPage = () => {
    return (
        <div className="dashboard-page">
            <h1>Dashboard</h1>
            {/* Other dashboard components */}
            <DebtOverview />
            {/* Other dashboard components */}
            <Dashboard />
            <Insights />
        </div>
    );
};

export default DashboardPage;
