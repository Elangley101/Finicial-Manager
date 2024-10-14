import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const TaxReport = () => {
    const [report, setReport] = useState(null);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const fetchTaxReport = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/tax-report/', {
                    headers: {
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });
                setReport(response.data);
            } catch (error) {
                console.error('Error fetching tax report:', error);
            }
        };

        fetchTaxReport();
    }, [authTokens]);

    if (!report) return <div>Loading...</div>;

    return (
        <div className="tax-report">
            <h2>Tax Report for {report.year}</h2>
            <p>Total Deductible Expenses: ${report.total_deductible.toFixed(2)}</p>
            <p>Report Generated On: {new Date(report.created_at).toLocaleDateString()}</p>
            {/* Add more insights or export options as needed */}
        </div>
    );
};

export default TaxReport;

