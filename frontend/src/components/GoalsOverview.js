import React from 'react';
import { Progress } from 'antd'; // Import the Progress component from Ant Design

// Mock Data (Replace this with real data from props or state)
const goals = [
  {
    id: 1,
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 2500,
  },
  {
    id: 2,
    name: 'Vacation Fund',
    targetAmount: 3000,
    currentAmount: 1800,
  },
  {
    id: 3,
    name: 'New Car',
    targetAmount: 20000,
    currentAmount: 5000,
  },
];

const GoalsOverview = () => {
  return (
    <div className="goals-overview" style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#343a40' }}>Goals Overview</h2>
      <div className="goals-list">
        {goals.map(goal => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100;

          return (
            <div key={goal.id} className="goal-item" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
              <h3 style={{ color: '#495057' }}>{goal.name}</h3>
              <p style={{ color: '#6c757d' }}>Target: ${goal.targetAmount.toFixed(2)}</p>
              <p style={{ color: '#6c757d' }}>Saved: ${goal.currentAmount.toFixed(2)}</p>
              <Progress percent={progress} status={progress >= 100 ? 'success' : 'active'} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GoalsOverview;
